import {
	AddIcon,
	AltArrowDownIcon,
	CheckIcon,
	CloseIcon,
} from "@solar-icons/react/linear";
import { useState } from "react";
import { ActionIcon } from "@/components/ui/action-icon";
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
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { colleges } from "@/config/colleges";

const CreateClassModal = () => {
	const [section, setSection] = useState("");

	return (
		<Dialog>
			<DialogTrigger render={<Button />}>
				<AddIcon />
				New Class
			</DialogTrigger>

			<DialogPortal>
				<DialogBackdrop />

				<DialogPopup>
					<div className="border-b border-zinc-100 mb-4">
						<DialogTitle>Create a new class</DialogTitle>
					</div>

					<div className="space-y-5">
						<Field required>
							<FieldLabel>Name</FieldLabel>
							<FieldControl
								placeholder="Introduction to Programming"
								render={<Input />}
							/>
						</Field>

						<Field>
							<FieldLabel>Subject Code</FieldLabel>
							<FieldControl placeholder="ITP" render={<Input />} />
						</Field>

						<Field>
							<FieldLabel>Grade & Section</FieldLabel>
							<div className="flex gap-2">
								<Select
									modal={false}
									defaultValue="ccis"
									items={colleges.map((college) => ({
										label: college.code,
										value: college.code.toLowerCase(),
									}))}
								>
									<SelectTrigger className="min-w-0 flex-1">
										<SelectValue />
										<AltArrowDownIcon strokeWidth={2} size={16} />
									</SelectTrigger>

									<SelectPortal>
										<SelectPositioner
											align="start"
											// alignItemWithTrigger={false}
										>
											<SelectPopup className="min-w-30">
												<SelectList>
													{colleges
														.map((college) => ({
															label: college.code,
															value: college.code.toLowerCase(),
														}))
														.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
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
									defaultValue="1"
									items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((v) => ({
										label: v,
										value: v,
									}))}
								>
									<SelectTrigger className="min-w-0 w-15">
										<SelectValue />
										<AltArrowDownIcon strokeWidth={2} size={16} />
									</SelectTrigger>

									<SelectPortal>
										<SelectPositioner
											align="start"
											// alignItemWithTrigger={false}
										>
											<SelectPopup className="min-w-15">
												<SelectList>
													{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
														.map((v) => ({ label: v, value: v }))
														.map((option) => (
															<SelectItem
																key={option.value}
																value={option.value}
															>
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

								<Field>
									<FieldControl
										value={section}
										onValueChange={(value) =>
											setSection(
												value
													.replace(/[^a-zA-Z]/g, "")
													.toUpperCase()
													.slice(0, 1),
											)
										}
										autoComplete="off"
										render={<Input className="w-15 uppercase" />}
									/>
								</Field>
							</div>
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
						<DialogClose render={<Button variant="flat" />}>Cancel</DialogClose>
						<Button>Create</Button>
					</DialogFooter>

					<DialogClose
						className="right-3 top-3 absolute"
						render={<ActionIcon variant="flat" />}
					>
						<CloseIcon size={16} strokeWidth={2} />
					</DialogClose>
				</DialogPopup>
			</DialogPortal>
		</Dialog>
	);
};

export default CreateClassModal;
