export function classLabel(room: {
	section: string | null;
	gradeLevel: number | null;
	department?: { code: string | null } | null;
}) {
	const yearSection = [room.gradeLevel, room.section].filter(Boolean).join("-"); // "1-A"
	return [room.department?.code, yearSection].filter(Boolean).join(" "); // "CCIS 1-A"
}
