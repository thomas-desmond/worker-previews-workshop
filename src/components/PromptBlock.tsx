import { useCallback, useState } from "react";

type Props = {
	label?: string;
	text: string;
};

export function PromptBlock({ label = "Paste into your agent", text }: Props) {
	const [copied, setCopied] = useState(false);

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
		<div className="prompt-block">
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
		</div>
	);
}
