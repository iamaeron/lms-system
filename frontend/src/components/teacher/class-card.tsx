import type { ClassroomMember } from "@shared/index";
import { Link } from "react-router";
import DefaultClassBanner from "@/components/teacher/default-class-banner";
import { paths } from "@/config/paths";
import { classLabel } from "@/lib/classroom";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { AvatarGroup } from "../../ui/avatar-group";
import { Tooltip } from "../../ui/tooltip";

interface ClassCardProps {
	detail: ClassroomMember;
}

const ClassCard = ({ detail }: ClassCardProps) => {
	return (
		<Link
			to={paths.portal.teacher.classroom.getHref(detail.classroom.id)}
			className="block rounded-lg bg-white p-0.5 transition-shadow hover:shadow-lg shadow-black/5 focus-visible:outline-2 focus-visible:outline-primary"
		>
			<DefaultClassBanner
				classroom={detail.classroom}
				className="h-22 w-full flex-col justify-end rounded-md p-3"
			/>

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
			</div>
		</Link>
	);
};

export default ClassCard;
