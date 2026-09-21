export const SITE = {
	title: "Worker Previews Workshop",
	tagline: "Isolated environments for every change your agent makes.",
	description:
		"Deploy a production Worker, test a candidate D1 schema safely in a Preview, diagnose a real failure, and merge a fix without changing production data.",
	duration: "~40-50 min",
	audience: "Developers",
} as const;

export const LEARNING_OBJECTIVES = [
	"How Worker Previews isolate a branch's code, secrets, bindings, and observability from production automatically.",
	"How to safely override a shared resource like D1 so every Preview gets its own copy without ever touching production.",
	"How to read a Preview's own Observability logs to diagnose a real, schema-driven failure.",
	"How to verify a fix in Preview and promote only the safe, compatible parts of it to production.",
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
		"While people check the four boxes, confirm room-wide out loud: agent installed, GitHub authed, Cloudflare account created. Don't move on until most hands are up.",
	],
	deploy: [
		"There's a real wait after the click (provisioning + first build). Use it.",
		"Narrate exactly what the button did: forked the repo into their account, provisioned a production D1 database, wired up Workers Builds (Cloudflare's own CI/CD) to that repo, deployed the Worker.",
		"Land the callback line: \"You have production deployed, but no Preview yet. That's next, and it's where this gets interesting.\"",
		"Point at the app while it loads: an Activity Log with three seeded rows. They'll compare this exact data against an isolated copy shortly.",
		"Plant the seed: \"No GitHub Actions written, no secrets pasted. Workers Builds is already watching this repo. When you open a PR, it just reacts.\"",
	],
	isolate: [
		"Slow down here: production settings stay top-level and Preview settings belong in the previews block.",
		"This database is isolated from production, but it becomes the shared Preview database after the PR merges.",
		"Frame the override plainly: same DB binding name, different account-level resource.",
		"Wrangler may offer to add the new D1 to wrangler.json itself, which writes a top-level binding. Attendees should decline and put it under previews instead.",
	],
	preview: [
		"After push + PR, there's dead time while Workers Builds runs. Use it.",
		"Recap what's happening with zero manual deploy steps: Workers Builds runs `wrangler preview` for the branch and comments the stable URL on the PR.",
		"Close the loop from Step 1: \"This is the moment that fills the gap. Production existed; now the branch gets its own live environment too.\"",
		"Known flake: the bot comment often posts while the build is still in progress, with an empty URL, and may not update. Fallback: the Workers Builds check on the PR, or `https://<branch>-<worker-name>.<subdomain>.workers.dev`.",
	],
	interact: [
		"The SQL file is outside migrations on purpose. Applying it by Preview database name is the safety boundary.",
		"Have everyone test all three behaviors: add, refresh, delete. Delete is expected to fail.",
		"The visible error is deliberate evidence, not workshop breakage.",
	],
	observability: [
		"The control is the environment dropdown in the Worker header (it currently says Production). Pick the branch name, then open Observability. There is no separate Previews tab.",
		"Production Observability will show zero errors. The delete failures only appear after you switch to the branch.",
		"The structured activity_log.delete_failed event should contain the useful D1 error and entry ID.",
		"Attendees can copy the error or let an Observability-enabled agent retrieve it.",
	],
	final: [
		"The repair must support production's id column and the Preview's activity_id column. Do not accept a Preview-only fix.",
		"After the second Preview deployment passes, merge and verify production. No SQL from workshop/ is ever applied there.",
	],
};

export const REPO_URL = "https://github.com/thomas-desmond/d1-template-preview";

export const PROMPTS = {
	cloneAndBranch: `Using the GitHub CLI (\`gh\`) if it's installed and authenticated, find the repository the Deploy to Cloudflare button just created in my account (named \`d1-template-preview\` unless I changed it in the deploy form), and clone it into the current directory. If \`gh\` isn't available, ask me for the repository URL first. Once cloned, create and check out a new branch named \`isolate-preview-db\` off \`main\`.`,

	isolateResource: `I'm on a new git branch off main in this repo. Configure a shared, production-safe D1 database for Worker Previews:

1. Run \`npx wrangler d1 create workshop-preview-db\` to create a brand new D1 database. Don't reuse the production one. If Wrangler asks to add the binding to wrangler.json for you, decline.
2. In \`wrangler.json\`, add a \`previews.d1_databases\` block using binding name \`DB\` (same binding name as the top-level production entry) with the \`database_id\` and \`database_name\` from step 1.
3. Add \`previews.observability\` with \`enabled: true\`.
4. Do not modify the top-level production configuration.
5. Commit the change. This Preview configuration is intended to remain when the branch merges.`,

	openPullRequest: `Push this branch and open a pull request against main. If the GitHub CLI (\`gh\`) is installed and authenticated, use \`gh pr create\` with a short, clear title, and print the PR URL when done. If it isn't, just push the branch and print the "Create a pull request" link from the push output so I can open the PR in my browser.`,

	applyPreviewSchema: `Apply the workshop schema fixture to the remote D1 database named \`workshop-preview-db\` with:

\`npx wrangler d1 execute workshop-preview-db --remote --yes --file workshop/preview-schema.sql\`

Use the database name exactly as written. Include \`--remote\` and \`--yes\`. Do not run any command against the \`DB\` binding or the production database. Print the command result when complete.`,

	diagnoseAndFix: `Test this branch's deployed Preview as a user: add an entry, refresh and confirm it persists, then delete an entry. Diagnose the delete failure using the response, the repository, and the Preview's Observability logs if available.

Fix the Worker code, not either database schema. Production still has an \`id\` column while the Preview schema has \`activity_id\`; the merged code must work with both schemas. Run the project checks, commit, and push the fix so Workers Builds updates the existing Preview. Do not merge yet.`,

	mergePullRequest: `Retest add, refresh, and delete against the updated Preview. If all three pass, merge this pull request. Then open production and verify its seeded entries still load and delete still works. Do not apply \`workshop/preview-schema.sql\` to production.`,

	cleanup: `Delete everything this workshop created.

1. \`npx wrangler delete d1-template-preview\`
2. \`npx wrangler d1 delete d1-template-database\`
3. \`npx wrangler d1 delete workshop-preview-db\`
4. \`gh repo delete\` the GitHub repo this workshop cloned (usually \`<you>/d1-template-preview\`) with \`--yes\`

If a name differs from \`wrangler.json\` or the git remote, use the actual name. Confirm each wrangler prompt. Do not touch other Workers, databases, or repositories.`,
} as const;
