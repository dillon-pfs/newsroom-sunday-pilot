import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, RootContent } from "mdast";
import type { Root as HtmlRoot } from "hast";

const parser = unified().use(remarkParse).use(remarkGfm);

function textContent(node: Root | RootContent): string {
  if ("value" in node) return node.value;
  if ("children" in node) return node.children.map((child) => textContent(child as RootContent)).join("");
  return "";
}

export function parseMarkdown(body: string) {
  const tree = parser.parse(body);
  const anchors = new Set<string>();
  visit(tree, "heading", (node) => {
    const base = "story-" + (textContent(node).toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-") || "section");
    let id = base;
    let suffix = 1;
    while (anchors.has(id)) id = `${base}-${suffix++}`;
    anchors.add(id);
    node.data = { ...node.data, hProperties: { id } };
  });
  return { tree, anchors };
}

const renderer = unified()
  // No rehype-raw or MDX: HTML nodes are dropped, never evaluated.
  .use(remarkRehype)
  .use(rehypeSanitize, { ...defaultSchema, clobberPrefix: "" })
  .use(() => (tree: HtmlRoot) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "th") node.properties.scope = "col";
      if (node.tagName === "table" && parent && typeof index === "number") {
        parent.children[index] = {
          type: "element", tagName: "div", properties: { className: ["story-table"], tabIndex: 0, role: "region", ariaLabel: "Story table" }, children: [node],
        };
        return index + 1;
      }
    });
  })
  .use(rehypeStringify);

export function renderMarkdown(tree: Root): string {
  return renderer.stringify(renderer.runSync(tree));
}

export function markdownText(body: string): string {
  return textContent(parser.parse(body));
}
