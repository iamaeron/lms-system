import type { CourseQuiz } from "@shared/index";
import { AddIcon, MinusIcon } from "@solar-icons/react/linear";
import { useEffect, useRef, useState } from "react";
import { ActionIcon } from "@/ui/action-icon";
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
export type QuizDraft = {
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

function createDraft(
	quiz: CourseQuiz | undefined,
	lessonTitle: string,
): QuizDraft {
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
	lessonId,
	lessonTitle,
	quiz,
	onDraftChange,
}: {
	lessonId: string;
	lessonTitle: string;
	quiz?: CourseQuiz;
	onDraftChange: (lessonId: string, draft: QuizDraft) => void;
}) {
	const [draft, setDraft] = useState(() => createDraft(quiz, lessonTitle));
	const questionInputRefs = useRef(new Map<number, HTMLInputElement>());
	const pendingFocusIndex = useRef<number | null>(null);
	const commitDraft = (next: QuizDraft) => {
		setDraft(next);
		onDraftChange(lessonId, next);
	};
	useEffect(() => {
		const index = pendingFocusIndex.current;
		if (index === null) return;
		const input = questionInputRefs.current.get(index);
		if (!input) return;
		pendingFocusIndex.current = null;
		input.scrollIntoView({ behavior: "smooth", block: "center" });
		input.focus({ preventScroll: true });
	}, [draft.questions.length]);

	const updateQuestion = (
		index: number,
		update: (question: QuestionDraft) => QuestionDraft,
	) => {
		commitDraft({
			...draft,
			questions: draft.questions.map((question, itemIndex) =>
				itemIndex === index ? update(question) : question,
			),
		});
	};

	return (
		<div className="mt-4 space-y-4 rounded-lg bg-zinc-50 p-4">
			<div>
				<h4 className="font-medium text-zinc-800">Quiz settings</h4>
				<p className="mt-1 text-xs text-zinc-500">
					Edits are locked after a student has attempted this quiz.
				</p>
			</div>

			<Field>
				<FieldLabel>Quiz title</FieldLabel>
				<FieldControl
					render={
						<Input
							required
							maxLength={160}
							value={draft.title}
							onChange={(event) => commitDraft({ ...draft, title: event.target.value })}
						/>
					}
				/>
			</Field>

			<div className="grid gap-3 sm:grid-cols-3">
				<Field>
					<FieldLabel>Passing score (%)</FieldLabel>
					<FieldControl
						render={
							<Input
								type="number"
								min={0}
								max={100}
								value={draft.passingScore}
								onChange={(event) => commitDraft({ ...draft, passingScore: event.target.value })}
							/>
						}
					/>
				</Field>
				<Field>
					<FieldLabel>Attempts</FieldLabel>
					<FieldControl
						render={
							<Input
								type="number"
								min={1}
								max={100}
								value={draft.maxAttempts}
								onChange={(event) => commitDraft({ ...draft, maxAttempts: event.target.value })}
								placeholder="Unlimited"
							/>
						}
					/>
				</Field>
				<Field>
					<FieldLabel>Time limit (minutes)</FieldLabel>
					<FieldControl
						render={
							<Input
								type="number"
								min={1}
								max={1440}
								value={draft.timeLimitMinutes}
								onChange={(event) => commitDraft({ ...draft, timeLimitMinutes: event.target.value })}
								placeholder="No limit"
							/>
						}
					/>
				</Field>
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between gap-3">
					<h5 className="text-sm font-medium text-zinc-700">Questions</h5>
					<Button
						type="button"
						variant="flat"
					onClick={() => {
						pendingFocusIndex.current = draft.questions.length;
						commitDraft({
							...draft,
							questions: [...draft.questions, createQuestion()],
						});
					}}
					>
						<AddIcon size={15} />
						Add question
					</Button>
				</div>

				{draft.questions.length === 0 && (
					<p className="rounded-md border border-dashed border-zinc-300 px-3 py-4 text-center text-sm text-zinc-500">
						No questions yet. Add questions here, then save all course changes below.
					</p>
				)}

				<div className="space-y-6">
					{draft.questions.map((question, questionIndex) => (
						<div className="flex gap-2" key={questionIndex}>
							<div className="text-sm text-zinc-700 font-medium bg-zinc-200 rounded-full flex items-center justify-center size-6 shrink-0">
								{questionIndex + 1}
							</div>
							<fieldset className="flex-1 space-y-1 rounded-lg">
								<legend className="sr-only">
									Question {questionIndex + 1}
								</legend>
								<div className="bg-white p-3 rounded-t-xl rounded-b-sm flex flex-col gap-2 sm:flex-row sm:items-end">
									<Field className="min-w-0 flex-1">
										<FieldLabel>Question {questionIndex + 1}</FieldLabel>
										<FieldControl
											render={
												<Input
													required
													maxLength={2000}
													ref={(input) => {
									if (input) {
										questionInputRefs.current.set(questionIndex, input);
									} else {
										questionInputRefs.current.delete(questionIndex);
									}
													}}
													value={question.prompt}
													onChange={(event) => {
														const prompt = event.currentTarget.value;
														updateQuestion(questionIndex, (current) => ({
															...current,
															prompt,
														}));
													}}
													placeholder={`Question ${questionIndex + 1}`}
												/>
											}
										/>
									</Field>
									<Field className="sm:w-40 sm:shrink-0">
										<FieldLabel>Type</FieldLabel>
										<FieldControl
											render={
												<select
													className="w-full rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
													value={question.type}
													onChange={(event) => {
														const type = event.currentTarget
															.value as QuestionType;
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
																current.options.findIndex(
																	(option) => option.isCorrect,
																),
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
													<option value="true_false">True or False</option>
												</select>
											}
										/>
									</Field>
									<Field className="sm:w-24 sm:shrink-0">
										<FieldLabel>Points</FieldLabel>
										<FieldControl
											render={
												<Input
													type="number"
													min={1}
													max={1000}
													value={question.points}
													onChange={(event) => {
														const points = event.currentTarget.value;
														updateQuestion(questionIndex, (current) => ({
															...current,
															points,
														}));
													}}
												/>
											}
										/>
									</Field>
									<Button
										type="button"
										variant="flat"
										className="sm:self-end"
										onClick={() =>
							commitDraft({
								...draft,
								questions: draft.questions.filter(
													(_, index) => index !== questionIndex,
												),
							})
										}
										aria-label={`Remove question ${questionIndex + 1}`}
									>
										Remove
									</Button>
								</div>

								<div className="space-y-2 bg-white rounded-b-xl rounded-t-sm p-3">
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
													const checked = event.currentTarget.checked;
													updateQuestion(questionIndex, (current) => ({
														...current,
														options: current.options.map((item, index) => ({
															...item,
															isCorrect:
																question.type === "multiple_choice"
																	? index === optionIndex
																		? checked
																		: item.isCorrect
																	: index === optionIndex,
														})),
													}));
												}}
												aria-label={`Mark option ${optionIndex + 1} correct`}
											/>
											<Input
												required
												readOnly={question.type === "true_false"}
												maxLength={500}
												value={option.text}
												onChange={(event) => {
													const text = event.currentTarget.value;
													updateQuestion(questionIndex, (current) => ({
														...current,
														options: current.options.map((item, index) =>
															index === optionIndex ? { ...item, text } : item,
														),
													}));
												}}
												placeholder={`Option ${optionIndex + 1}`}
											/>
											{question.type !== "true_false" &&
												question.options.length > 2 && (
													<ActionIcon
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
														<MinusIcon strokeWidth={2} />
													</ActionIcon>
												)}
										</div>
									))}
									{question.type !== "true_false" &&
										question.options.length < 6 && (
											<Button
												type="button"
												variant="flat"
												className="ml-6.5"
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
						</div>
					))}
				</div>
			</div>

		</div>
	);
}
