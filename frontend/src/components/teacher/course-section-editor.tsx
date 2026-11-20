import type { CourseLesson, CourseSection } from "@shared/index";
import type {
	CreateLessonInput,
	UpdateLessonInput,
	UpdateSectionInput,
} from "@shared/schema/course.schema";
import {
	ClipboardListIcon,
	DocumentIcon,
	PlayCircleIcon,
} from "@solar-icons/react/bold";
import {
	AddIcon,
	AltArrowDownIcon,
	Notebook2Icon,
	TrashBin2Icon,
} from "@solar-icons/react/linear";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { QuizDraft } from "@/components/teacher/course-quiz-editor";
import CourseQuizEditor from "@/components/teacher/course-quiz-editor";
import { courseMutations } from "@/features/course/mutations";
import { getApiErrorMessage } from "@/lib/api-error";
import { ActionIcon } from "@/ui/action-icon";
import { Button } from "@/ui/button";
import { Checkbox, CheckboxIndicator } from "@/ui/checkbox";
import { Field, FieldControl, FieldLabel } from "@/ui/field";
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
import { Textarea } from "@/ui/textarea";

const lessonTypes = [
	{ value: "text", label: "Text" },
	{ value: "video", label: "Video" },
	{ value: "quiz", label: "Quiz" },
] as const;
type LessonType = (typeof lessonTypes)[number]["value"];
export type LessonDraft = UpdateLessonInput;
export type SectionDraft = UpdateSectionInput;

function LessonTypeIcon({ type }: { type: LessonType }) {
	const iconProps = { size: 18, className: "shrink-0 text-zinc-500" };
	if (type === "text") return <DocumentIcon {...iconProps} />;
	if (type === "video") return <PlayCircleIcon {...iconProps} />;
	return <ClipboardListIcon {...iconProps} />;
}

function useInvalidateCourse(courseId: string) {
	const queryClient = useQueryClient();
	return () =>
		queryClient.invalidateQueries({
			queryKey: ["courses", "detail", courseId],
		});
}

export function LessonEditor({
	courseId,
	lesson,
	onDraftChange,
	onQuizDraftChange,
}: {
	courseId: string;
	lesson: CourseLesson;
	onDraftChange: (lessonId: string, data: LessonDraft) => void;
	onQuizDraftChange: (lessonId: string, draft: QuizDraft) => void;
}) {
	const invalidateCourse = useInvalidateCourse(courseId);
	const [title, setTitle] = useState(lesson.title);
	const [content, setContent] = useState(lesson.content ?? "");
	const [videoUrl, setVideoUrl] = useState(lesson.videoUrl ?? "");
	const [durationSeconds, setDurationSeconds] = useState(
		lesson.durationSeconds ? String(lesson.durationSeconds) : "",
	);
	const [isPreview, setIsPreview] = useState(lesson.isPreview);
	const deleteLesson = useMutation({
		mutationFn: () => courseMutations.deleteLesson(courseId, lesson.id),
		onSuccess: invalidateCourse,
	});

	const updateDraft = (next: Partial<LessonDraft>) => {
		const data: LessonDraft = {
			title,
			isPreview,
			content: lesson.type === "text" ? content : undefined,
			videoUrl: lesson.type === "video" ? videoUrl : undefined,
			durationSeconds:
				lesson.type === "video"
					? durationSeconds
						? Number(durationSeconds)
						: null
					: undefined,
			...next,
		};
		onDraftChange(lesson.id, data);
	};

	const removeLesson = () => {
		if (window.confirm("Delete this lesson and its quiz content?")) {
			deleteLesson.mutate();
		}
	};

	return (
		<article className="rounded-lg bg-white">
			<div className="space-y-3">
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
								onChange={(event) => {
									setTitle(event.target.value);
									updateDraft({ title: event.target.value });
								}}
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
									onChange={(event) => {
										setContent(event.target.value);
										updateDraft({ content: event.target.value });
									}}
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
										onChange={(event) => {
											setVideoUrl(event.target.value);
											updateDraft({ videoUrl: event.target.value });
										}}
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
										onChange={(event) => {
											setDurationSeconds(event.target.value);
											updateDraft({
												durationSeconds: event.target.value
													? Number(event.target.value)
													: null,
											});
										}}
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
						onCheckedChange={(checked) => {
							setIsPreview(checked === true);
							updateDraft({ isPreview: checked === true });
						}}
					>
						<CheckboxIndicator />
					</Checkbox>
					<FieldLabel>Allow this lesson as a preview</FieldLabel>
				</Field>

				{deleteLesson.isError && (
					<p role="alert" className="text-sm text-destructive">
						{getApiErrorMessage(deleteLesson.error, "Could not delete lesson.")}
					</p>
				)}
			</div>

			{lesson.type === "quiz" && (
				<CourseQuizEditor
					lessonId={lesson.id}
					lessonTitle={lesson.title}
					quiz={lesson.quizzes[0]}
					onDraftChange={onQuizDraftChange}
				/>
			)}
		</article>
	);
}

export default function CourseSectionEditor({
	courseId,
	section,
	onSectionDraftChange,
	onOpenLesson,
}: {
	courseId: string;
	section: CourseSection;
	onSectionDraftChange: (sectionId: string, draft: SectionDraft) => void;
	onOpenLesson: (lesson: CourseLesson) => void;
}) {
	const invalidateCourse = useInvalidateCourse(courseId);
	const [title, setTitle] = useState(section.title);
	const [showLessonForm, setShowLessonForm] = useState(false);
	const [lessonTitle, setLessonTitle] = useState("");
	const [lessonType, setLessonType] = useState<LessonType>("text");
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
		<section className="space-y-0.5 flex flex-col rounded-xl bg-zinc-100 p-1.5">
			<div className="bg-white p-3 rounded-t-lg rounded-b-sm">
				<div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
					<div className="flex flex-1 items-start gap-3">
						{/* <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
							{section.position}
						</span> */}
						<div className="min-w-0 flex-1">
							<div className="flex items-center mb-1 justify-between">
								<div className="flex items-center gap-1">
									<Notebook2Icon size={20} className="text-zinc-500" />
									<p className="text-sm font-medium text-zinc-500">
										Module {section.position}
									</p>
								</div>

								<ActionIcon
									size="sm"
									type="button"
									variant="flat"
									className="text-red-600"
									disabled={deleteSection.isPending}
									onClick={removeSection}
								>
									<TrashBin2Icon />
								</ActionIcon>
							</div>
							<Input
								value={title}
								onChange={(event) => {
									setTitle(event.target.value);
									onSectionDraftChange(section.id, {
										title: event.target.value,
									});
								}}
								aria-label={`Module ${section.position} title`}
								className="px-4 mt-1 text-lg font-medium focus-visible:ring-0"
							/>
						</div>
					</div>
					{/* <div className="flex gap-2 pl-11 sm:pl-0">

					</div> */}
				</div>
			</div>

			<div className="bg-white rounded-t-sm rounded-b-lg p-3 flex-1">
				{deleteSection.isError && (
					<p role="alert" className="text-sm text-destructive">
						{getApiErrorMessage(
							deleteSection.error,
							"Could not delete section.",
						)}
					</p>
				)}

				<div className="space-y-3">
					{section.lessons.length ? (
						<div className="space-y-1">
							{section.lessons.map((lesson) => (
								<button
									type="button"
									key={lesson.id}
									onClick={() => onOpenLesson(lesson)}
									className="flex items-center justify-between w-full rounded-lg bg-zinc-50 px-4 py-3 text-left transition hover:border-blue-300 hover:bg-blue-50"
								>
									<span className="min-w-0">
										<span className="block text-xs text-zinc-400">
											Lesson {lesson.position}
										</span>
										<span className="block truncate font-medium text-zinc-800">
											{lesson.title}
										</span>
									</span>
									<span className="ml-3 text-xs capitalize text-zinc-500">
										{lesson.type}
									</span>
								</button>
							))}
						</div>
					) : (
						<p className="text-sm text-zinc-500">No lessons yet.</p>
					)}

					{showLessonForm ? (
						<form
							onSubmit={addLesson}
							className="grid items-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-white p-3 sm:grid-cols-[minmax(0,1fr)_10rem]"
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
							<Select
								value={lessonType}
								onValueChange={(value) => {
									if (value) setLessonType(value as LessonType);
								}}
								items={lessonTypes}
							>
								<SelectTrigger aria-label="Lesson type" className="min-w-0">
									<SelectValue>
										{(value) => {
											const option = lessonTypes.find(
												(item) => item.value === value,
											);
											return option ? (
												<span className="flex items-center gap-2">
													<LessonTypeIcon type={option.value} />
													{option.label}
												</span>
											) : (
												"Select lesson type"
											);
										}}
									</SelectValue>
									<AltArrowDownIcon size={16} />
								</SelectTrigger>
								<SelectPortal>
									<SelectPositioner>
										<SelectPopup>
											<SelectList>
												{lessonTypes.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														<SelectItemText>
															<span className="flex items-center gap-2">
																<LessonTypeIcon type={option.value} />
																{option.label}
															</span>
														</SelectItemText>
														<SelectItemIndicator>✓</SelectItemIndicator>
													</SelectItem>
												))}
											</SelectList>
										</SelectPopup>
									</SelectPositioner>
								</SelectPortal>
							</Select>
							<div className="col-span-full flex justify-end gap-2">
								<Button
									type="button"
									variant="flat"
									onClick={() => setShowLessonForm(false)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={createLesson.isPending}>
									{createLesson.isPending ? "Adding..." : "Add lesson"}
								</Button>
							</div>
							{createLesson.isError && (
								<p
									role="alert"
									className="text-sm text-destructive sm:col-span-2"
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
			</div>
		</section>
	);
}
