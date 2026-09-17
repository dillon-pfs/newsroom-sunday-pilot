import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { resolve, relative, join, sep } from "node:path";
import { parseDocument } from "yaml";
import { z } from "zod";
import { visit } from "unist-util-visit";
import { CAST } from "../cast.ts";
import { games, publicLiveEntries } from "../live/catalog.ts";
import { parseMarkdown, renderMarkdown } from "./markdown.ts";

const requiredText = z.string().trim().min(1, "Add a non-empty value.");
const schema = z.object({
  title: requiredText,
  slug: requiredText.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by single hyphens, e.g. sunday-desk-notes."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a quoted YYYY-MM-DD date.").refine((date) => {
    const value = new Date(`${date}T00:00:00Z`);
    return Number.isFinite(value.getTime()) && value.toISOString().slice(0, 10) === date;
  }, "Use a real calendar date in YYYY-MM-DD format."),
  voiceId: requiredText.refine((id) => CAST.some((voice) => voice.slug === id), `Choose a cast voiceId: ${CAST.map((voice) => voice.slug).join(", ")}.`),
  dek: z.string().default(""),
  label: z.enum(["SATIRE", "DEMO / SATIRE"], { error: 'Choose label: "SATIRE" or "DEMO / SATIRE".' }),
  bylineDetail: requiredText.optional(),
  relatedGameHref: requiredText.optional(),
  relatedGameLabel: requiredText.optional(),
  order: z.number().int().nonnegative().default(0),
}).strict();

export type Story = z.infer<typeof schema> & {
  dateLabel: string;
  demo: boolean;
  body: string;
  html: string;
};

export class FilingError extends Error {
  constructor(public issues: string[]) {
    super(`Story filing failed:\n${issues.map((issue) => `- ${issue}`).join("\n")}`);
    this.name = "FilingError";
  }
}

// Same visible-copy rules as #17. Classification labels and path/voice IDs
// are metadata, not public prose; they are checked by the schema instead.
const copyRules = [/\bDillon\b/i, /\bDEMO\b/, /\bSATIRE\b/i, /\bGitHub\b/i, /github\.com/i, /vercel\.app/i, /\/workspace\b/, /\bAstra\b/, /\bCodex\b/, /\bCursor\b/, /\bprocess\b/i];

export function parseStory(file: string, source: string) {
  const issues: string[] = [];
  const report = (field: string, correction: string) => issues.push(`${file} — ${field}: ${correction}`);
  const match = source.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new FilingError([`${file} — frontmatter: Start with YAML between two --- lines; copy docs/stories/TEMPLATE.md.`]);
  let metadata: unknown;
  try {
    const document = parseDocument(match[1], { uniqueKeys: true });
    if (document.errors.length) throw new Error(document.errors.map((error) => error.message).join("; "));
    metadata = document.toJS({ maxAliasCount: 0 });
  } catch (error) {
    throw new FilingError([`${file} — frontmatter: Fix the YAML syntax (${error instanceof Error ? error.message : "invalid YAML"}). Quote text containing colons; do not use aliases.`]);
  }
  const result = schema.safeParse(metadata);
  if (!result.success) {
    for (const issue of result.error.issues) report(issue.path.join(".") || "frontmatter", `${issue.message} Use the documented field names and types in docs/stories/TEMPLATE.md.`);
    throw new FilingError(issues);
  }
  const data = result.data;
  const body = match[2].trim();
  const { tree, anchors } = parseMarkdown(body);
  let readable = false;
  const links: Array<{ field: string; href: string }> = [];
  const definitions = new Map<string, string>();
  visit(tree, "definition", (node) => { definitions.set(node.identifier, node.url); });
  visit(tree, (node) => {
    const field = `body:${node.position?.start.line ?? 1}`;
    if ((node.type === "text" || node.type === "inlineCode" || node.type === "code") && node.value.trim()) readable = true;
    if (node.type === "html") report(field, "Remove raw HTML/JSX. Use plain Markdown headings, lists, links and tables.");
    if (node.type === "heading" && node.depth === 1) report(field, "Use ## or smaller headings; the frontmatter title supplies the page heading.");
    if (node.type === "link" || node.type === "image" || node.type === "definition") links.push({ field, href: node.url });
    if (node.type === "linkReference" || node.type === "imageReference") {
      if (!definitions.has(node.identifier)) report(field, `Add the missing [${node.identifier}]: URL definition or use an inline Markdown link.`);
    }
  });
  if (!readable) report("body", "Add story paragraphs below the closing ---; a blank file or only separators is not a story.");
  for (const [field, value] of Object.entries({ title: data.title, dek: data.dek, bylineDetail: data.bylineDetail, relatedGameLabel: data.relatedGameLabel, body })) {
    if (!value) continue;
    const text = value.replaceAll("wes-process", "wes");
    for (const rule of copyRules) if (rule.test(text)) report(field, `Remove or rewrite public wording matching ${rule}. Keep internal names/references out of copy and classification words in label only (#17).`);
  }
  if (data.relatedGameHref) {
    if (!data.relatedGameHref.startsWith("/games/")) report("relatedGameHref", "Use an existing /games/<id> path; omit this field when there is no related game.");
    links.push({ field: "relatedGameHref", href: data.relatedGameHref });
  }
  if (data.relatedGameLabel && !data.relatedGameHref) report("relatedGameLabel", "Add relatedGameHref or remove the orphaned label.");
  if (issues.length) throw new FilingError(issues);
  const story: Story = {
    ...data, body, html: renderMarkdown(tree), demo: data.label === "DEMO / SATIRE",
    dateLabel: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${data.date}T00:00:00Z`)),
  };
  return { file, story, anchors, links };
}

function routeInventory(root: string) {
  const routes = new Map<string, Set<string>>();
  const app = join(root, "app");
  for (const entry of readdirSync(app, { recursive: true })) {
    const path = String(entry).split(sep).join("/");
    if (!/(^|\/)page\.[jt]sx?$/.test(path) || path.includes("[")) continue;
    const route = "/" + path.replace(/(^|\/)page\.[jt]sx?$/, "").replace(/\([^/]+\)\//g, "");
    routes.set(route, new Set());
  }
  for (const voice of CAST) {
    routes.set(`/cast/${voice.slug}`, new Set());
    routes.set(`/bloggers/${voice.slug}`, new Set());
  }
  routes.set("/bloggers/lead-blogger", new Set());
  for (const game of games) {
    const anchors = new Set(publicLiveEntries.filter((entry) => entry.gameId === game.id).map((entry) => entry.id));
    routes.set(`/games/${game.id}`, anchors);
    if (game.liveBlogEnabled) routes.set(`/games/${game.id}/delayed`, anchors);
  }
  routes.set("/games/demo", routes.get("/games/sunday-pilot") ?? new Set());
  return routes;
}

export function loadStories(directory = resolve("content/stories"), root = process.cwd()): Story[] {
  const issues: string[] = [];
  const parsed: ReturnType<typeof parseStory>[] = [];
  if (!existsSync(directory)) throw new FilingError([`${directory} — directory: Create content/stories and add a .md file using the Editor template.`]);
  for (const name of readdirSync(directory).sort()) {
    const file = relative(root, join(directory, name));
    if (!name.endsWith(".md")) {
      issues.push(`${file} — filename: Keep only plain .md story files here. Move guides/templates to docs/stories; MDX is not supported.`);
      continue;
    }
    try {
      parsed.push(parseStory(file, readFileSync(join(directory, name), "utf8")));
    } catch (error) {
      if (error instanceof FilingError) issues.push(...error.issues);
      else throw error;
    }
  }
  const routes = routeInventory(root);
  const slugs = new Map<string, string>();
  for (const item of parsed) {
    const previous = slugs.get(item.story.slug);
    if (previous) issues.push(`${item.file} — slug: "${item.story.slug}" is already used by ${previous}. Choose a unique slug; preserve existing public URLs.`);
    slugs.set(item.story.slug, item.file);
    routes.set(`/stories/${item.story.slug}`, item.anchors);
  }
  for (const { file, story, links } of parsed) {
    for (const { field, href } of links) {
      let url: URL;
      try { url = new URL(href, `https://poorformsports.com/stories/${story.slug}`); }
      catch { issues.push(`${file} — ${field}: Fix the malformed URL "${href}".`); continue; }
      if (!["https:", "http:", "mailto:"].includes(url.protocol)) {
        issues.push(`${file} — ${field}: Replace "${href}" with an https URL or a known internal path; executable/data URLs are disabled.`);
        continue;
      }
      if (!["poorformsports.com", "www.poorformsports.com", "newsroom-sunday-pilot.vercel.app"].includes(url.hostname)) continue;
      let pathname: string;
      let anchor: string;
      try { pathname = decodeURIComponent(url.pathname).replace(/\/$/, "") || "/"; anchor = decodeURIComponent(url.hash.slice(1)); }
      catch { issues.push(`${file} — ${field}: Fix invalid percent encoding in "${href}".`); continue; }
      const asset = resolve(root, "public", "." + pathname);
      const publicRoot = resolve(root, "public") + sep;
      const isAsset = asset.startsWith(publicRoot) && existsSync(asset) && statSync(asset).isFile();
      if (!routes.has(pathname) && !isAsset) issues.push(`${file} — ${field}: "${href}" has no known page or public asset. Use an existing /games, /cast or /stories URL (or fix the target file).`);
      else if (anchor && !isAsset && !routes.get(pathname)?.has(anchor)) issues.push(`${file} — ${field}: "${href}" has no known anchor. Use a story heading ID (story-heading-text), an existing game entry ID, or remove the fragment.`);
    }
  }
  if (issues.length) throw new FilingError(issues);
  return parsed.map(({ story }) => story).sort((a, b) => b.date.localeCompare(a.date) || a.order - b.order || a.slug.localeCompare(b.slug));
}
