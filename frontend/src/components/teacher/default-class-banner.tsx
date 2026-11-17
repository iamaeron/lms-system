import type { CSSProperties, ReactNode } from "react";

type ClassBannerInfo = {
	name: string;
	subjectCode: string | null;
	gradeLevel: number | null;
	section: string | null;
	department: { code: string | null; name?: string } | null;
};

interface DefaultClassBannerProps {
	classroom: ClassBannerInfo;
	className?: string;
	children?: ReactNode;
}

function hash(value: string) {
	let result = 2166136261;
	for (let index = 0; index < value.length; index += 1) {
		result = Math.imul(result ^ value.charCodeAt(index), 16777619);
	}
	return result >>> 0;
}

export function defaultClassMeshStyle(classroom: ClassBannerInfo): CSSProperties {
	const identity = [
		classroom.department?.code ?? classroom.department?.name ?? "general",
		classroom.gradeLevel ?? "all-levels",
		classroom.section ?? "no-section",
	].join(":");
	const seed = hash(identity);
	const hue = seed % 360;
	const hue2 = (hue + 65 + ((seed >>> 9) % 45)) % 360;
	const hue3 = (hue + 175 + ((seed >>> 17) % 55)) % 360;

	return {
		backgroundColor: `hsl(${hue} 62% 82%)`,
		backgroundImage: [
			`radial-gradient(ellipse at 18% 20%, hsl(${hue2} 84% 72% / 0.95) 0%, transparent 52%)`,
			`radial-gradient(ellipse at 82% 24%, hsl(${hue3} 76% 76% / 0.9) 0%, transparent 48%)`,
			`radial-gradient(ellipse at 68% 92%, hsl(${(hue + 285) % 360} 82% 72% / 0.85) 0%, transparent 55%)`,
			`linear-gradient(125deg, hsl(${hue} 65% 82%), hsl(${hue2} 65% 83%))`,
		].join(", "),
	};
}

export default function DefaultClassBanner({
	classroom,
	className = "",
	children,
}: DefaultClassBannerProps) {
	return (
		<div
			className={`relative isolate flex overflow-hidden ${className}`}
			style={defaultClassMeshStyle(classroom)}
		>
			{children ?? (
				<span className="font-serif text-2xl italic text-zinc-900/55">
					{classroom.subjectCode || classroom.name}
				</span>
			)}
		</div>
	);
}
