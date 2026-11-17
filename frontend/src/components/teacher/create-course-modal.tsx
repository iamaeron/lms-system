import { createCourseSchema } from "@shared/schema/course.schema";
import { AddIcon, CloseIcon } from "@solar-icons/react/linear";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import { courseMutations } from "@/features/course/mutations";
import { departmentQueries } from "@/features/department/queries";
import { getApiErrorMessage } from "@/lib/api-error";
import { paths } from "@/config/paths";
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
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";

type CourseFormValues = {
	title: string;
	summary: string;
	description: string;
	thumbnailUrl: string;
	departmentId: string;
};

const initialValues: CourseFormValues = {
	title: "",
	summary: "",
	description: "",
	thumbnailUrl: "",
	departmentId: "",
};

export default function CreateCourseModal() {
	const [open, setOpen] = useState(false);
	const [values, setValues] = useState<CourseFormValues>(initialValues);
	const [error, setError] = useState("");
	const { data: departments = [] } = useQuery(departmentQueries.list());
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const createCourse = useMutation({
		mutationFn: courseMutations.create,
		onSuccess: async (created) => {
			await queryClient.invalidateQueries({ queryKey: ["courses", "list"] });
			setValues(initialValues);
			setError("");
			setOpen(false);
			navigate(paths.portal.teacher.course.getHref(created.data.id));
		},
	});

	const setValue = <K extends keyof CourseFormValues>(
		name: K,
		value: CourseFormValues[K],
	) => {
		setValues((current) => ({ ...current, [name]: value }));
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError("");

		const parsed = createCourseSchema.safeParse({
			...values,
			departmentId: values.departmentId || undefined,
		});
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Check the course details.");
			return;
		}

		try {
			await createCourse.mutateAsync(parsed.data);
		} catch (submitError) {
			setError(
				getApiErrorMessage(submitError, "Could not create course. Please try again."),
			);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				render={
					<Button className="shrink-0 self-end bg-white text-zinc-900 shadow-white/0 hover:bg-zinc-100 sm:self-auto" />
				}
			>
				<AddIcon />
				New course
			</DialogTrigger>

			<DialogPortal>
				<DialogBackdrop />
				<DialogPopup className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:w-[34rem]">
					<div className="mb-4 pl-2">
						<DialogTitle>Create a course</DialogTitle>
						<p className="text-sm text-zinc-500">
							Start with a draft. You can organize it into sections and lessons
							later.
						</p>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="space-y-4">
							<label className="block space-y-1.5 text-sm font-medium text-zinc-700">
								<span>Title</span>
								<Input
									autoFocus
									required
									maxLength={160}
									value={values.title}
									onChange={(event) => setValue("title", event.target.value)}
									placeholder="Introduction to Biology"
								/>
							</label>

							<label className="block space-y-1.5 text-sm font-medium text-zinc-700">
								<span>Summary</span>
								<Input
									maxLength={500}
									value={values.summary}
									onChange={(event) => setValue("summary", event.target.value)}
									placeholder="A short overview for the course library"
								/>
							</label>

							<label className="block space-y-1.5 text-sm font-medium text-zinc-700">
								<span>Description</span>
								<Textarea
									maxLength={10000}
									value={values.description}
									onChange={(event) =>
										setValue("description", event.target.value)
									}
									placeholder="What will learners study in this course?"
								/>
							</label>

							<label className="block space-y-1.5 text-sm font-medium text-zinc-700">
								<span>Thumbnail URL</span>
								<Input
									type="url"
									value={values.thumbnailUrl}
									onChange={(event) =>
										setValue("thumbnailUrl", event.target.value)
									}
									placeholder="https://example.com/course-image.jpg"
								/>
							</label>

							<div className="sm:max-w-sm">
								<label className="block space-y-1.5 text-sm font-medium text-zinc-700">
									<span>Department</span>
									<select
										className="w-full rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700 shadow-sm"
										value={values.departmentId}
										onChange={(event) =>
											setValue("departmentId", event.target.value)
										}
									>
										<option value="">No department</option>
										{departments.map((department) => (
											<option key={department.id} value={department.id}>
												{department.code ?? department.name}
											</option>
										))}
									</select>
								</label>
							</div>

							{error && (
								<p role="alert" className="text-sm text-destructive">
									{error}
								</p>
							)}
						</div>

						<DialogFooter>
							<DialogClose
								render={<Button variant="flat" type="button" />}
								disabled={createCourse.isPending}
							>
								Cancel
							</DialogClose>
							<Button type="submit" disabled={createCourse.isPending}>
								{createCourse.isPending ? "Creating..." : "Create draft"}
							</Button>
						</DialogFooter>
					</form>

					<DialogClose
						className="absolute right-4 top-5"
						render={<Button variant="flat" type="button" aria-label="Close" />}
						disabled={createCourse.isPending}
					>
						<CloseIcon size={16} strokeWidth={2} />
					</DialogClose>
				</DialogPopup>
			</DialogPortal>
		</Dialog>
	);
}
