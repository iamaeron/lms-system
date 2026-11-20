import { saveQuizSchema } from "@shared/schema/course.schema";
import { AddIcon, AltArrowLeftIcon } from "@solar-icons/react/linear";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import type { QuizDraft } from "@/components/teacher/course-quiz-editor";
import CourseSectionEditor, {
	type LessonDraft,
	LessonEditor,
	type SectionDraft,
} from "@/components/teacher/course-section-editor";
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
	const [lessonDrafts, setLessonDrafts] = useState<Record<string, LessonDraft>>(
		{},
	);
	const [sectionDrafts, setSectionDrafts] = useState<
		Record<string, SectionDraft>
	>({});
	const [quizDrafts, setQuizDrafts] = useState<Record<string, QuizDraft>>({});
	const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
	const activeLesson =
		course.sections
			.flatMap((module) => module.lessons)
			.find((lesson) => lesson.id === activeLessonId) ?? null;
	const activeModule =
		course.sections.find((module) =>
			module.lessons.some((lesson) => lesson.id === activeLessonId),
		) ?? null;
	const saveChanges = useMutation({
		mutationFn: async () => {
			const quizInputs = Object.entries(quizDrafts).map(([lessonId, draft]) => {
				const parsed = saveQuizSchema.safeParse({
					title: draft.title,
					passingScore: Number(draft.passingScore),
					maxAttempts: draft.maxAttempts ? Number(draft.maxAttempts) : null,
					timeLimitMinutes: draft.timeLimitMinutes
						? Number(draft.timeLimitMinutes)
						: null,
					questions: draft.questions.map((question) => ({
						...question,
						points: Number(question.points),
					})),
				});
				if (!parsed.success) {
					throw new Error(
						parsed.error.issues[0]?.message ?? "Check the quiz questions.",
					);
				}
				return { lessonId, data: parsed.data };
			});
			await Promise.all([
				...Object.entries(lessonDrafts).map(([lessonId, data]) =>
					courseMutations.updateLesson(courseId, lessonId, {
						...data,
						title: data.title?.trim(),
						content:
							typeof data.content === "string"
								? data.content.trim() || null
								: data.content,
						videoUrl:
							typeof data.videoUrl === "string"
								? data.videoUrl.trim() || null
								: data.videoUrl,
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
			await queryClient.invalidateQueries({
				queryKey: ["courses", "detail", courseId],
			});
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
		<div className="space-y-6 pb-32">
			<header className="space-y-4">
				<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div>
						<p className="text-sm font-medium capitalize text-zinc-500">
							{course.status}
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
						<span>{course.sections.length} modules</span>
						<span>{lessonCount} lessons</span>
					</div>
				</div>
			</header>

			<section className="space-y-4">
				{activeLesson ? (
					<>
						<Button
							type="button"
							variant="flat"
							onClick={() => setActiveLessonId(null)}
						>
							<AltArrowLeftIcon size={16} /> All modules
						</Button>
						<div className="grid items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
							<aside className="top-4 space-y-2 rounded-xl bg-white lg:sticky lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
								<p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
									{activeModule?.title ?? "Module lessons"}
								</p>
								{activeModule?.lessons.map((lesson) => (
									<button
										key={lesson.id}
										type="button"
										onClick={() => setActiveLessonId(lesson.id)}
										className={
											lesson.id === activeLesson.id
												? "w-full rounded-lg bg-blue-100 px-2 py-2 text-left text-sm font-semibold text-blue-800"
												: "w-full rounded-lg px-2 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50"
										}
									>
										{lesson.position}. {lesson.title}
									</button>
								))}
							</aside>
							<div className="border-l border-dashed border-zinc-300 pl-4 min-w-0">
								<h2 className="pl-2 mb-4 text-2xl font-semibold">
									{activeLesson.title}
								</h2>
								<LessonEditor
									key={activeLesson.id}
									courseId={courseId}
									lesson={activeLesson}
									onDraftChange={(id, draft) =>
										setLessonDrafts((current) => ({ ...current, [id]: draft }))
									}
									onQuizDraftChange={(id, draft) =>
										setQuizDrafts((current) => ({ ...current, [id]: draft }))
									}
								/>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="flex items-end justify-between gap-3">
							<div>
								<h2 className="text-lg font-semibold">Course modules</h2>
								<p className="text-sm text-zinc-500">
									Open a lesson to edit its content.
								</p>
							</div>
							<form
								onSubmit={(event) => {
									event.preventDefault();
									form.handleSubmit();
								}}
								className="flex gap-2"
							>
								<form.AppField name="title">
									{(field) => (
										<field.TextField
											label="Module title"
											hideLabel
											required
											placeholder="Module title"
											aria-label="Module title"
											wrapperClassName="sm:w-64"
										/>
									)}
								</form.AppField>
								<Button type="submit" disabled={createSection.isPending}>
									<AddIcon size={16} /> Add module
								</Button>
							</form>
						</div>
						{createSection.isError && (
							<p role="alert" className="text-sm text-destructive">
								{getApiErrorMessage(
									createSection.error,
									"Could not create module.",
								)}
							</p>
						)}
						{course.sections.length === 0 ? (
							<div className="rounded-xl border border-dashed p-12 text-center">
								Start with a module
							</div>
						) : (
							<div className="grid gap-4 xl:grid-cols-2">
								{course.sections.map((module) => (
									<CourseSectionEditor
										key={module.id}
										courseId={courseId}
										section={module}
										onOpenLesson={(lesson) => setActiveLessonId(lesson.id)}
										onSectionDraftChange={(id, draft) =>
											setSectionDrafts((current) => ({
												...current,
												[id]: draft,
											}))
										}
									/>
								))}
							</div>
						)}
					</>
				)}
			</section>
			<div className="fixed bottom-0 left-[18rem] right-2 z-30 bg-gradient-to-t from-white via-white/95 to-transparent px-4 pb-4 pt-10">
				<div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur">
					<p className="text-sm text-zinc-600">
						{Object.keys(lessonDrafts).length +
						Object.keys(sectionDrafts).length +
						Object.keys(quizDrafts).length
							? "Unsaved changes"
							: "All changes saved"}
					</p>
					<Button
						type="button"
						disabled={
							(!Object.keys(lessonDrafts).length &&
								!Object.keys(sectionDrafts).length &&
								!Object.keys(quizDrafts).length) ||
							saveChanges.isPending
						}
						onClick={() => saveChanges.mutate()}
					>
						{saveChanges.isPending ? "Saving changes..." : "Save changes"}
					</Button>
					{saveChanges.isError && (
						<p role="alert" className="basis-full text-sm text-destructive">
							{getApiErrorMessage(
								saveChanges.error,
								"Could not save all changes.",
							)}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
