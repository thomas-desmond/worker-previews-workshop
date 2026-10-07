import { useCallback, useState } from "react";

type Props = {
	label?: string;
	text: string;
	/** Show only the first few lines until expanded. Copy always copies the full prompt. */
	collapsed?: boolean;
};

export function PromptBlock({ label = "Paste into your agent", text, collapsed = false }: Props) {
	const [copied, setCopied] = useState(false);
	const [expanded, setExpanded] = useState(!collapsed);

	const onCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1800);
		} catch {
			// Fallback for older browsers / denied permission
			const ta = document.createElement("textarea");
			ta.value = text;
			ta.style.position = "fixed";
			ta.style.left = "-9999px";
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			document.body.removeChild(ta);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1800);
		}
	}, [text]);

	return (
		<div className="prompt-block" data-expanded={expanded ? "true" : "false"}>
			<div className="prompt-block-bar">
				<span className="prompt-block-label">{label}</span>
				<button
					type="button"
					className="prompt-block-copy"
					data-copied={copied ? "true" : "false"}
					onClick={onCopy}
				>
					{copied ? "Copied" : "Copy prompt"}
				</button>
			</div>
			<pre>{text}</pre>
			{collapsed && (
				<button
					type="button"
					className="prompt-block-toggle"
					aria-expanded={expanded}
					onClick={() => setExpanded((v) => !v)}
				>
					{expanded ? "Show less" : "Show full prompt"}
				</button>
			)}
		</div>
	);
}
