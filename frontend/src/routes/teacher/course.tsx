import { AddIcon } from "@solar-icons/react/linear";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import CourseSectionEditor from "@/components/teacher/course-section-editor";
import { paths } from "@/config/paths";
import { courseMutations } from "@/features/course/mutations";
import { courseQueries } from "@/features/course/queries";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAppForm } from "@/lib/form";
import { Button } from "@/ui/button";

export default function TeacherCourse() {
	const { courseId = "" } = useParams();
	const queryClient = useQueryClient();
	const { data: response } = useSuspenseQuery(courseQueries.detail(courseId));
	const course = response.data;
	const createSection = useMutation({
		mutationFn: (title: string) =>
			courseMutations.createSection(courseId, { title }),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["courses", "detail", courseId],
			});
		},
	});

	const form = useAppForm({
		defaultValues: { title: "" },
		onSubmit: async ({ value }) => {
			const title = value.title.trim();
			if (title) {
				await createSection.mutateAsync(title);
				form.reset();
			}
		},
	});

	const lessonCount = course.sections.reduce(
		(count, section) => count + section.lessons.length,
		0,
	);

	return (
		<div className="space-y-6 pb-8">
			<header className="space-y-4">
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<p className="text-sm font-medium capitalize text-zinc-500">
							{course.status} course
						</p>
						<h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
							{course.title}
						</h1>
						{course.summary && (
							<p className="mt-2 max-w-2xl text-sm text-zinc-600">
								{course.summary}
							</p>
						)}
					</div>
					<div className="flex gap-4 text-sm text-zinc-500">
						<span>{course.sections.length} sections</span>
						<span>{lessonCount} lessons</span>
					</div>
				</div>
			</header>

			<section className="space-y-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-lg font-semibold text-zinc-800">
							Course content
						</h2>
						<p className="mt-1 text-sm text-zinc-500">
							Organize the course into sections, then add text, video, or quiz
							lessons.
						</p>
					</div>
					<form
						onSubmit={(event) => {
							event.preventDefault();
							event.stopPropagation();
							form.handleSubmit();
						}}
						className="flex gap-2"
					>
						<form.AppField name="title">
							{(field) => (
								<field.TextField
									label="Section title"
									hideLabel
									required
									maxLength={160}
									placeholder="Section title"
									aria-label="Section title"
									wrapperClassName="sm:w-64"
								/>
							)}
						</form.AppField>
						<Button type="submit" disabled={createSection.isPending}>
							<AddIcon size={16} />
							Add section
						</Button>
					</form>
				</div>

				{createSection.isError && (
					<p role="alert" className="text-sm text-destructive">
						{getApiErrorMessage(
							createSection.error,
							"Could not create section.",
						)}
					</p>
				)}

				{course.sections.length === 0 ? (
					<div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
						<h3 className="font-medium text-zinc-800">Start with a section</h3>
						<p className="mt-1 text-sm text-zinc-500">
							Sections help organize lessons into modules or topics.
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{course.sections.map((section) => (
							<CourseSectionEditor
								key={section.id}
								courseId={courseId}
								section={section}
							/>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
