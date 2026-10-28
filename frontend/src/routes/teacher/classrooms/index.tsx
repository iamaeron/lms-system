import { AddIcon, MagnifierIcon } from "@solar-icons/react/linear";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { classroomQueries } from "@/features/classroom/queries";

export default function TeacherClassrooms() {
	const { data } = useSuspenseQuery(classroomQueries.list());
	return (
		<div>
			<div className="flex items-center justify-between">
				<Input
					wrapperClassName="max-w-xs"
					placeholder="Search for a class ..."
					leftSection={<MagnifierIcon strokeWidth={2} size={16} />}
					rightSection={<span className="text-sm">Ctrl K</span>}
				/>

				<div>
					<Button>
						<AddIcon />
						New Class
					</Button>
				</div>
			</div>

			<div>
				{data.data.map((detail) => (
					<div key={detail.classroom.id}>
						<h3>{detail.classroom.name}</h3>
						<h3>{detail.classroom.gradeLevel}</h3>
						<h3>{detail.classroom.section}</h3>
						<p>{detail.classroom.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}
