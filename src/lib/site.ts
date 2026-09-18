export const SITE = {
	title: "Worker Previews Workshop",
	tagline: "Isolated environments for every change your agent makes.",
	description:
		"A follow-along: deploy a real app to Cloudflare, then give one branch its own isolated D1 database with a Preview deployment — and prove it never touches production.",
	duration: "30–40 min",
	audience: "Developers",
} as const;

export const STEPS = [
	{ id: "prereqs", num: "0", label: "Before you start", short: "Prereqs" },
	{ id: "deploy", num: "1", label: "Deploy to Cloudflare", short: "Deploy" },
	{ id: "isolate", num: "2", label: "Isolate a resource", short: "Isolate" },
	{ id: "preview", num: "3", label: "Open your Preview", short: "Preview" },
	{ id: "interact", num: "4", label: "Prove isolation", short: "Prove it" },
	{ id: "observability", num: "5", label: "Observability", short: "Observe" },
	{ id: "final", num: "6", label: "TBD", short: "TBD" },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export const REPO_URL = "https://github.com/thomas-desmond/d1-template-preview";

export const PROMPTS = {
	isolateResource: `I'm on a new git branch off main in this repo. Give this branch its own isolated D1 database as a Preview override:

1. Run \`npx wrangler d1 create <pick-a-short-name>-preview-db\` to create a brand new D1 database — don't reuse the production one.
2. In \`wrangler.json\`, add a \`previews.d1_databases\` block using binding name \`DB\` (same binding name as the top-level production entry) with the \`database_id\` and \`database_name\` from step 1.
3. Do not modify the top-level \`d1_databases\` entry — that's production, leave it alone.
4. Commit the change.

Don't ask me questions — pick a reasonable database name yourself and just do it.`,

	openPullRequest: `Push this branch and open a pull request against main using the GitHub CLI (\`gh pr create\`). Give it a short, clear title. Print the PR URL when done.`,
} as const;
