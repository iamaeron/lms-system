import { createClassroomSchema } from "@shared/schema/classroom.schema";
import { AddIcon, CloseIcon, MinusIcon } from "@solar-icons/react/linear";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { classroomMutations } from "@/features/classroom/mutations";
import { departmentQueries } from "@/features/department/queries";
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
import { toastManager } from "@/ui/toast";

const gradeOptions = Array.from({ length: 12 }, (_, index) => {
	const value = String(index + 1);
	return { label: value, value };
});

const CreateClassModal = () => {
	const [classRows, setClassRows] = useState([0]);
	const { data: departments = [] } = useQuery(departmentQueries.list());
	const queryClient = useQueryClient();
	const createClass = useMutation({
		mutationFn: classroomMutations.create,
		onSuccess(_data, variables) {
			toastManager.add({
				title: "Class created",
				description: variables.name,
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			name: "",
			subjectCode: "A",
			departmentId0: "",
			gradeLevel0: "1",
			section0: "",
			description: "",
		},
		onSubmit: async ({ value }) => {
			const sharedValues = createClassroomSchema
				.pick({ name: true, subjectCode: true, description: true })
				.required()
				.parse(value);
			await Promise.all(
				classRows.map((row) =>
					createClass.mutateAsync({
						...sharedValues,
						departmentId: form.getFieldValue(
							`departmentId${row}` as never,
						) as string,
						gradeLevel: Number(form.getFieldValue(`gradeLevel${row}` as never)),
						section: form.getFieldValue(`section${row}` as never) as string,
					}),
				),
			);
			await queryClient.invalidateQueries({ queryKey: ["classrooms", "list"] });
			form.reset();
			setClassRows([0]);
		},
	});

	useEffect(() => {
		if (!departments.length) return;
		for (const row of classRows) {
			const fieldName = `departmentId${row}` as never;
			if (!form.getFieldValue(fieldName)) {
				form.setFieldValue(fieldName, departments[0].id as never);
			}
		}
	}, [classRows, departments, form]);

	return (
		<Dialog>
			<DialogTrigger render={<Button />}>
				<AddIcon />
				New Class
			</DialogTrigger>

			<DialogPortal>
				<DialogBackdrop />
				<DialogPopup>
					<div className="mb-4 pl-2">
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

							<div className="space-y-3">
								{/* <p className="text-sm font-medium">Grade &amp; Section</p> */}
								{classRows.map((row, index) => (
									<div className="flex items-end gap-2" key={row}>
										<div className="min-w-0 flex-1">
											<form.AppField name={`departmentId${row}` as never}>
												{(field) => (
													<field.SelectField
														label="College"
														hideLabel={index > 0}
														options={departments.map((department) => ({
															label: department.code ?? department.name,
															value: department.id,
														}))}
													/>
												)}
											</form.AppField>
										</div>
										<div className="w-15 shrink-0">
											<form.AppField name={`gradeLevel${row}` as never}>
												{(field) => (
													<field.SelectField
														label="Grade"
														hideLabel={index > 0}
														options={gradeOptions}
													/>
												)}
											</form.AppField>
										</div>
										<div className="w-15 shrink-0">
											<form.AppField name={`section${row}` as never}>
												{(field) => (
													<field.TextField
														label="Section"
														hideLabel={index > 0}
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
										<ActionIcon
											variant="ghost"
											aria-label="Remove class row"
											disabled={classRows.length === 1}
											onClick={() => {
												setClassRows((rows) =>
													rows.filter((item) => item !== row),
												);
											}}
										>
											<MinusIcon size={16} />
										</ActionIcon>
									</div>
								))}

								<Button
									variant="flat"
									className="w-full"
									type="button"
									onClick={() => {
										const nextRow = Math.max(...classRows) + 1;
										form.setFieldValue(
											`departmentId${nextRow}` as never,
											(departments[0]?.id ?? "") as never,
										);
										form.setFieldValue(
											`gradeLevel${nextRow}` as never,
											"1" as never,
										);
										form.setFieldValue(
											`section${nextRow}` as never,
											"" as never,
										);
										setClassRows((rows) => [...rows, nextRow]);
									}}
								>
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
						className="absolute right-4 top-5"
						render={<ActionIcon variant="ghost" />}
					>
						<CloseIcon size={16} strokeWidth={2} />
					</DialogClose>
				</DialogPopup>
			</DialogPortal>
		</Dialog>
	);
};

export default CreateClassModal;
