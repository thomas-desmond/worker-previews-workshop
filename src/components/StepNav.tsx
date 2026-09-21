import { useEffect, useState } from "react";
import { STEPS } from "../lib/site";

export function StepNav() {
	const [active, setActive] = useState<string>(STEPS[0].id);

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

	return (
		<aside className="rail" aria-label="Workshop steps">
			<ol className="rail-list">
				{STEPS.map((step, i) => {
					const isActive = active === step.id;
					return (
						<li key={step.id} className="rail-item" data-active={isActive}>
							{i < STEPS.length - 1 && <span className="rail-connector" aria-hidden />}
							<span className="rail-check" aria-hidden>
								<span className="rail-check-num">{step.num}</span>
							</span>
							<a href={`#${step.id}`} className="rail-link">
								<span className="rail-link-label">{step.label}</span>
							</a>
						</li>
					);
				})}
			</ol>
		</aside>
	);
}
