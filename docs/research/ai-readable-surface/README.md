# Poor Form Sports: AI-readable surface
Date: September 16, 2026 (America/Chicago). Approval memo; no Production changes.

## Decision in one read

**Do:** Keep visible SATIRE / DEMO labels, publish a small linked identity guide, permit search discovery, and later align canonical URLs, sitemap, and truthful structured data.
**Don't:** Promise AI placement, call fictional personas journalists, expose score-shaped DEMO data as real events, or treat a crawler file as a safety guarantee.

This small PR publishes only `public/llms.txt`. The files beside this memo are approval-ready drafts, not deployed policy or JSON-LD. No UI, provider, environment, redirect, or Production changes. Canonical/sitemap/schema work waits until after TNF.

## Findings on current main

Audited main `7f4f5f2`. HTTPS HEAD to https://poorformsports.com returned 200 with certificate validation enabled (03:04 UTC September 17 / evening September 16 Chicago). This checks one location, not worldwide propagation; recheck before canonical rollout.
Public `/robots.txt` and `/sitemap.xml` both returned 404. No robots, sitemap, llms, or JSON-LD implementation found in the inspected source.

Existing positives: server-rendered public pages; DEMO/SATIRE pills on stories; /about distinguishes comedy from facts; shared OG/Twitter metadata and locked wordmark.
Gaps: `app/layout.tsx` still uses the Vercel hostname as metadataBase. `lib/share.ts` supplies images and descriptions but no canonical, og:url, or social account attribution. /about has title-only metadata. Keep brand art; no new OG design needed. Before schema rollout, visibly state that cast personas are fictional and the brand is not NFL-affiliated, including on relevant profile/about pages.

## Files and standards

- **llms.txt:** Low-cost curated reading map, not a ranking mechanism, access control, or accepted licensing instruction. Include mission, identity, fictional cast lanes, disclaimer, stable links, and verified brand accounts. Exclude live score payloads, copied DEMO play-by-play, internal review routes, and secrets. The community proposal is optional; Google explicitly says new AI text files or special markup are unnecessary for its AI search features. [Proposal](https://llmstxt.org/) · [Google AI guidance](https://developers.google.com/search/docs/appearance/ai-features)
- **llms-full.txt:** Defer. A second manually maintained content corpus adds drift and strips local labels. If later requested by an actual consumer, generate: identity/disclaimer → cast summaries → selected labeled story excerpts with canonical links → source revision. Repeat DEMO/SATIRE at each excerpt; omit score tables and private content.
- **ai.txt / other emerging files:** No demonstrated requirement in the provider guidance reviewed. Do not add speculative files or a paid “AI indexing” service. Revisit only when a target consumer documents a supported format. This is a scoped recommendation, not a claim that no emerging proposals exist.
- **Sitemap + canonicals:** Generate stable public URLs from cast/story modules plus the three DEMO routes and /about. Exclude API, private review, and transient score-detail routes. Never manufacture lastmod timestamps on every build. Use route-specific self-canonicals on poorformsports.com, consistent absolute OG URLs, and the same origin in sitemap/schema. Never inherit a home canonical across every page. Sitemap is a discovery hint, not guaranteed indexing. Redirecting the alternate hostname needs a separately approved post-TNF deployment/settings change. [Canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) · [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)

## Recommended crawler policy — approval required

| Agent/token | Recommendation | Reason / tradeoff |
| --- | --- | --- |
| Googlebot, Bingbot | Allow public pages | Preserve ordinary search discovery; do not blanket-block Google. |
| OAI-SearchBot | Allow | ChatGPT search discovery is independent of GPTBot training. |
| ChatGPT-User | Allow public retrieval | User-initiated visits; OpenAI says robots may not apply to these requests. |
| GPTBot | Disallow | Conservative training opt-out; no guarantee of erasing existing training or stopping third-party reuse. |
| Claude-SearchBot, Claude-User | Allow | Preserve Claude search and user-requested retrieval. |
| ClaudeBot | Disallow | Separate training crawler. |
| Google-Extended | Disallow initially | Controls Gemini training AND certain Gemini/Vertex grounding; blocking sacrifices that grounding. Does not control Google Search inclusion/ranking. Reconsider if Gemini reach is a priority. |
| Bytespider | Disallow | Conservative default for a ByteDance AI crawler; no separate discovery-only control established in this review. |
| Other agents | Default allow, review deliberately | This is not an exhaustive training opt-out; keep unknown search discovery working. |

Roles verified using [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots), [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Google crawler controls](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), and [Cloudflare's bot registry](https://developers.cloudflare.com/ai-crawl-control/reference/bots/).

The adjacent robots diff permits discovery through the wildcard group and blocks four named tokens. It does not require redundant per-search-agent groups. If adding specific groups later, repeat relevant path restrictions: wildcard rules are not automatically inherited. Robots is advisory, not authentication or a noindex directive. Protect private content with access control; do not assume Disallow removes an indexed URL. A blocked page cannot reliably deliver a crawl-visible noindex instruction. [Robots specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)

## Structured data plan

Home: Organization + WebSite. Desk represents the organization, not a seventh real journalist.
Cast: ProfilePage with Person mainEntity, explicitly described as a fictional persona; no invented credentials, awards, employer history, or real-world biographical dates. Schema also uses Person for fictional characters in CreativeWork. [Character property](https://schema.org/character)

Stories: Article, genre “Satire” and “DEMO”, entertainment description, fictional author identity, publisher, canonical page, /about editorial principles. Article already inherits CreativeWork. Do not label these NewsArticle, LiveBlogPosting, SportsEvent results, or ClaimReview.
The current [SatiricalArticle definition](https://schema.org/SatiricalArticle) is a subtype of Article and explicitly need not be NewsArticle. It is a possible later refinement; generic Article + explicit satire fields is the conservative draft here. No invented “isSatire” property.

Three adjacent JSON files are ready-to-adapt stubs for home, Chip, and the existing Likely story. They must match visible page text when wired. Use safe JSON serialization (escape '<' as '\\u003c') in script tags; omit unknown dates instead of using deployment time. JSON-LD labels aid interpretation but cannot force an assistant's answer.

## OG / Twitter follow-up — gap analysis only

Keep existing locked image and large-image cards. Set canonical metadataBase after recheck; route-specific og:url; twitter:site @PoorFormSports and creator @ChipAbsolute only for Chip-authored pages. Keep SATIRE in all comedy descriptions and DEMO in archive descriptions/titles. Add fictional-persona wording on cast cards. Do not call all future live-score content DEMO. Check actual rendered tags on home, /about, /cast, Chip, /stories, Likely, and all three games; don't rely on helper code alone.

## Risks and release gate

- **Satire ingested as fact:** Keep framing in visible headings/deks, page metadata, guide, and schema. Never export DEMO scores as factual sports results. Training opt-outs reduce some access, not all misunderstanding.
- **Impersonation:** sameAs links only to the two owner-confirmed accounts. No invented handles, NFL organization IDs, or real reporter credentials.
- **NFL branding:** Use only descriptive football references; state independent / not affiliated or endorsed. Don't use league logos or affiliation schema as trust badges. This is product labeling, not legal clearance.
- **Stale guide:** Update llms whenever cast/route identity changes; factual sports content remains at its source, not duplicated here.
- **Preview safety:** Keep deployment protection/noindex intact. Approving a draft PR is not permission to merge main. No production merge, crawler submission, redirect, or environment edit in this ticket.

## Post-TNF approval checklist

1. Approve/adjust training policy, especially Google-Extended's grounding tradeoff.
2. Add visible fictional-cast/non-affiliation language before wiring schema.
3. Implement canonical URLs + generated sitemap together; then activate robots diff and its Sitemap line.
4. Verify SSL, rendered tags/JSON-LD, every sitemap URL, and Preview noindex/protection; owner approves Production merge.
5. Optionally submit the public sitemap through the owner's search tools. No promise of AI inclusion.

## Verification for this PR

- Existing NFL unit suite: 23 passed, 0 failed (local fixtures; no live-provider drill).
- ESLint and standalone TypeScript check: passed.
- Optimized production-mode build: passed with webpack; 37 static pages generated. Initial sandbox attempt could not resolve Google Fonts; network-enabled rerun passed without source changes.
- All three JSON drafts parse; draft and published llms text match; 17 custom-domain references resolve against static routes or dynamic cast/story/game catalogs.
- Proposed robots patch passes `git apply --check`; it was NOT applied. Sitemap remains a documented follow-up, not a shipped feature.
- No existing application files changed; no dependencies, environment variables, provider files, or Production settings changed. No merge authorized.
