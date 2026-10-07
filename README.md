# Worker Previews Workshop

Public follow-along site for the Worker Previews Connect workshop:

0. Check your setup (tools, sign-ins, Cloudflare account)
1. Deploy the demo app via the Deploy to Cloudflare button (production D1, seeded)
2. Get the code: clone, install, restart the agent in the repo
3. Configure Previews: new branch, Preview-only D1 database, `previews` block
4. Open a pull request; Workers Builds deploys the Preview
5. Apply a Preview-only candidate schema and expose a real delete failure
6. Connect the Observability MCP server and diagnose it in that Preview's logs
7. The agent fixes and re-tests on the Preview; the attendee approves the merge
8. Full flow: one prompt takes a new feature from branch to tested pull request

Every step is agent-first: a one-line why, one copyable prompt, and a "Try it yourself" tip for
what the attendee checks with their own eyes. Attendees don't type commands.

## Prompt conventions

- **Teaching format** (Steps 3–8): each prompt asks for a bold one-line heading per action, then a
  `>` quote with one or two plain sentences on why it matters, with no label. Per-action
  `Explain:` hints steer the topic.
- **Setup format** (Steps 0, 2): "before each command, tell me in one line what it does."
- The agent does the work. Sign-ins that open a browser (`gh auth login`, `npx wrangler login`,
  `gh auth refresh`) are run by the attendee, never by the agent.
- Ask before installing or deleting anything. Never merge without the attendee's approval.
- End with a call to action: the links the attendee should open, each on its own line.
- Keep replies short: no file dumps, show only changed lines.

Companion app repo: [`d1-template-preview`](https://github.com/thomas-desmond/d1-template-preview).

## Develop

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run deploy
```

Static Astro site → Workers static assets via `wrangler.jsonc`.

## Stack

Astro (static) · React islands · Tailwind v4 · `@cloudflare/kumo`

## Content

Step copy and agent prompts live in:

- `src/pages/index.astro`: page structure and step prose
- `src/lib/site.ts`: site metadata, step nav, all agent prompts

Prefer editing prompts in `site.ts` so the React prompt components stay in sync.
