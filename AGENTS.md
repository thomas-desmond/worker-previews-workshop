## Development

When starting the dev server, use background mode if available:

```
astro dev
```

## Documentation

Full documentation: https://docs.astro.build

- [Routing](https://docs.astro.build/en/guides/routing/)
- [Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Framework components](https://docs.astro.build/en/guides/framework-components/)
- [Styling / Tailwind](https://docs.astro.build/en/guides/styling/)

## Content

Step copy and agent prompts live in:

- `src/pages/index.astro` — page structure and step prose
- `src/lib/site.ts` — site metadata, step nav, all agent prompts

Prefer editing prompts in `site.ts` so the React prompt components stay in sync.
