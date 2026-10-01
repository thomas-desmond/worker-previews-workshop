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
	"How to debug a Preview from its own Observability logs.",
	"How to verify a fix in a Preview before merging.",
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
		"Pacing: Steps 2–4 are commands with an optional agent prompt. Step 6 is where the agent earns its keep. Step 7 is the stretch for fast finishers.",
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
		"After push + PR, there's dead time while Workers Builds runs. Use it.",
		"Recap what's happening with zero manual deploy steps: Workers Builds runs `wrangler preview` for the branch and comments the stable URL on the PR.",
		"Point at the bot comment: one Preview URL for the branch, plus a deployment row per commit. That distinction pays off in Step 6.",
		"Close the loop from Step 1: \"This is the moment that fills the gap. Production existed; now the branch gets its own live environment too.\"",
		"Point out the Preview badge on the page: it comes from previews.vars, which the starter already had. Previews don't inherit production vars.",
	],
	interact: [
		"Land the new beat before the schema goes in: creating a database is not the same as seeding it. Empty tables, no rows, nothing to test yet, until this step's schema lands.",
		"The SQL file is outside migrations on purpose. Applying it by Preview database name is the safety boundary.",
		"Have everyone test all three behaviors: add, refresh, delete. Delete is expected to fail.",
		"The visible error is deliberate evidence, not workshop breakage. The spoiler section confirms it without doing the fix for them.",
		"Name the CI/CD extension: this add/refresh/delete check is exactly the kind of thing a pipeline step could run automatically against every PR's Preview, with an agent reviewing the result, before a human ever looks at it.",
	],
	observability: [
		"The control is the environment dropdown in the Worker header (it currently says Production). Pick the branch name, then open Observability. There is no separate Previews tab.",
		"Production Observability will show zero errors. The delete failures only appear after you switch to the branch.",
		"The structured activity_log.delete_failed event should contain the useful D1 error and entry ID.",
		"Attendees copy the error and paste it into their agent by hand, that's the hands-on path.",
		"Demo the frontier version yourself: an agent with Observability MCP access pulling that same log and proposing the fix without anyone copying anything.",
		"Name the CI/CD extension explicitly: this observe-and-diagnose loop is exactly what a pipeline step could run automatically on every PR, with an agent triaging the failure before a human is looped in.",
	],
	final: [
		"The repair must support production's id column and the Preview's activity_id column. Do not accept a Preview-only fix.",
		"After the second Preview deployment passes, merge and verify production. No SQL from workshop/ is ever applied there.",
		"Call out the bot comment again: same Preview URL, new deployment row. Share the Preview URL; link a deployment URL when you need an exact version.",
	],
	"your-turn": [
		"This is the agent-driven part: one sentence in, a Preview URL out. Fast finishers start here while others catch up.",
		"Demo the hands-off version on your own machine: a one-sentence feature request that ends with a Preview URL on a PR, no manual steps.",
		"Land the takeaway: every branch gets its own Preview, automatically. This is what they can keep doing after today.",
	],
};

export const REPO_URL = "https://github.com/thomas-desmond/worker-previews-starter";

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
gh pr create --fill`,

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

	openPullRequest: `Push this branch and open a pull request against main with \`gh pr create\`. Print the PR URL.`,

	applyPreviewSchema: `Run exactly this and print the result:

\`npx wrangler d1 execute workshop-preview-db --remote --yes --file workshop/preview-schema.sql\``,

	diagnoseAndFix: `I'm giving you the delete-failure error from this Preview's Observability logs above. Diagnose the cause from that error and the repository, not by re-testing from scratch.

Fix the Worker code, not either database schema. Production still has an \`id\` column while the Preview schema has \`activity_id\`; the merged code must work with both schemas. Run the project checks, commit, and push the fix so Workers Builds redeploys the existing Preview. Once it's live, test add, refresh, and delete yourself to confirm the fix works. Do not merge yet.`,

	mergePullRequest: `If you already confirmed add, refresh, and delete all pass against the updated Preview, merge this pull request with \`gh pr merge --merge\`. If not, retest those three first. After merging, open production and verify its seeded entries still load and delete still works. Do not apply \`workshop/preview-schema.sql\` to production.`,

	yourTurn: `Switch to main and pull the latest. Then create a new branch and make one small, visible change to the Activity Log app: for example, show a count of entries under the heading. Run the project checks, commit, push, and open a pull request with \`gh pr create\`. When the Cloudflare bot comments on the PR, give me the new Preview URL.`,

	cleanup: `Delete everything this workshop created:

${COMMANDS.cleanup}

If a name differs from \`wrangler.json\` or the git remote, use the actual name. Confirm each wrangler prompt. Do not touch other Workers, databases, or repositories.`,
} as const;
