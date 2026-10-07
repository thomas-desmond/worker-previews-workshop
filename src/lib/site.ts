export const SITE = {
	title: "Worker Previews Workshop",
	tagline: "Isolated environments for every change your agent makes.",
	description:
		"Deploy a production Worker, test a candidate D1 schema safely in a Preview, diagnose a real failure, and merge a fix without changing production data.",
	audience: "Developers",
} as const;

export const LINKS = {
	blog: "https://blog.cloudflare.com/worker-previews/",
	docs: "https://developers.cloudflare.com/workers/previews/",
	configDocs: "https://developers.cloudflare.com/workers/previews/configuration/",
} as const;

export const LEARNING_OBJECTIVES = [
	"Give every branch its own Preview, with its own URL, database, and logs, isolated from production.",
	"Let your agent test, debug, and fix its own work on that Preview, then approve the merge from what it shows you.",
] as const;

export const STEPS = [
	{
		id: "prereqs",
		num: "0",
		label: "Check your setup",
		short: "Setup",
	},
	{
		id: "deploy",
		num: "1",
		label: "Deploy to Cloudflare",
		short: "Deploy",
	},
	{
		id: "clone",
		num: "2",
		label: "Get the code",
		short: "Clone",
	},
	{
		id: "isolate",
		num: "3",
		label: "Configure Previews",
		short: "Configure",
	},
	{
		id: "preview",
		num: "4",
		label: "Open your Preview",
		short: "Preview",
	},
	{
		id: "interact",
		num: "5",
		label: "Apply and test",
		short: "Test",
	},
	{
		id: "observability",
		num: "6",
		label: "Observability",
		short: "Observe",
	},
	{
		id: "final",
		num: "7",
		label: "Fix and merge",
		short: "Fix",
	},
	{
		id: "your-turn",
		num: "8",
		label: "Your turn (optional)",
		short: "Your turn",
	},
] as const;

export type StepId = (typeof STEPS)[number]["id"];

export const REPO_URL = "https://github.com/thomas-desmond/worker-previews-starter";

/** Remote Workers Observability MCP server. The starter repo ships config for it. */
export const OBSERVABILITY_MCP_URL = "https://observability.mcp.cloudflare.com/mcp";

/**
 * How to sign in to the Observability MCP server, per agent (Step 6).
 * Backticks in steps render as inline code. `command` renders as a copyable terminal block.
 */
export type McpAgent = { id: string; name: string; steps: string[]; command?: string };

export const MCP_AGENTS: McpAgent[] = [
	{
		id: "claude-code",
		name: "Claude Code",
		steps: ["Approve the project's MCP server when asked.", "Run `/mcp`, pick `cloudflare-observability`, and authenticate."],
	},
	{
		id: "cursor",
		name: "Cursor",
		steps: ["Open **Cursor Settings → MCP**.", "Enable `cloudflare-observability` and click **Connect**."],
	},
	{
		id: "vscode",
		name: "VS Code",
		steps: ["Open `.vscode/mcp.json` and click **Start** above the server.", "Sign in with Cloudflare.", "Use Copilot Chat in **Agent** mode."],
	},
	{
		id: "opencode",
		name: "OpenCode",
		steps: ["Run this in the repo folder, then sign in with Cloudflare:"],
		command: "opencode mcp auth cloudflare-observability",
	},
	{
		id: "codex",
		name: "Codex",
		steps: ["Trust the project when asked.", "Run this, then sign in with Cloudflare:"],
		command: "codex mcp login cloudflare-observability",
	},
	{
		id: "other",
		name: "Other",
		steps: ["Add a remote MCP server with this URL, then sign in with Cloudflare:"],
		command: OBSERVABILITY_MCP_URL,
	},
];

/** Deterministic steps: the primary path is a command the attendee runs. */
export const COMMANDS = {
	// One command per line, no `&&`: Windows PowerShell 5.1 doesn't support `&&`.

	mergePullRequest: `gh pr merge --merge`,

	cleanup: `npx wrangler delete worker-previews-starter
npx wrangler d1 delete activity-log-db
npx wrangler d1 delete workshop-preview-db
gh repo delete worker-previews-starter --yes`,
} as const;

export const PROMPTS = {
	checkPrereqs: `Check that my machine is ready for the Cloudflare Worker Previews workshop. Before each command, tell me in one line what it does.

1. Check: \`node -v\` (v20 or newer), \`git --version\`, \`gh auth status\`, \`npx wrangler whoami\`.
2. Missing or outdated tool: tell me the install command for my OS and ask before you run it.
3. Not signed in to GitHub or Cloudflare: don't sign in for me. Tell me to run \`gh auth login\` or \`npx wrangler login\` myself (they open my browser), wait for me, then check again.
4. More than one Cloudflare account: list them and tell me to run \`export CLOUDFLARE_ACCOUNT_ID=<id>\` (PowerShell: \`$env:CLOUDFLARE_ACCOUNT_ID="<id>"\`) in the terminal I start you from, then restart you there.

Ignore Wrangler warnings about missing optional permissions: the workshop doesn't need them.

Finish with a short table (tool, status, version or account), then "Ready" or what's left to fix. Don't clone or deploy anything yet.`,

	clone: `Get my copy of the Cloudflare Worker Previews workshop repo onto this machine. Before each command, tell me in one line what it does.

1. Clone it: \`gh repo clone worker-previews-starter\`. Not found? I renamed it in the deploy form: ask me for the name.
2. Inside the folder, run \`npm install\`. Ignore npm audit warnings.
3. In plain language, tell me what this app is: at most three short sentences, no file names or code. Cover what it does, where its data lives, and that the repo includes rules and tools for you to use later in the workshop.
4. Give me the folder's full path and the exact commands to restart you inside it, with one line on why.

Keep your whole reply short. Don't create a branch or change any files yet.`,

	configure: `Give this branch's Previews their own D1 database. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> Why it matters: one or two plain sentences.

Steps:

1. Create a branch: \`git checkout -b isolate-preview-db\`.
   Why it matters: every branch I push gets its own Preview, with its own URL.
2. Create the database: \`npx wrangler d1 create workshop-preview-db\`. If Wrangler asks which account, use the one that has \`activity-log-db\`. If it offers to add the database to wrangler.json, decline.
   Why it matters: what declining protects.
3. In \`wrangler.json\`, inside the existing \`previews\` block, keep \`vars\` and add a \`d1_databases\` entry (binding \`DB\`, the new database's name and ID) and \`"observability": { "enabled": true }\`. Leave the top-level config unchanged. Then show me the two \`DB\` bindings side by side: the top-level one and the one in \`previews\`. Just those, not the whole file.
   Why it matters: what a Preview would get without this block.
4. Commit: \`git commit -am "Give Previews their own D1 database"\`.
   Why it matters: what happens to this config when the branch merges.

Don't push yet.`,

	openPullRequest: `Open a pull request for this branch so it gets a Preview. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> Why it matters: one or two plain sentences.

Steps:

1. Push the branch: \`git push -u origin isolate-preview-db\`.
   Why it matters: what the push sets off in Workers Builds.
2. Open a pull request against main: \`gh pr create --fill\`. Give me the PR link.
   Why it matters: where the Preview URL shows up.
3. Wait for the Workers Builds check: \`gh pr checks --watch\`. If it says no checks reported, wait a few seconds and retry. It can take a minute or two.
   Why it matters: a branch build runs \`wrangler preview\`, not a production deploy.
4. Get the Preview URL from the Cloudflare bot's comment on the PR.
   Why it matters: the Preview URL stays the same for the branch, while each push also gets its own deployment URL in the bot's table.

Then stop. Don't open or test the Preview: I'll open it myself. End your reply with two links on their own lines: the PR, then the Preview URL.`,

	checkObservability: `Do you have tools from the \`cloudflare-observability\` MCP server, such as \`query_worker_observability\`? If yes, reply "Observability connected" and list the tool names. If not, tell me which agent you are and stop. Don't try to install anything.`,

	testPreview: `Apply a candidate schema change to this branch's Preview database, then test the Preview's API to see what works and what doesn't. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> Why it matters: one or two plain sentences.

Steps:

1. Apply the Preview-only schema: \`npx wrangler d1 execute workshop-preview-db --remote --yes --file workshop/preview-schema.sql\`.
   Why it matters: the file lives outside \`migrations/\`, so production deploys never apply it, and this command only touches the Preview's database.
2. Test the Preview with curl, against the Preview URL from the PR's bot comment and the API in AGENTS.md: list the entries, add one, then delete one. Show each request's status code in a short table.
   Why it matters: you can add and delete data freely, because this database isn't production's.

If something fails, say what failed, but don't look for the cause or read the code: the next step finds it from the Preview's logs.

End by telling me to try it myself, in two short lines:
- Open the Preview URL (put it on its own line) and click Delete on a row.
- Refresh my production tab and check its entries are untouched, and say in one sentence why they are.`,

	readPreviewLogs: `Delete is failing on this branch's Preview. Find out why from the Preview's own logs, using the \`cloudflare-observability\` MCP tools.

Query events from the last hour where \`$workers.scriptName\` is the Worker name in wrangler.json and \`$workers.preview.slug\` is this branch's name. Find the \`activity_log.delete_failed\` events and show me the error and entry ID. Then explain the cause in two sentences, using the error and the code in src/. Don't change any code yet.`,

	diagnoseAndFix: `Fix the delete bug you just found in the Preview's logs.

Fix the Worker code, not either database schema. Production still has an \`id\` column while the Preview schema has \`activity_id\`. The merged code must work with both. Run the project checks, then commit and push so Workers Builds redeploys this branch's Preview.

Then verify your own work: wait for \`gh pr checks --watch\` (if it reports no checks yet, wait a few seconds and retry), confirm your commit appears in the bot comment's deployment table, and re-run the full API test (list, add, delete, list) against the same Preview URL. Report the results and a one-line summary of the change. Do not merge.`,

	mergePullRequest: `I've reviewed the Preview and approve the merge. Merge this pull request with \`gh pr merge --merge\`. When Workers Builds finishes deploying main, run the API test (list, add, delete, list) against production and confirm its seeded entries are still there. Do not apply \`workshop/preview-schema.sql\` to production.`,

	yourTurn: `Switch to main and pull the latest. Then create a new branch and make one small, visible change to the Activity Log app: for example, show a count of entries under the heading. Run the project checks, commit, push, and open a pull request with \`gh pr create --fill\`.

When the Preview is live, check your change on the new branch's Preview URL yourself, then give me the URL and what you checked. Do not merge.`,

	cleanup: `Delete everything this workshop created:

${COMMANDS.cleanup}

If a name differs from \`wrangler.json\` or the git remote, use the actual name. Confirm each wrangler prompt. Do not touch other Workers, databases, or repositories.`,
} as const;
