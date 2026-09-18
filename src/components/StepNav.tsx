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
				rootMargin: "-20% 0px -55% 0px",
				threshold: [0, 0.25, 0.5, 0.75, 1],
			},
		);

		for (const el of elements) observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<nav className="step-nav" aria-label="Steps">
			<div className="step-nav-inner">
				{STEPS.map((step) => (
					<a
						key={step.id}
						href={`#${step.id}`}
						data-active={active === step.id ? "true" : "false"}
					>
						<span className="step-nav-num">{step.num}</span>
						{step.short}
					</a>
				))}
			</div>
		</nav>
	);
}
