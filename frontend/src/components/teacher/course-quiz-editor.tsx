import type { CourseQuiz } from "@shared/index";
import {
	saveQuizSchema,
	type SaveQuizInput,
} from "@shared/schema/course.schema";
import { AddIcon } from "@solar-icons/react/linear";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { courseMutations } from "@/features/course/mutations";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/ui/button";
import { Field, FieldControl, FieldLabel } from "@/ui/field";
import { Input } from "@/ui/input";

type QuestionType = "single_choice" | "multiple_choice" | "true_false";
type OptionDraft = { text: string; isCorrect: boolean };
type QuestionDraft = {
	type: QuestionType;
	prompt: string;
	points: string;
	options: OptionDraft[];
};
type QuizDraft = {
	title: string;
	passingScore: string;
	maxAttempts: string;
	timeLimitMinutes: string;
	questions: QuestionDraft[];
};

function createQuestion(type: QuestionType = "single_choice"): QuestionDraft {
	return {
		type,
		prompt: "",
		points: "1",
		options:
			type === "true_false"
				? [
						{ text: "True", isCorrect: true },
						{ text: "False", isCorrect: false },
					]
				: [
						{ text: "", isCorrect: true },
						{ text: "", isCorrect: false },
					],
	};
}

function createDraft(quiz: CourseQuiz | undefined, lessonTitle: string): QuizDraft {
	return {
		title: quiz?.title ?? `${lessonTitle} Quiz`,
		passingScore: String(quiz?.passingScore ?? 70),
		maxAttempts: quiz?.maxAttempts ? String(quiz.maxAttempts) : "",
		timeLimitMinutes: quiz?.timeLimitMinutes
			? String(quiz.timeLimitMinutes)
			: "",
		questions:
			quiz?.questions.map((question) => ({
				type: question.type,
				prompt: question.prompt,
				points: String(question.points),
				options: question.options.map((option) => ({
					text: option.text,
					isCorrect: option.isCorrect,
				})),
			})) ?? [],
	};
}

export default function CourseQuizEditor({
	courseId,
	lessonId,
	lessonTitle,
	quiz,
}: {
	courseId: string;
	lessonId: string;
	lessonTitle: string;
	quiz?: CourseQuiz;
}) {
	const queryClient = useQueryClient();
	const [draft, setDraft] = useState(() => createDraft(quiz, lessonTitle));
	const [validationError, setValidationError] = useState("");

	const saveQuiz = useMutation({
		mutationFn: (variables: {
			courseId: string;
			lessonId: string;
			data: SaveQuizInput;
		}) =>
			courseMutations.saveQuiz(
				variables.courseId,
				variables.lessonId,
				variables.data,
			),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["courses", "detail", courseId],
			});
		},
	});

	const updateQuestion = (
		index: number,
		update: (question: QuestionDraft) => QuestionDraft,
	) => {
		setDraft((current) => ({
			...current,
			questions: current.questions.map((question, itemIndex) =>
				itemIndex === index ? update(question) : question,
			),
		}));
	};

	const submit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setValidationError("");
		saveQuiz.reset();
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
			setValidationError(
				parsed.error.issues[0]?.message ?? "Check the quiz questions.",
			);
			return;
		}

		saveQuiz.mutate({
			courseId,
			lessonId,
			data: parsed.data,
		});
	};

	return (
		<form onSubmit={submit} className="mt-4 space-y-4 rounded-lg bg-zinc-50 p-4">
			<div>
				<h4 className="font-medium text-zinc-800">Quiz settings</h4>
				<p className="mt-1 text-xs text-zinc-500">
					Edits are locked after a student has attempted this quiz.
				</p>
			</div>

			<Field>
				<FieldLabel>Quiz title</FieldLabel>
				<FieldControl render={<Input
					required
					maxLength={160}
					value={draft.title}
					onChange={(event) =>
						setDraft((current) => ({ ...current, title: event.target.value }))
					}
				/>} />
			</Field>

			<div className="grid gap-3 sm:grid-cols-3">
				<Field>
					<FieldLabel>Passing score (%)</FieldLabel>
					<FieldControl render={<Input
						type="number"
						min={0}
						max={100}
						value={draft.passingScore}
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								passingScore: event.target.value,
							}))
						}
					/>} />
				</Field>
				<Field>
					<FieldLabel>Attempts</FieldLabel>
					<FieldControl render={<Input
						type="number"
						min={1}
						max={100}
						value={draft.maxAttempts}
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								maxAttempts: event.target.value,
							}))
						}
						placeholder="Unlimited"
					/>} />
				</Field>
				<Field>
					<FieldLabel>Time limit (minutes)</FieldLabel>
					<FieldControl render={<Input
						type="number"
						min={1}
						max={1440}
						value={draft.timeLimitMinutes}
						onChange={(event) =>
							setDraft((current) => ({
								...current,
								timeLimitMinutes: event.target.value,
							}))
						}
						placeholder="No limit"
					/>} />
				</Field>
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between gap-3">
					<h5 className="text-sm font-medium text-zinc-700">Questions</h5>
					<Button
						type="button"
						variant="flat"
						onClick={() =>
							setDraft((current) => ({
								...current,
								questions: [...current.questions, createQuestion()],
							}))
						}
					>
						<AddIcon size={15} />
						Add question
					</Button>
				</div>

				{draft.questions.length === 0 && (
					<p className="rounded-md border border-dashed border-zinc-300 px-3 py-4 text-center text-sm text-zinc-500">
						No questions yet. You can save the quiz and add questions later.
					</p>
				)}

				{draft.questions.map((question, questionIndex) => (
					<fieldset
						key={questionIndex}
						className="space-y-3 rounded-lg border border-zinc-200 bg-white p-3"
					>
						<legend className="sr-only">Question {questionIndex + 1}</legend>
						<div className="flex flex-col gap-2 sm:flex-row">
							<Input
								required
								maxLength={2000}
								value={question.prompt}
								onChange={(event) =>
									updateQuestion(questionIndex, (current) => ({
										...current,
										prompt: event.target.value,
									}))
								}
								placeholder={`Question ${questionIndex + 1}`}
								aria-label={`Question ${questionIndex + 1}`}
								wrapperClassName="flex-1"
							/>
							<select
								className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
								value={question.type}
								aria-label={`Question ${questionIndex + 1} type`}
								onChange={(event) => {
									const type = event.target.value as QuestionType;
									updateQuestion(questionIndex, (current) => {
										if (type === "true_false") {
											return {
												...current,
												type,
												options: [
													{ text: "True", isCorrect: true },
													{ text: "False", isCorrect: false },
												],
											};
										}
										const firstCorrect = Math.max(
											0,
											current.options.findIndex((option) => option.isCorrect),
										);
										return {
											...current,
											type,
											options: current.options.map((option, index) => ({
												...option,
												isCorrect:
													type === "single_choice"
														? index === firstCorrect
														: option.isCorrect || index === firstCorrect,
											})),
										};
									});
								}}
							>
								<option value="single_choice">Single choice</option>
								<option value="multiple_choice">Multiple choice</option>
								<option value="true_false">True or false</option>
							</select>
							<Input
								type="number"
								min={1}
								max={1000}
								value={question.points}
								onChange={(event) =>
									updateQuestion(questionIndex, (current) => ({
										...current,
										points: event.target.value,
									}))
								}
								aria-label={`Question ${questionIndex + 1} points`}
								className="sm:w-20"
							/>
							<Button
								type="button"
								variant="flat"
								onClick={() =>
									setDraft((current) => ({
										...current,
										questions: current.questions.filter(
											(_, index) => index !== questionIndex,
										),
									}))
								}
								aria-label={`Remove question ${questionIndex + 1}`}
							>
								Remove
							</Button>
						</div>

						<div className="space-y-2">
							{question.options.map((option, optionIndex) => (
								<div
									key={optionIndex}
									className="flex items-center gap-2 pl-1"
								>
									<input
										type={
											question.type === "multiple_choice"
												? "checkbox"
												: "radio"
										}
										name={`correct-answer-${questionIndex}`}
										checked={option.isCorrect}
										onChange={(event) => {
											updateQuestion(questionIndex, (current) => ({
												...current,
												options: current.options.map((item, index) => ({
													...item,
													isCorrect:
														question.type === "multiple_choice"
															? index === optionIndex
																? event.target.checked
																: item.isCorrect
															: index === optionIndex,
												})),
											}));
										}}
										aria-label={`Mark option ${optionIndex + 1} correct`}
									/>
									<Input
										required
										disabled={question.type === "true_false"}
										maxLength={500}
										value={option.text}
										onChange={(event) =>
											updateQuestion(questionIndex, (current) => ({
												...current,
												options: current.options.map((item, index) =>
													index === optionIndex
														? { ...item, text: event.target.value }
														: item,
												),
											}))
										}
										placeholder={`Option ${optionIndex + 1}`}
									/>
									{question.type !== "true_false" &&
										question.options.length > 2 && (
											<Button
												type="button"
												variant="flat"
												onClick={() =>
													updateQuestion(questionIndex, (current) => ({
														...current,
														options: current.options.filter(
															(_, index) => index !== optionIndex,
														),
													}))
												}
											>
												Remove
											</Button>
										)}
								</div>
							))}
							{question.type !== "true_false" &&
								question.options.length < 6 && (
									<Button
										type="button"
										variant="flat"
										onClick={() =>
											updateQuestion(questionIndex, (current) => ({
												...current,
												options: [
													...current.options,
													{ text: "", isCorrect: false },
												],
											}))
										}
									>
										<AddIcon size={14} />
										Add option
									</Button>
								)}
						</div>
					</fieldset>
				))}
			</div>

			{validationError && (
				<p role="alert" className="text-sm text-destructive">
					{validationError}
				</p>
			)}
			{saveQuiz.isError && (
				<p role="alert" className="text-sm text-destructive">
					{getApiErrorMessage(saveQuiz.error, "Could not save quiz.")}
				</p>
			)}

			<Button type="submit" disabled={saveQuiz.isPending}>
				{saveQuiz.isPending ? "Saving quiz..." : "Save quiz"}
			</Button>
		</form>
	);
}
