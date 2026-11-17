import type { CourseLesson, CourseSection } from "@shared/index";
import type {
	CreateLessonInput,
	UpdateLessonInput,
} from "@shared/schema/course.schema";
import { AddIcon, TrashBin2Icon } from "@solar-icons/react/linear";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import CourseQuizEditor from "@/components/teacher/course-quiz-editor";
import { courseMutations } from "@/features/course/mutations";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/ui/button";
import { Checkbox, CheckboxIndicator } from "@/ui/checkbox";
import { Field, FieldControl, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";

type LessonType = "video" | "text" | "quiz";

function useInvalidateCourse(courseId: string) {
	const queryClient = useQueryClient();
	return () =>
		queryClient.invalidateQueries({
			queryKey: ["courses", "detail", courseId],
		});
}

function LessonEditor({
	courseId,
	lesson,
}: {
	courseId: string;
	lesson: CourseLesson;
}) {
	const invalidateCourse = useInvalidateCourse(courseId);
	const [title, setTitle] = useState(lesson.title);
	const [content, setContent] = useState(lesson.content ?? "");
	const [videoUrl, setVideoUrl] = useState(lesson.videoUrl ?? "");
	const [durationSeconds, setDurationSeconds] = useState(
		lesson.durationSeconds ? String(lesson.durationSeconds) : "",
	);
	const [isPreview, setIsPreview] = useState(lesson.isPreview);
	const updateLesson = useMutation({
		mutationFn: (data: UpdateLessonInput) =>
			courseMutations.updateLesson(courseId, lesson.id, data),
		onSuccess: invalidateCourse,
	});
	const deleteLesson = useMutation({
		mutationFn: () => courseMutations.deleteLesson(courseId, lesson.id),
		onSuccess: invalidateCourse,
	});

	const saveLesson = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data: UpdateLessonInput = {
			title,
			isPreview,
			content: lesson.type === "text" ? content.trim() || null : undefined,
			videoUrl: lesson.type === "video" ? videoUrl.trim() || null : undefined,
			durationSeconds:
				lesson.type === "video"
					? durationSeconds
						? Number(durationSeconds)
						: null
					: undefined,
		};
		setTitle(title.trim());
		updateLesson.mutate(data);
	};

	const removeLesson = () => {
		if (window.confirm("Delete this lesson and its quiz content?")) {
			deleteLesson.mutate();
		}
	};

	return (
		<article className="rounded-lg bg-white p-4">
			<form onSubmit={saveLesson} className="space-y-3">
				<div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
					<div className="flex items-center gap-2 px-2">
						<span className="font-medium tracking-tight text-zinc-700">
							Lesson {lesson.position}
						</span>
						<span className="rounded-full font-medium bg-zinc-100 px-2 py-1 text-xs capitalize text-zinc-600">
							{lesson.type === "quiz"
								? "Quiz"
								: lesson.type === "video"
									? "Video"
									: "Text"}
						</span>
					</div>
					<div className="flex gap-2">
						<Button
							type="submit"
							variant="flat"
							disabled={updateLesson.isPending}
						>
							{updateLesson.isPending ? "Saving..." : "Save lesson"}
						</Button>
						<Button
							type="button"
							variant="flat"
							className="text-red-600"
							disabled={deleteLesson.isPending}
							onClick={removeLesson}
						>
							<TrashBin2Icon />
						</Button>
					</div>
				</div>

				<Field>
					<FieldLabel>Lesson title</FieldLabel>
					<FieldControl
						render={
							<Input
								required
								maxLength={160}
								value={title}
								onChange={(event) => setTitle(event.target.value)}
							/>
						}
					/>
				</Field>

				{lesson.type === "text" && (
					<Field>
						<FieldLabel>Lesson content (Markdown supported)</FieldLabel>
						<FieldControl
							render={
								<Textarea
									maxLength={50000}
									value={content}
									onChange={(event) => setContent(event.target.value)}
									placeholder="Write the lesson content..."
								/>
							}
						/>
					</Field>
				)}

				{lesson.type === "video" && (
					<div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
						<Field>
							<FieldLabel>Video URL</FieldLabel>
							<FieldControl
								render={
									<Input
										type="url"
										value={videoUrl}
										onChange={(event) => setVideoUrl(event.target.value)}
										placeholder="https://..."
									/>
								}
							/>
						</Field>
						<Field>
							<FieldLabel>Duration (seconds)</FieldLabel>
							<FieldControl
								render={
									<Input
										type="number"
										min={1}
										max={86400}
										value={durationSeconds}
										onChange={(event) => setDurationSeconds(event.target.value)}
										placeholder="Optional"
									/>
								}
							/>
						</Field>
					</div>
				)}

				<Field className="flex-row items-center">
					<Checkbox
						checked={isPreview}
						onCheckedChange={(checked) => setIsPreview(checked === true)}
					>
						<CheckboxIndicator />
					</Checkbox>
					<FieldLabel>Allow this lesson as a preview</FieldLabel>
				</Field>

				{updateLesson.isError && (
					<p role="alert" className="text-sm text-destructive">
						{getApiErrorMessage(updateLesson.error, "Could not save lesson.")}
					</p>
				)}
				{deleteLesson.isError && (
					<p role="alert" className="text-sm text-destructive">
						{getApiErrorMessage(deleteLesson.error, "Could not delete lesson.")}
					</p>
				)}
			</form>

			{lesson.type === "quiz" && (
				<CourseQuizEditor
					courseId={courseId}
					lessonId={lesson.id}
					lessonTitle={lesson.title}
					quiz={lesson.quizzes[0]}
					key={`${lesson.quizzes[0]?.id ?? "new"}-${lesson.quizzes[0]?.updatedAt ?? ""}-${lesson.title}`}
				/>
			)}
		</article>
	);
}

export default function CourseSectionEditor({
	courseId,
	section,
}: {
	courseId: string;
	section: CourseSection;
}) {
	const invalidateCourse = useInvalidateCourse(courseId);
	const [title, setTitle] = useState(section.title);
	const [showLessonForm, setShowLessonForm] = useState(false);
	const [lessonTitle, setLessonTitle] = useState("");
	const [lessonType, setLessonType] = useState<LessonType>("text");
	const updateSection = useMutation({
		mutationFn: () =>
			courseMutations.updateSection(courseId, section.id, { title }),
		onSuccess: async () => {
			setTitle((current) => current.trim());
			await invalidateCourse();
		},
	});
	const deleteSection = useMutation({
		mutationFn: () => courseMutations.deleteSection(courseId, section.id),
		onSuccess: invalidateCourse,
	});
	const createLesson = useMutation({
		mutationFn: (data: CreateLessonInput) =>
			courseMutations.createLesson(courseId, section.id, data),
		onSuccess: async () => {
			setLessonTitle("");
			setShowLessonForm(false);
			await invalidateCourse();
		},
	});

	const saveSection = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		updateSection.mutate();
	};
	const addLesson = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		createLesson.mutate({
			title: lessonTitle,
			type: lessonType,
			videoUrl: "",
			isPreview: false,
		});
	};
	const removeSection = () => {
		if (
			window.confirm("Delete this section and all of its lessons and quizzes?")
		) {
			deleteSection.mutate();
		}
	};

	return (
		<section className="space-y-3 rounded-xl bg-zinc-50 p-4 sm:p-5">
			<form
				onSubmit={saveSection}
				className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"
			>
				<div className="flex flex-1 items-center gap-3">
					<span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
						{section.position}
					</span>
					<Field className="flex-1">
						<FieldControl
							render={
								<Input
									required
									maxLength={160}
									value={title}
									onChange={(event) => setTitle(event.target.value)}
									aria-label={`Section ${section.position} title`}
									className="font-semibold"
								/>
							}
						/>
					</Field>
				</div>
				<div className="flex gap-2 pl-11 sm:pl-0">
					<Button
						type="submit"
						variant="flat"
						disabled={updateSection.isPending || title.trim() === section.title}
					>
						Save
					</Button>
					<Button
						type="button"
						variant="flat"
						className="text-red-600"
						disabled={deleteSection.isPending}
						onClick={removeSection}
					>
						Delete section
					</Button>
				</div>
			</form>

			{updateSection.isError && (
				<p role="alert" className="text-sm text-destructive">
					{getApiErrorMessage(updateSection.error, "Could not update section.")}
				</p>
			)}
			{deleteSection.isError && (
				<p role="alert" className="text-sm text-destructive">
					{getApiErrorMessage(deleteSection.error, "Could not delete section.")}
				</p>
			)}

			<div className="space-y-3 pl-0 sm:pl-11">
				{section.lessons.map((lesson) => (
					<LessonEditor key={lesson.id} courseId={courseId} lesson={lesson} />
				))}

				{showLessonForm ? (
					<form
						onSubmit={addLesson}
						className="grid gap-2 rounded-lg border border-dashed border-zinc-300 bg-white p-3 sm:grid-cols-[1fr_10rem_auto]"
					>
						<Field>
							<FieldControl
								render={
									<Input
										required
										maxLength={160}
										value={lessonTitle}
										onChange={(event) => setLessonTitle(event.target.value)}
										placeholder="Lesson title"
										aria-label="Lesson title"
									/>
								}
							/>
						</Field>
						<select
							className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
							value={lessonType}
							onChange={(event) =>
								setLessonType(event.target.value as LessonType)
							}
							aria-label="Lesson type"
						>
							<option value="text">Text</option>
							<option value="video">Video</option>
							<option value="quiz">Quiz</option>
						</select>
						<Button type="submit" disabled={createLesson.isPending}>
							{createLesson.isPending ? "Adding..." : "Add lesson"}
						</Button>
						{createLesson.isError && (
							<p
								role="alert"
								className="text-sm text-destructive sm:col-span-3"
							>
								{getApiErrorMessage(
									createLesson.error,
									"Could not add lesson.",
								)}
							</p>
						)}
					</form>
				) : (
					<Button variant="flat" onClick={() => setShowLessonForm(true)}>
						<AddIcon size={15} />
						Add lesson
					</Button>
				)}
			</div>
		</section>
	);
}
