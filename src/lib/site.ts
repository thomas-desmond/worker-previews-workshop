export const SITE = {
	title: "Worker Previews Workshop",
	tagline: "Isolated environments for every change your agent makes.",
	description:
		"A follow-along: deploy a real app to Cloudflare, then give one branch its own isolated D1 database with a Preview deployment — and prove it never touches production.",
	duration: "30–40 min",
	audience: "Developers",
} as const;

export const STEPS = [
	{
		id: "prereqs",
		num: "0",
		label: "Before you start",
		short: "Prereqs",
		time: "2 min",
	},
	{
		id: "deploy",
		num: "1",
		label: "Deploy to Cloudflare",
		short: "Deploy",
		time: "5 min",
	},
	{
		id: "isolate",
		num: "2",
		label: "Isolate a resource",
		short: "Isolate",
		time: "8 min",
	},
	{
		id: "preview",
		num: "3",
		label: "Open your Preview",
		short: "Preview",
		time: "5 min",
	},
	{
		id: "interact",
		num: "4",
		label: "Prove isolation",
		short: "Prove it",
		time: "3 min",
	},
	{
		id: "observability",
		num: "5",
		label: "Observability",
		short: "Observe",
		time: "5 min",
	},
	{
		id: "final",
		num: "6",
		label: "TBD",
		short: "TBD",
		time: "—",
	},
] as const;

export type StepId = (typeof STEPS)[number]["id"];

/**
 * Talking points for whoever is leading the room — what to say during the
 * dead time each step creates (a deploy running, a build finishing) and the
 * narrative bridge to the next step. Review-pass content: not meant to be a
 * permanent feature of the public site, just visible enough to sanity-check
 * the script before Oct 1.
 */
export const LEADER_NOTES: Partial<Record<StepId, string[]>> = {
	prereqs: [
		"Frame the hour before anyone touches a laptop: \"Agents can ship code faster than we can review it. Previews gives every change its own throwaway environment — today you build one slice of that yourself.\"",
		"Name it explicitly as one piece of the ADLC (Agent Development Lifecycle), not the whole thing.",
		"While people check the four boxes, confirm room-wide out loud: agent installed, GitHub authed, Cloudflare account created. Don't move on until most hands are up.",
	],
	deploy: [
		"There's a real wait after the click (provisioning + first build) — use it, don't just stand there.",
		"Narrate exactly what the button did: forked the repo into their account, provisioned a production D1 database, wired up Workers Builds (Cloudflare's own CI/CD) to that repo, deployed the Worker.",
		"Land the callback line: \"You have production deployed — no Preview yet. That's next, and it's where this gets interesting.\"",
		"Point at the app while it loads: an Activity Log with three seeded rows — they'll compare this exact data against an isolated copy shortly.",
		"Plant the seed: \"No GitHub Actions written, no secrets pasted — Workers Builds is already watching this repo. When you open a PR, it just reacts.\"",
	],
	isolate: [
		"Slow down here — this is the conceptual heart of the hour, even though it's \"just editing JSON.\"",
		"Say the inherits line out loud, it's the one-sentence summary of the whole workshop: \"Your Preview inherits your code automatically. It does not inherit your configuration — bindings like D1 start empty unless you tell it otherwise.\"",
		"Frame the override block plainly: \"same binding name, pointed at a different database — that's the whole mechanism.\"",
		"Someone will ask about Durable Objects — the page has the answer in the collapsed aside, use it rather than improvising.",
	],
	preview: [
		"After push + PR, there's dead time while Workers Builds runs — use it.",
		"Recap what's happening with zero manual steps: no one ran `wrangler preview`, no custom Action — Workers Builds saw the PR and is deploying a Preview on its own, then will comment the URL on the PR.",
		"Close the loop from Step 1: \"This is the moment that fills the gap — production existed, now the branch gets its own live environment too.\"",
		"Known flake: the bot comment has been slow/missing in dry runs — have a fallback ready (check the Workers Builds tab directly) rather than stalling the room.",
	],
	interact: [
		"This is the payoff — let it land, don't rush it.",
		"Narrate while they click: \"You're not being told it's isolated, you're about to watch it.\"",
		"After they flip to production: ask the room \"who still sees only three rows?\" — get hands up, make it a shared moment, not just individual screens.",
	],
	observability: [
		"Tie back to minute 0 explicitly: \"This is the other half of trust — not just isolated data, isolated logs and traces too.\"",
		"Warn up front: the Previews tab in Observability is the one screen most people can't find unassisted — point at it before they go hunting.",
		"If short on time, this is the step to compress; the isolation story already landed last step.",
	],
};

export const REPO_URL = "https://github.com/thomas-desmond/d1-template-preview";

export const PROMPTS = {
	isolateResource: `I'm on a new git branch off main in this repo. Give this branch its own isolated D1 database as a Preview override:

1. Run \`npx wrangler d1 create workshop-preview-db\` to create a brand new D1 database — don't reuse the production one.
2. In \`wrangler.json\`, add a \`previews.d1_databases\` block using binding name \`DB\` (same binding name as the top-level production entry) with the \`database_id\` and \`database_name\` from step 1.
3. Do not modify the top-level \`d1_databases\` entry — that's production, leave it alone.
4. Commit the change.

Don't ask me questions — just do it.`,

	openPullRequest: `Push this branch and open a pull request against main. If the GitHub CLI (\`gh\`) is installed and authenticated, use \`gh pr create\` with a short, clear title, and print the PR URL when done. If it isn't, just push the branch and print the "Create a pull request" link from the push output so I can open the PR in my browser.`,
} as const;
