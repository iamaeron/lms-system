import {
	AltArrowDownIcon,
	CheckIcon,
	MagnifierIcon,
} from "@solar-icons/react/linear";
import { useSuspenseQuery } from "@tanstack/react-query";
import ClassCard from "@/components/teacher/class-card";
import CreateClassModal from "@/components/teacher/create-class-modal";
import { colleges } from "@/config/colleges";
import { classroomQueries } from "@/features/classroom/queries";
import { Input } from "@/ui/input";
import {
	Select,
	SelectItem,
	SelectItemIndicator,
	SelectItemText,
	SelectList,
	SelectPopup,
	SelectPortal,
	SelectPositioner,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";

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
					<CreateClassModal />
				</div>
			</div>

			<div className="-mx-2.5 mt-2 flex items-center">
				<Select
					modal={false}
					defaultValue="newest"
					items={[
						{ label: "Newest", value: "newest" },
						{ label: "Oldest", value: "oldest" },
						{ label: "Active", value: "active" },
					]}
				>
					<SelectTrigger className="min-w-0 bg-transparent shadow-none">
						<SelectValue />
						<AltArrowDownIcon strokeWidth={2} size={16} />
					</SelectTrigger>

					<SelectPortal>
						<SelectPositioner
							sideOffset={0}
							align="start"
							alignItemWithTrigger={false}
						>
							<SelectPopup className="min-w-30">
								<SelectList>
									{[
										{ label: "Newest", value: "newest" },
										{ label: "Oldest", value: "oldest" },
										{ label: "Active", value: "active" },
									].map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<SelectItemText>{option.label}</SelectItemText>
											<SelectItemIndicator>
												<CheckIcon strokeWidth={2} size={16} />
											</SelectItemIndicator>
										</SelectItem>
									))}
								</SelectList>
							</SelectPopup>
						</SelectPositioner>
					</SelectPortal>
				</Select>

				<Select
					modal={false}
					defaultValue="all"
					items={[
						{ label: "All", value: "all" },
						...colleges.map((college) => ({
							label: college.code,
							value: college.code.toLowerCase(),
						})),
					]}
				>
					<SelectTrigger className="min-w-0 bg-transparent shadow-none">
						<SelectValue />
						<AltArrowDownIcon strokeWidth={2} size={16} />
					</SelectTrigger>

					<SelectPortal>
						<SelectPositioner
							sideOffset={0}
							align="start"
							alignItemWithTrigger={false}
						>
							<SelectPopup className="min-w-30">
								<SelectList>
									{[
										{ label: "All", value: "all" },
										...colleges.map((college) => ({
											label: college.code,
											value: college.code.toLowerCase(),
										})),
									].map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<SelectItemText>{option.label}</SelectItemText>
											<SelectItemIndicator>
												<CheckIcon strokeWidth={2} size={16} />
											</SelectItemIndicator>
										</SelectItem>
									))}
								</SelectList>
							</SelectPopup>
						</SelectPositioner>
					</SelectPortal>
				</Select>
			</div>

			<div className="mt-2 grid grid-cols-3 gap-4">
				{data.data.map((detail) => (
					<ClassCard key={detail.classroom.id} detail={detail} />
				))}
			</div>
		</div>
	);
}
