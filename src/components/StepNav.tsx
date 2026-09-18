import { useEffect, useState } from "react";
import { STEPS } from "../lib/site";

const STORAGE_KEY = "wpw:completed-steps";

function readCompleted(): Set<string> {
	if (typeof window === "undefined") return new Set();
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const arr = JSON.parse(raw);
		return new Set(Array.isArray(arr) ? arr : []);
	} catch {
		return new Set();
	}
}

function writeCompleted(set: Set<string>) {
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
	} catch {
		// ignore
	}
}

export function StepNav() {
	const [active, setActive] = useState<string>(STEPS[0].id);
	const [completed, setCompleted] = useState<Set<string>>(new Set());

	useEffect(() => {
		setCompleted(readCompleted());
	}, []);

	useEffect(() => {
		const ids = STEPS.map((s) => s.id);
		const elements = ids
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => Boolean(el));

		if (elements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
				if (visible[0]?.target?.id) {
					setActive(visible[0].target.id);
				}
			},
			{
				rootMargin: "-15% 0px -60% 0px",
				threshold: [0, 0.25, 0.5, 0.75, 1],
			},
		);

		for (const el of elements) observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const toggle = (id: string, ev: React.MouseEvent) => {
		ev.preventDefault();
		ev.stopPropagation();
		setCompleted((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			writeCompleted(next);
			return next;
		});
	};

	const doneCount = completed.size;
	const total = STEPS.length;
	const pct = Math.round((doneCount / total) * 100);

	return (
		<aside className="rail" aria-label="Workshop progress">
			<div className="rail-header">
				<div className="rail-progress-label">
					<span>Progress</span>
					<span className="rail-progress-count">
						{doneCount}/{total}
					</span>
				</div>
				<div className="rail-progress-bar" role="progressbar" aria-valuenow={pct}>
					<div className="rail-progress-fill" style={{ width: `${pct}%` }} />
				</div>
			</div>

			<ol className="rail-list">
				{STEPS.map((step, i) => {
					const isDone = completed.has(step.id);
					const isActive = active === step.id;
					return (
						<li
							key={step.id}
							className="rail-item"
							data-active={isActive}
							data-done={isDone}
						>
							{i < STEPS.length - 1 && <span className="rail-connector" aria-hidden />}
							<button
								type="button"
								className="rail-check"
								onClick={(e) => toggle(step.id, e)}
								aria-label={
									isDone
										? `Mark ${step.label} incomplete`
										: `Mark ${step.label} complete`
								}
								aria-pressed={isDone}
							>
								{isDone ? (
									<svg
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={3.5}
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden
									>
										<path d="M20 6L9 17l-5-5" />
									</svg>
								) : (
									<span className="rail-check-num">{step.num}</span>
								)}
							</button>
							<a href={`#${step.id}`} className="rail-link">
								<span className="rail-link-label">{step.label}</span>
								<span className="rail-link-time">{step.time}</span>
							</a>
						</li>
					);
				})}
			</ol>
		</aside>
	);
}
