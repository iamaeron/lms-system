import type { ClassroomMember } from "@shared/index";
import { classLabel } from "@/lib/classroom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AvatarGroup } from "../ui/avatar-group";
import { Tooltip } from "../ui/tooltip";

interface ClassCardProps {
	detail: ClassroomMember;
}

const ClassCard = ({ detail }: ClassCardProps) => {
	return (
		<div className="border border-zinc-200 p-0.5 rounded-lg">
			<div className="shadow-xl shadow-black/3 h-22 w-full bg-linear-to-br rounded-md from-teal-300 to-blue-300 font-serif italic flex flex-col text-2xl justify-end p-3 text-black/50">
				<h3>{detail.classroom.subjectCode}</h3>
			</div>

			<div className="text-zinc-700 p-3 pb-2.5">
				<h3>{detail.classroom.name}</h3>
				<h3 className="text-sm">{classLabel(detail.classroom)}</h3>
				<div className="flex items-center -ml-1">
					<AvatarGroup>
						{detail.classroom.members?.map((member) => (
							<Tooltip
								side="bottom"
								content={member.user.name}
								key={member.user.id}
							>
								<Avatar className="w-4 h-4">
									<AvatarImage src={member.user.image ?? ""} />
									<AvatarFallback className="text-[10px]">
										{member.user.name?.charAt(0)}
									</AvatarFallback>
								</Avatar>
							</Tooltip>
						))}
					</AvatarGroup>

					<p className="text-sm text-muted-foreground">
						{detail.classroom.memberCount} student
						{detail.classroom.memberCount > 1 && "s"}
					</p>
				</div>
				<p>{detail.classroom.description}</p>
			</div>
		</div>
	);
};

export default ClassCard;
