import { createClassroomSchema } from "@shared/schema/classroom.schema";
import { AddIcon, CloseIcon } from "@solar-icons/react/linear";
import { useMutation } from "@tanstack/react-query";
import { colleges } from "@/config/colleges";
import { classroomMutations } from "@/features/classroom/mutations";
import { useAppForm } from "@/lib/form";
import { ActionIcon } from "@/ui/action-icon";
import { Button } from "@/ui/button";
import {
	Dialog,
	DialogBackdrop,
	DialogClose,
	DialogFooter,
	DialogPopup,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from "@/ui/dialog";

const gradeOptions = Array.from({ length: 12 }, (_, index) => {
	const value = String(index + 1);
	return { label: value, value };
});

const CreateClassModal = () => {
	const createClass = useMutation({
		mutationFn: classroomMutations.create,
	});

	const form = useAppForm({
		defaultValues: {
			name: "",
			subjectCode: "A",
			departmentId: "1",
			gradeLevel: 1,
			section: "",
			description: "",
		},
		validators: {
			onSubmit: createClassroomSchema.required(),
		},
		onSubmit: async ({ value }) => createClass.mutateAsync(value),
	});

	return (
		<Dialog>
			<DialogTrigger render={<Button />}>
				<AddIcon />
				New Class
			</DialogTrigger>

			<DialogPortal>
				<DialogBackdrop />
				<DialogPopup>
					<div className="mb-4 border-b border-zinc-100">
						<DialogTitle>Create a new class</DialogTitle>
					</div>

					<form
						onSubmit={(event) => {
							event.preventDefault();
							event.stopPropagation();
							form.handleSubmit();
						}}
					>
						<div className="space-y-5">
							<form.AppField name="name">
								{(field) => (
									<field.TextField
										label="Name"
										required
										placeholder="Introduction to Programming"
									/>
								)}
							</form.AppField>

							<form.AppField name="subjectCode">
								{(field) => (
									<field.TextField label="Subject Code" placeholder="ITP" />
								)}
							</form.AppField>

							<div className="space-y-2">
								{/* <p className="text-sm font-medium">Grade &amp; Section</p> */}
								<div className="flex gap-2">
									<div className="min-w-0 flex-1">
										<form.AppField name="departmentId">
											{(field) => (
												<field.SelectField
													label="College"
													options={colleges.map((college) => ({
														label: college.code,
														value: college.code.toLowerCase(),
													}))}
												/>
											)}
										</form.AppField>
									</div>
									<div className="w-15 shrink-0">
										<form.AppField name="gradeLevel">
											{(field) => (
												<field.SelectField
													label="Grade"
													options={gradeOptions}
												/>
											)}
										</form.AppField>
									</div>
									<div className="w-15 shrink-0">
										<form.AppField name="section">
											{(field) => (
												<field.TextField
													label="Section"
													autoComplete="off"
													format={(value) =>
														value
															.replace(/[^a-zA-Z]/g, "")
															.toUpperCase()
															.slice(0, 1)
													}
													className="uppercase"
												/>
											)}
										</form.AppField>
									</div>
								</div>

								<Button variant="flat" className="w-full">
									<AddIcon size={16} />
									Add another class
								</Button>
							</div>

							<form.AppField name="description">
								{(field) => (
									<field.TextareaField
										label="Description"
										placeholder="A stressful class ..."
									/>
								)}
							</form.AppField>
						</div>

						<DialogFooter>
							<DialogClose render={<Button variant="flat" type="button" />}>
								Cancel
							</DialogClose>
							<form.AppForm>
								<form.SubmitButton>Create</form.SubmitButton>
							</form.AppForm>
						</DialogFooter>
					</form>

					<DialogClose
						className="absolute right-3 top-3"
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
