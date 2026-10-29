import {
	AddIcon,
	AltArrowDownIcon,
	CheckIcon,
	CloseIcon,
	MagnifierIcon,
} from "@solar-icons/react/linear";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ActionIcon } from "@/components/ui/action-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogBackdrop,
	DialogClose,
	DialogFooter,
	DialogPopup,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldControl, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuPortal,
	MenuPositioner,
	MenuTrigger,
} from "@/components/ui/menu";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip } from "@/components/ui/tooltip";
import { classroomQueries } from "@/features/classroom/queries";
import { classLabel } from "@/lib/classroom";

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
					<Dialog>
						<DialogTrigger render={<Button />}>
							<AddIcon />
							New Class
						</DialogTrigger>

						<DialogPortal>
							<DialogBackdrop />

							<DialogPopup>
								<DialogClose
									className="right-3 top-3 absolute"
									render={<ActionIcon variant="flat" />}
								>
									<CloseIcon size={16} strokeWidth={2} />
								</DialogClose>
								<div className="border-b border-zinc-100 mb-4">
									<DialogTitle>Create a new class</DialogTitle>
								</div>

								<div className="space-y-3">
									<Field required>
										<FieldLabel>Name</FieldLabel>
										<FieldControl
											placeholder="Introduction to Programming"
											render={<Input />}
										/>
									</Field>

									<Field>
										<FieldLabel>Description</FieldLabel>
										<FieldControl
											placeholder="A stressful class ..."
											render={<Textarea />}
										/>
									</Field>
								</div>

								<DialogFooter>
									<DialogClose render={<Button variant="flat" />}>
										Cancel
									</DialogClose>
									<Button>Create</Button>
								</DialogFooter>
							</DialogPopup>
						</DialogPortal>
					</Dialog>
				</div>
			</div>

			<div className="-mx-2 mt-2 flex items-center">
				<Menu modal={false}>
					<MenuTrigger
						render={
							<Button
								size="sm"
								variant="ghost"
								className="font-normal px-2"
							></Button>
						}
					>
						Newest
						<AltArrowDownIcon />
					</MenuTrigger>

					<MenuPortal>
						<MenuPositioner align="start">
							<MenuPopup>
								<MenuItem>
									<div className="flex-1">Newest</div>
									<CheckIcon size={20} />
								</MenuItem>
								<MenuItem>
									<div className="flex-1">Oldest</div>
									<CheckIcon size={20} className="opacity-0" />
								</MenuItem>
								<MenuItem>
									<div className="flex-1">Active</div>
									<CheckIcon size={20} className="opacity-0" />
								</MenuItem>
							</MenuPopup>
						</MenuPositioner>
					</MenuPortal>
				</Menu>

				<Menu modal={false}>
					<MenuTrigger
						render={
							<Button
								size="sm"
								variant="ghost"
								className="font-normal px-2"
							></Button>
						}
					>
						All
						<AltArrowDownIcon />
					</MenuTrigger>

					<MenuPortal>
						<MenuPositioner align="start">
							<MenuPopup>
								<MenuItem>
									<div className="flex-1">All</div>
									<CheckIcon size={20} />
								</MenuItem>
								<MenuItem>
									<div className="flex-1">BSIT</div>
									<CheckIcon size={20} className="opacity-0" />
								</MenuItem>
								<MenuItem>
									<div className="flex-1">BSCS</div>
									<CheckIcon size={20} className="opacity-0" />
								</MenuItem>
							</MenuPopup>
						</MenuPositioner>
					</MenuPortal>
				</Menu>
			</div>

			<div className="mt-2 grid grid-cols-3">
				{data.data.map((detail) => (
					<div
						key={detail.classroom.id}
						className="border border-zinc-200 p-0.5 rounded-lg"
					>
						<div className="shadow-xl shadow-black/3 h-22 w-full bg-linear-to-br rounded-md from-teal-300 to-blue-300  font-serif italic flex flex-col text-sm justify-end p-3 text-black/50">
							<h3>{detail.classroom.name}</h3>
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
				))}
			</div>
		</div>
	);
}
