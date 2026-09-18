# Worker Previews Workshop

Public follow-along site for the Worker Previews Connect workshop:

1. Deploy the demo app via the Deploy to Cloudflare button (production D1, seeded)
2. Isolate a resource — new branch, new D1 database, `previews` override
3. Open a pull request, Workers Builds deploys the Preview
4. Prove isolation — add/delete entries in the Preview, confirm production is untouched
5. Observability — Preview vs. production logs/traces
6. TBD — final step, pending a conversation with Yomna (PM)

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

- `src/pages/index.astro` — page structure and step prose
- `src/lib/site.ts` — site metadata, step nav, all agent prompts

Prefer editing prompts in `site.ts` so the React prompt components stay in sync.
