import { useCallback, useState } from "react";

type Props = {
	label?: string;
	text: string;
};

export function CommandBlock({ label = "Terminal", text }: Props) {
	const [copied, setCopied] = useState(false);

	const onCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			const ta = document.createElement("textarea");
			ta.value = text;
			ta.style.position = "fixed";
			ta.style.left = "-9999px";
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			document.body.removeChild(ta);
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1800);
	}, [text]);

	return (
		<div className="cmd">
			<div className="cmd-bar">
				<span className="cmd-label">{label}</span>
				<button type="button" className="cmd-copy" data-copied={copied ? "true" : "false"} onClick={onCopy}>
					{copied ? "Copied" : "Copy"}
				</button>
			</div>
			<pre>
				<code>{text}</code>
			</pre>
		</div>
	);
}
