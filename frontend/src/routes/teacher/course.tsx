import { AddIcon } from "@solar-icons/react/linear";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useParams } from "react-router";
import CourseSectionEditor, {
	type LessonDraft,
	type SectionDraft,
} from "@/components/teacher/course-section-editor";
import type { QuizDraft } from "@/components/teacher/course-quiz-editor";
import { saveQuizSchema } from "@shared/schema/course.schema";
import { courseMutations } from "@/features/course/mutations";
import { courseQueries } from "@/features/course/queries";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAppForm } from "@/lib/form";
import { Button } from "@/ui/button";
import { useState } from "react";

export default function TeacherCourse() {
	const { courseId = "" } = useParams();
	const queryClient = useQueryClient();
	const { data: response } = useSuspenseQuery(courseQueries.detail(courseId));
	const course = response.data;
	const [lessonDrafts, setLessonDrafts] = useState<Record<string, LessonDraft>>({});
	const [sectionDrafts, setSectionDrafts] = useState<Record<string, SectionDraft>>({});
	const [quizDrafts, setQuizDrafts] = useState<Record<string, QuizDraft>>({});
	const saveChanges = useMutation({
		mutationFn: async () => {
			const quizInputs = Object.entries(quizDrafts).map(([lessonId, draft]) => {
				const parsed = saveQuizSchema.safeParse({
					title: draft.title,
					passingScore: Number(draft.passingScore),
					maxAttempts: draft.maxAttempts ? Number(draft.maxAttempts) : null,
					timeLimitMinutes: draft.timeLimitMinutes ? Number(draft.timeLimitMinutes) : null,
					questions: draft.questions.map((question) => ({
						...question,
						points: Number(question.points),
					})),
				});
				if (!parsed.success) {
					throw new Error(parsed.error.issues[0]?.message ?? "Check the quiz questions.");
				}
				return { lessonId, data: parsed.data };
			});
			await Promise.all([
				...Object.entries(lessonDrafts).map(([lessonId, data]) =>
					courseMutations.updateLesson(courseId, lessonId, {
						...data,
						title: data.title?.trim(),
						content: typeof data.content === "string" ? data.content.trim() || null : data.content,
						videoUrl: typeof data.videoUrl === "string" ? data.videoUrl.trim() || null : data.videoUrl,
					}),
				),
				...Object.entries(sectionDrafts).map(([sectionId, data]) =>
					courseMutations.updateSection(courseId, sectionId, {
						title: data.title?.trim(),
					}),
				),
				...quizInputs.map(({ lessonId, data }) =>
					courseMutations.saveQuiz(courseId, lessonId, data),
				),
			]);
		},
		onSuccess: async () => {
			setLessonDrafts({});
			setSectionDrafts({});
			setQuizDrafts({});
			await queryClient.invalidateQueries({ queryKey: ["courses", "detail", courseId] });
		},
	});
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
								onLessonDraftChange={(lessonId, draft) =>
									setLessonDrafts((current) => ({ ...current, [lessonId]: draft }))
								}
								onSectionDraftChange={(sectionId, draft) =>
									setSectionDrafts((current) => ({ ...current, [sectionId]: draft }))
								}
								onQuizDraftChange={(lessonId, draft) =>
									setQuizDrafts((current) => ({ ...current, [lessonId]: draft }))
								}
							/>
						))}
					</div>
				)}

				<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur">
					<p className="text-sm text-zinc-600">
						{Object.keys(lessonDrafts).length + Object.keys(sectionDrafts).length + Object.keys(quizDrafts).length
							? `${Object.keys(lessonDrafts).length + Object.keys(sectionDrafts).length + Object.keys(quizDrafts).length} item${Object.keys(lessonDrafts).length + Object.keys(sectionDrafts).length + Object.keys(quizDrafts).length === 1 ? "" : "s"} with unsaved changes`
							: "All changes saved"}
					</p>
					<Button
						type="button"
						disabled={(!Object.keys(lessonDrafts).length && !Object.keys(sectionDrafts).length && !Object.keys(quizDrafts).length) || saveChanges.isPending}
						onClick={() => saveChanges.mutate()}
					>
						{saveChanges.isPending ? "Saving changes..." : "Save changes"}
					</Button>
					{saveChanges.isError && (
						<p role="alert" className="basis-full text-sm text-destructive">
							{getApiErrorMessage(saveChanges.error, "Could not save all changes. Please try again.")}
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
