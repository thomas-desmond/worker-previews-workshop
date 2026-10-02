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
	"What a Preview inherits from production (code) and what it doesn't (variables and bindings).",
	"How to give Previews their own D1 database.",
	"How your agent tests its own changes on a Preview URL.",
	"How your agent reads a Preview's Observability logs and fixes the bug, with no copy-paste.",
	"How to approve a merge from Preview evidence.",
	"How a Preview URL (one per branch) differs from a deployment URL (one per push).",
] as const;

export const STEPS = [
	{
		id: "prereqs",
		num: "0",
		label: "Before you start",
		short: "Prereqs",
	},
	{
		id: "deploy",
		num: "1",
		label: "Deploy to Cloudflare",
		short: "Deploy",
	},
	{
		id: "isolate",
		num: "2",
		label: "Configure Previews",
		short: "Configure",
	},
	{
		id: "preview",
		num: "3",
		label: "Open your Preview",
		short: "Preview",
	},
	{
		id: "interact",
		num: "4",
		label: "Apply and test",
		short: "Test",
	},
	{
		id: "observability",
		num: "5",
		label: "Observability",
		short: "Observe",
	},
	{
		id: "final",
		num: "6",
		label: "Fix and merge",
		short: "Fix",
	},
	{
		id: "your-turn",
		num: "7",
		label: "Your turn (optional)",
		short: "Your turn",
	},
] as const;

export type StepId = (typeof STEPS)[number]["id"];

/**
 * Talking points for whoever is leading the room: what to say during the
 * dead time each step creates (a deploy running, a build finishing) and the
 * narrative bridge to the next step. Review-pass content: not meant to be a
 * permanent feature of the public site, just visible enough to sanity-check
 * the script before Oct 1.
 */
export const LEADER_NOTES: Partial<Record<StepId, string[]>> = {
	prereqs: [
		"Frame the hour before anyone touches a laptop: \"Agents can ship code faster than we can review it. Previews gives every change its own throwaway environment. Today you build one slice of that yourself.\"",
		"Name it explicitly as one piece of the ADLC (Agent Development Lifecycle), not the whole thing.",
		"Have everyone run the setup check command. Don't move on until most hands are up: `gh auth status` and `npx wrangler whoami` are the usual failures.",
		"Pacing: Steps 1–3 set things up (commands, with an optional agent prompt). From Step 4 on, the agent does the work: tests the Preview, reads its logs, fixes, re-tests. The attendee approves. Step 7 is the stretch for fast finishers.",
		"The agent needs no special setup beyond what's listed. The starter repo ships an AGENTS.md and Observability MCP config for Claude Code, Cursor, VS Code, Codex, and OpenCode. Attendees sign in once in Step 3.",
	],
	deploy: [
		"There's a real wait after the click (provisioning + first build). Use it.",
		"Expect \"there's no Visit button\": the dashboard doesn't update after the first build. Answer: refresh the page (or use the workers.dev URL at the bottom of the build log).",
		"Narrate exactly what the button did: created a copy of the repo in their GitHub account, provisioned a production D1 database, wired up Workers Builds (Cloudflare's own CI/CD) to that repo, deployed the Worker.",
		"Land the callback line: \"You have production deployed, but no Preview yet. That's next, and it's where this gets interesting.\"",
		"Point at the app while it loads: an Activity Log with three seeded rows. They'll compare this exact data against an isolated copy shortly.",
		"Plant the seed: \"No GitHub Actions written, no secrets pasted. Workers Builds is already watching this repo. When you open a PR, it just reacts.\"",
	],
	isolate: [
		"Slow down here: production settings stay top-level and Preview settings belong in the previews block.",
		"This database is isolated from production, but it becomes the shared Preview database after the PR merges.",
		"Frame the override plainly: same DB binding name, different account-level resource.",
		"Wrangler may offer to add the new D1 to wrangler.json itself, which writes a top-level binding. Attendees should decline and put it under previews instead.",
		"Expect the question \"wouldn't the Preview just use the production DB?\" No: Previews never fall back to production bindings. Without a previews binding, env.DB is undefined and `wrangler preview` warns about missing bindings.",
	],
	preview: [
		"After push + PR, there's dead time while Workers Builds runs. Use it to connect the Observability MCP: it's the one setup step with real failure modes (OAuth popups, wrong account, agent started before the clone). Walk the room.",
		"Agent started before `gh repo clone`? It won't have read the repo's MCP config. Restart it inside the worker-previews-starter folder.",
		"Point at AGENTS.md while people wait: it's why the agent knows to put bindings in previews, never touch activity-log-db, and test on the Preview URL. It's the take-home.",
		"Recap what's happening with zero manual deploy steps: Workers Builds runs `wrangler preview` for the branch and comments the stable URL on the PR.",
		"Point at the bot comment: one Preview URL for the branch, plus a deployment row per commit. That distinction pays off in Step 6.",
		"Close the loop from Step 1: \"This is the moment that fills the gap. Production existed; now the branch gets its own live environment too.\"",
		"Point out the Preview badge on the page: it comes from previews.vars, which the starter already had. Previews don't inherit production vars.",
	],
	interact: [
		"Land the new beat before the schema goes in: creating a database is not the same as seeding it. Empty tables, no rows, nothing to test yet, until this step's schema lands.",
		"The SQL file is outside migrations on purpose. Applying it by Preview database name is the safety boundary.",
		"The agent tests the Preview through the app's JSON API with curl: no browser tool needed, works in every agent. Delete is expected to return 500.",
		"Land the point: the agent can add and delete data freely here because the Preview has its own database. That's what makes it safe to let an agent test its own work.",
		"Attendees should still click Delete once themselves. The visible error is deliberate evidence, not workshop breakage.",
		"Name the CI/CD extension: this same check could run automatically against every PR's Preview before a human ever looks at it.",
	],
	observability: [
		"The agent queries the Observability MCP itself. The key filter is `$workers.preview.slug` = the branch name. Every Preview log line carries it, and production logs never include Preview traffic.",
		"Expected result: activity_log.delete_failed with `D1_ERROR: no such column: id` and the entry ID. Logs can take a minute to show up, so if the agent finds nothing, have it retry.",
		"Multiple Cloudflare accounts? The MCP tools ask for an account_id. The agent can get it from `npx wrangler whoami`.",
		"No MCP (agent doesn't support it, OAuth blocked)? The collapsed dashboard path still works: environment dropdown in the Worker header → branch → Observability. Copy the error into the agent by hand.",
		"Name the CI/CD extension: this observe-and-diagnose loop could run on every PR, with an agent triaging failures before a human is looped in.",
	],
	final: [
		"The repair must support production's id column and the Preview's activity_id column. Do not accept a Preview-only fix. AGENTS.md tells the agent the same.",
		"The agent re-tests the same Preview URL after its push lands. It checks the bot comment's deployment table for its commit, so it doesn't test stale code.",
		"Reframe the human's job: you didn't read the diff first, you read the evidence (the Preview URL, the API results, the log that's gone quiet) and then decided. The merge stays a human call.",
		"After merging, verify production. No SQL from workshop/ is ever applied there.",
		"Call out the bot comment again: same Preview URL, new deployment row. Share the Preview URL; link a deployment URL when you need an exact version.",
	],
	"your-turn": [
		"This is the agent-driven part: one sentence in, a Preview URL out. Fast finishers start here while others catch up.",
		"Demo the hands-off version on your own machine: a one-sentence feature request that ends with a tested Preview URL on a PR, no manual steps.",
		"Land the takeaway: every branch gets its own Preview, automatically, and the agent checks its own work there. Copy AGENTS.md into your own repos to keep doing this after today.",
	],
};

export const REPO_URL = "https://github.com/thomas-desmond/worker-previews-starter";

/** Remote Workers Observability MCP server. The starter repo ships config for it. */
export const OBSERVABILITY_MCP_URL = "https://observability.mcp.cloudflare.com/mcp";

/** Deterministic steps: the primary path is a command the attendee runs. */
export const COMMANDS = {
	// One command per line, no `&&`: Windows PowerShell 5.1 doesn't support `&&`.
	setupCheck: `node -v
git --version
gh auth status
npx wrangler whoami`,

	cloneAndBranch: `gh repo clone worker-previews-starter
cd worker-previews-starter
git checkout -b isolate-preview-db`,

	createPreviewDb: `npx wrangler d1 create workshop-preview-db`,

	commitConfig: `git commit -am "Give Previews their own D1 database"`,

	openPullRequest: `git push -u origin isolate-preview-db
gh pr create --fill
gh pr checks --watch`,

	applyPreviewSchema: `npx wrangler d1 execute workshop-preview-db --remote --yes --file workshop/preview-schema.sql`,

	mergePullRequest: `gh pr merge --merge`,

	cleanup: `npx wrangler delete worker-previews-starter
npx wrangler d1 delete activity-log-db
npx wrangler d1 delete workshop-preview-db
gh repo delete worker-previews-starter --yes`,
} as const;

/** The `previews` block attendees paste into wrangler.json in Step 2. */
export const PREVIEWS_BLOCK = `"previews": {
  "vars": { "ENVIRONMENT": "preview" },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "workshop-preview-db",
      "database_id": "<database_id from d1 create>"
    }
  ],
  "observability": { "enabled": true }
}`;

export const PROMPTS = {
	isolateResource: `In this repo, give Worker Previews their own D1 database:

1. Run \`npx wrangler d1 create workshop-preview-db\`. If Wrangler offers to add the binding to wrangler.json, decline.
2. In \`wrangler.json\`, inside the existing \`previews\` block, add a \`d1_databases\` entry with binding \`DB\` and the \`database_name\` and \`database_id\` from step 1. Also add \`"observability": { "enabled": true }\`. Keep the existing \`vars\` and leave the top-level config unchanged.
3. Commit the change.`,

	openPullRequest: `Push this branch and open a pull request against main with \`gh pr create --fill\`. Then wait for the Workers Builds check with \`gh pr checks --watch\` and give me the Preview URL from the Cloudflare bot's comment.`,

	checkObservability: `Do you have tools from the \`cloudflare-observability\` MCP server, such as \`query_worker_observability\`? If yes, reply "Observability connected" and list the tool names. If not, tell me which agent you are and stop. Don't try to install anything.`,

	applyPreviewSchema: `Run exactly this and print the result:

\`npx wrangler d1 execute workshop-preview-db --remote --yes --file workshop/preview-schema.sql\``,

	testPreview: `Test this branch's Preview. Get its Preview URL from the Cloudflare bot's comment on the PR (\`gh pr view --comments\`).

Using curl against that URL and the API described in AGENTS.md: list the entries, add one, list again, then delete one. Report each request's status code and response body in a short table. Don't fix anything yet, just tell me what works and what doesn't.`,

	readPreviewLogs: `Delete is failing on this branch's Preview. Find out why from the Preview's own logs, using the \`cloudflare-observability\` MCP tools.

Query events from the last hour where \`$workers.scriptName\` is the Worker name in wrangler.json and \`$workers.preview.slug\` is this branch's name. Find the \`activity_log.delete_failed\` events and show me the error and entry ID. Then explain the cause in two sentences, using the error and the code in src/. Don't change any code yet.`,

	diagnoseAndFix: `Fix the delete bug you just found in the Preview's logs.

Fix the Worker code, not either database schema. Production still has an \`id\` column while the Preview schema has \`activity_id\`. The merged code must work with both. Run the project checks, then commit and push so Workers Builds redeploys this branch's Preview.

Then verify your own work: wait for \`gh pr checks --watch\`, confirm your commit appears in the bot comment's deployment table, and re-run the full API test (list, add, delete, list) against the same Preview URL. Report the results and a one-line summary of the change. Do not merge.`,

	mergePullRequest: `I've reviewed the Preview and approve the merge. Merge this pull request with \`gh pr merge --merge\`. When Workers Builds finishes deploying main, run the API test (list, add, delete, list) against production and confirm its seeded entries are still there. Do not apply \`workshop/preview-schema.sql\` to production.`,

	yourTurn: `Switch to main and pull the latest. Then create a new branch and make one small, visible change to the Activity Log app: for example, show a count of entries under the heading. Run the project checks, commit, push, and open a pull request with \`gh pr create --fill\`.

When the Preview is live, check your change on the new branch's Preview URL yourself, then give me the URL and what you checked. Do not merge.`,

	cleanup: `Delete everything this workshop created:

${COMMANDS.cleanup}

If a name differs from \`wrangler.json\` or the git remote, use the actual name. Confirm each wrangler prompt. Do not touch other Workers, databases, or repositories.`,
} as const;
