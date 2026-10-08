export const SITE = {
	title: "Worker Previews Workshop",
	tagline: "Isolated environments for every change your agent makes.",
	description:
		"Deploy a production Worker, test a candidate D1 schema safely in a Preview, diagnose a real failure, and merge a fix without changing production data.",
} as const;

export const LINKS = {
	blog: "https://blog.cloudflare.com/worker-previews/",
	docs: "https://developers.cloudflare.com/workers/previews/",
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
	},
	{
		id: "deploy",
		num: "1",
		label: "Deploy to Cloudflare",
	},
	{
		id: "clone",
		num: "2",
		label: "Get the code",
	},
	{
		id: "isolate",
		num: "3",
		label: "Configure Previews",
	},
	{
		id: "preview",
		num: "4",
		label: "Open your Preview",
	},
	{
		id: "interact",
		num: "5",
		label: "Apply and test",
	},
	{
		id: "observability",
		num: "6",
		label: "Observability",
	},
	{
		id: "final",
		num: "7",
		label: "Fix and merge",
	},
	{
		id: "full-flow",
		num: "8",
		label: "Full flow",
	},
] as const;

export const REPO_URL = "https://github.com/thomas-desmond/worker-previews-starter";

/** Remote Workers Observability MCP server. The starter repo ships config for it. */
const OBSERVABILITY_MCP_URL = "https://observability.mcp.cloudflare.com/mcp";

export const PROMPTS = {
	checkPrereqs: `Check that my machine is ready for the Cloudflare Worker Previews workshop. Before each command, tell me in one line what it does.

1. Check: \`node -v\` (v20 or newer), \`git --version\`, \`gh auth status\`, \`npx wrangler whoami\`.
2. Missing or outdated tool: tell me the install command for my OS and ask before you run it.
3. Not signed in to GitHub or Cloudflare: don't sign in for me. Tell me to run \`gh auth login\` or \`npx wrangler login\` myself (they open my browser), wait for me, then check again.
4. More than one Cloudflare account: list them in the table and say we'll pick one after deploying. Don't ask me to set anything.

Ignore Wrangler warnings about missing optional permissions: the workshop doesn't need them.

Finish with a short table (tool, status, version or account), then "Ready" or what's left to fix. Don't clone or deploy anything yet.`,

	clone: `Get my copy of the Cloudflare Worker Previews workshop repo onto this machine. Before each command, tell me in one line what it does.

1. Clone it: \`gh repo clone worker-previews-starter\`. Not found? I renamed it in the deploy form: ask me for the name.
2. Inside the folder, run \`npm install\`. Ignore npm audit warnings.
3. Only if \`npx wrangler whoami\` shows more than one Cloudflare account: list them and ask me which one I deployed to. Check it with \`CLOUDFLARE_ACCOUNT_ID=<id> npx wrangler d1 list\` (it should list \`activity-log-db\`). Then add \`"account_id": "<id>"\` at the top level of \`wrangler.json\` and commit it on its own: \`git commit -am "Pin Cloudflare account"\`. Tell me in one line why: every Wrangler command now uses this account, in any terminal. With one account, skip this step.
4. In plain language, tell me what this app is: at most three short sentences, no file names or code. Cover what it does, where its data lives, and that the repo includes rules and tools for you to use later in the workshop.
5. Give me the folder's full path and the exact commands to restart you inside it, with one line on why.

Keep your whole reply short. Don't create a branch or change any other files yet.`,

	configure: `Give this Worker's Previews their own D1 database, separate from production. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> One or two plain sentences on why it matters, with no label in front.

Steps:

1. Create a branch: \`git checkout -b isolate-preview-db\`.
   Explain: every branch I push gets its own Preview, with its own URL.
2. Create the database: \`npx wrangler d1 create workshop-preview-db\`. Wrangler may offer to add it to wrangler.json: it mustn't, because it would put it at the top level.
   Explain: why this database must not go at the top level.
3. In \`wrangler.json\`, inside the existing \`previews\` block, keep \`vars\` and add a \`d1_databases\` entry (binding \`DB\`, the new database's name and ID) and \`"observability": { "enabled": true }\`. Leave the top-level config unchanged.
   Explain: what a Preview would get without this block.
4. Create \`wrangler.preview-migrations.jsonc\` with only a top-level \`d1_databases\` entry: binding \`PREVIEW_DB\`, the same database name and ID, and \`"migrations_dir": "preview-migrations"\`. Then show me the three bindings side by side: \`DB\` at the top level of \`wrangler.json\`, \`DB\` in \`previews\`, and \`PREVIEW_DB\`. Just those, not the whole files.
   Explain: production deploys apply \`migrations/\` through \`wrangler.json\`, so the Preview database gets its own config and its own migrations folder, and the two never touch.
5. Commit: \`git add -A && git commit -m "Give Previews their own D1 database"\`.
   Explain: once this merges, every new branch's Preview uses this database by default.

Don't push yet.`,

	openPullRequest: `Push this branch to get its Preview, and open a pull request so the Preview URL shows up there. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> One or two plain sentences on why it matters, with no label in front.

Steps:

1. Push the branch: \`git push -u origin isolate-preview-db\`.
   Explain: what the push sets off in Workers Builds.
2. Open a pull request against main: \`gh pr create --fill\`. Give me the PR link.
   Explain: where the Preview URL shows up.
3. Wait for the Workers Builds check: \`gh pr checks --watch\`. If it says no checks reported, wait a few seconds and retry. It can take a minute or two.
   Explain: a branch build runs \`wrangler preview\`, not a production deploy.
4. Get the Preview URL from the Cloudflare bot's comment on the PR.
   Explain: the Preview URL stays the same for the branch, while each push also gets its own deployment URL in the bot's table.

Then stop. Don't open or test the Preview: I'll open it myself. End your reply with two links on their own lines: the PR, then the Preview URL.`,

	testPreview: `Apply the Preview migrations, including a candidate schema change, to the Preview database, then test the Preview's API to see what works and what doesn't. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> One or two plain sentences on why it matters, with no label in front.

Steps:

1. Check that \`wrangler.preview-migrations.jsonc\` and the \`previews\` block in \`wrangler.json\` point at the same database, then apply the Preview migrations: \`npx wrangler d1 migrations apply PREVIEW_DB --remote --config wrangler.preview-migrations.jsonc\`. List the migrations it applied.
   Explain: the \`PREVIEW_DB\` binding only exists in that config file, so this command can't reach production, and D1 records what it applied, so running it again is safe.
2. Test the Preview with curl, against the Preview URL from the PR's bot comment and the API in AGENTS.md: list the entries, add one, then delete one. Show each request's status code in a short table.
   Explain: you can add and delete data freely, because this database isn't production's.

If something fails, say what failed, but don't look for the cause or read the code: the next step finds it from the Preview's logs.

End by telling me to try it myself, in two short lines:
- Open the Preview URL (put it on its own line) and click Delete on a row.
- Refresh my production tab and check its entries are untouched, and say in one sentence why they are.`,

	readPreviewLogs: `Find out why delete fails on this branch's Preview, from the Preview's own logs. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> One or two plain sentences on why it matters, with no label in front.

Steps:

1. Check that you have tools from the \`cloudflare-observability\` MCP server (this repo already configures it, and it's read-only), and that they can see this Worker: list the Workers in the account. If you see it, say so in one line and go on to step 2. If the tools are missing, or the Worker isn't listed (signed in to the wrong account), help me sign in, then stop:
   - Tell me which agent you are.
   - OpenCode: ask me, then run \`opencode mcp auth cloudflare-observability\`.
   - Codex: ask me, then run \`codex mcp login cloudflare-observability\`.
   - Claude Code: tell me to approve the project's MCP server if asked, then run \`/mcp\`, pick \`cloudflare-observability\`, and authenticate.
   - Cursor: tell me to open Cursor Settings → MCP, enable \`cloudflare-observability\`, and click Connect.
   - VS Code: tell me to open \`.vscode/mcp.json\`, click Start above the server, and use Copilot Chat in Agent mode.
   - Any other agent: tell me how to add a remote MCP server with the URL \`${OBSERVABILITY_MCP_URL}\`.
   When Cloudflare asks which account to authorize, I must pick the one that has this Worker. If I'm already signed in to the wrong one, tell me to sign out first (OpenCode: \`opencode mcp logout cloudflare-observability\`).
   Then tell me whether I need to restart you (if unsure, say yes) and to paste this prompt again.
   Explain: with the MCP server, you read the logs yourself, so I don't copy and paste errors.
2. Query this Preview's events from the last hour, filtered on \`$workers.scriptName\` (the Worker's deployed name) and \`$workers.preview.slug\` (this branch's name). Find the \`activity_log.delete_failed\` events and show me the error and entry ID. Logs can take a minute to appear.
   Explain: every log line is tagged with its Preview, so you read this branch's errors and none of production's.
3. Explain the cause in two plain sentences, using the error and the code in \`src/\`. Don't change any code.
   Explain: the bug was caught on a Preview, before it reached production.

End by telling me to see the error myself: take the dashboard link to this Preview from the Cloudflare bot's comment on the PR (it ends in \`/previews/<branch>\`), add \`/observability\` to the end, and give me that on its own line. It opens this Preview's logs.`,

	diagnoseAndFix: `Fix the delete bug you just found in the Preview's logs, then prove the fix on the same Preview. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> One or two plain sentences on why it matters, with no label in front.

Steps:

1. Fix the Worker code, not either database schema or either migrations folder. Production has an \`id\` column while the Preview schema has \`activity_id\`, so the code must work with both. Show me only the lines you changed.
   Explain: once merged, this code runs against production's schema too.
2. Run the project checks, then commit and push.
   Explain: the push redeploys this branch's Preview at the same URL.
3. Wait for the Workers Builds check (\`gh pr checks --watch\`; if it reports no checks yet, wait a few seconds and retry). Confirm your commit appears in the bot comment's deployment table. Then re-run list, add, delete, list against the same Preview URL, and show the status codes in a short table.
   Explain: you check your own work on a real deploy before a human reviews it.

Don't merge. End by telling me to review it myself, in short lines: open the PR (link on its own line) and find the new row in the bot's deployment table, open the Preview URL (on its own line) and click Delete, and check production is unchanged. Then say that merging is my call.`,

	mergePullRequest: `I've reviewed the Preview and approve the merge. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> One or two plain sentences on why it matters, with no label in front.

Steps:

1. Merge the pull request: \`gh pr merge --merge\`.
   Explain: what Workers Builds deploys to production now, which part of wrangler.json production uses, and that its deploy applies only \`migrations/\`.
2. Wait for Workers Builds to finish deploying \`main\` (watch the check on main's latest commit; it can take a minute or two).
   Explain: production only changes through \`main\`, by the same pipeline that built your Previews.
3. Test production: list, add, delete the entry you added, list again. Show the status codes in a short table, and confirm the seeded entries are still there. Don't run anything from \`preview-migrations/\` against production.
   Explain: the fix works on production's schema, and the Preview's schema and data never reached it.

End by telling me to refresh my production tab (production URL on its own line) and check its entries are all there.`,

	yourTurn: `Make this change: show a count of entries under the heading.

Take it through the whole flow on a new Preview, from branch to tested pull request. I'm learning, so explain why each step matters.

Format each step like this, and keep the whole reply short:

**1. What you did, in one line**
> One or two plain sentences on why it matters, with no label in front.

Steps:

1. Switch to main, pull the latest, and create a new branch named after the change.
   Explain: this branch gets its own Preview automatically, with no setup this time.
2. Make the change and show me only the lines you changed. Run the project checks, commit, push, and open a pull request with \`gh pr create --fill\`.
   Explain: why the new Preview already has a database: \`main\` now binds every Preview to one shared Preview database, which is never production's.
   Explain: what sharing means here: this Preview already has the earlier branch's schema and test rows, and a Preview migration applied for one branch shows up in every Preview. A branch that needs its own database can point both \`previews.d1_databases\` and \`wrangler.preview-migrations.jsonc\` at a different one.
3. Wait for the Workers Builds check (\`gh pr checks --watch\`; if it reports no checks yet, wait a few seconds and retry). Get the new Preview URL from the bot's comment, check the change there yourself, and re-run list, add, delete, list so nothing else broke. Show the status codes in a short table.
   Explain: you check your own work on a Preview before I review it.

Don't merge. End with the PR link and the new Preview URL, each on its own line, and tell me to open the Preview and see the change myself.`,

	cleanup: `Delete everything this workshop created. Before each command, tell me in one line what it does.

1. Find the real names: the Worker and both D1 databases from \`wrangler.json\` (top level and \`previews\`; \`wrangler.preview-migrations.jsonc\` points at the same Preview database), and the GitHub repo from the git remote. They may differ from the defaults.
2. List exactly what you'll delete, and wait for my yes.
3. Delete the Worker (\`npx wrangler delete <name>\`), both databases (\`npx wrangler d1 delete <name>\`), and the repo (\`gh repo delete <owner>/<repo> --yes\`). If gh says it needs the \`delete_repo\` scope, tell me to run \`gh auth refresh -s delete_repo\` myself (it opens my browser), wait for me, then retry.

Don't touch any other Workers, databases, or repositories. End with a short list of what's gone, and remind me the local folder is still on my machine.`,
} as const;
