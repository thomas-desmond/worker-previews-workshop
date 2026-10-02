import { useEffect, useState } from "react";
import type { McpAgent } from "../lib/site";
import { CommandBlock } from "./CommandBlock";

type Props = { agents: McpAgent[] };

const STORAGE_KEY = "workshop-agent";

/** Renders `code` and **bold** spans in a step string. */
function renderInline(text: string) {
	return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
		if (part.startsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
		if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
		return part;
	});
}

export function AgentPicker({ agents }: Props) {
	const [selected, setSelected] = useState(agents[0].id);

	useEffect(() => {
		const saved = window.localStorage.getItem(STORAGE_KEY);
		if (saved && agents.some((a) => a.id === saved)) setSelected(saved);
	}, [agents]);

	const choose = (id: string) => {
		setSelected(id);
		window.localStorage.setItem(STORAGE_KEY, id);
	};

	const agent = agents.find((a) => a.id === selected) ?? agents[0];

	return (
		<div className="agent-picker">
			<div className="agent-picker-tabs" role="tablist" aria-label="Your agent">
				{agents.map((a) => (
					<button
						key={a.id}
						type="button"
						role="tab"
						id={`agent-tab-${a.id}`}
						aria-selected={a.id === agent.id}
						aria-controls="agent-panel"
						className="agent-picker-tab"
						onClick={() => choose(a.id)}
					>
						{a.name}
					</button>
				))}
			</div>
			<div className="agent-picker-panel" role="tabpanel" id="agent-panel" aria-labelledby={`agent-tab-${agent.id}`}>
				<ol className="steps-inline">
					{agent.steps.map((step, i) => (
						<li key={i}>{renderInline(step)}</li>
					))}
				</ol>
				{agent.command && <CommandBlock label={agent.id === "other" ? "MCP server URL" : "Terminal"} text={agent.command} />}
			</div>
		</div>
	);
}
