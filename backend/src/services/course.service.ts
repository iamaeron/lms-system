import type {
	CreateCourseInput,
	CreateLessonInput,
	CreateSectionInput,
	SaveQuizInput,
	UpdateLessonInput,
	UpdateSectionInput,
} from "@shared/schema/course.schema";
import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { HTTPException } from "hono/http-exception";
import { db } from "@/db";
import {
	course,
	lesson,
	question,
	questionOption,
	quiz,
	quizAttempt,
	section,
} from "@/db/schema";
import { isUniqueViolation } from "@/lib/errors";

async function assertCourseOwner(instructorId: string, courseId: string) {
	const owned = await db.query.course.findFirst({
		where: { id: courseId, instructorId },
		columns: { id: true },
	});
	if (!owned) throw new HTTPException(404, { message: "Course not found" });
}

async function getOwnedLesson(
	instructorId: string,
	courseId: string,
	lessonId: string,
) {
	const ownedLesson = await db.query.lesson.findFirst({
		where: { id: lessonId },
		with: { section: { columns: { courseId: true } } },
	});
	if (!ownedLesson || !ownedLesson.section) {
		throw new HTTPException(404, { message: "Lesson not found" });
	}
	await assertCourseOwner(instructorId, courseId);
	if (ownedLesson.section.courseId !== courseId) {
		throw new HTTPException(404, { message: "Lesson not found" });
	}
	return ownedLesson;
}

async function assertNoAttemptsInLesson(lessonId: string) {
	const [attempt] = await db
		.select({ id: quizAttempt.id })
		.from(quizAttempt)
		.innerJoin(quiz, eq(quizAttempt.quizId, quiz.id))
		.where(eq(quiz.lessonId, lessonId))
		.limit(1);
	if (attempt) {
		throw new HTTPException(409, {
			message: "This lesson can't be deleted after a student has attempted its quiz",
		});
	}
}

async function assertNoAttemptsInSection(courseId: string, sectionId: string) {
	const [attempt] = await db
		.select({ id: quizAttempt.id })
		.from(quizAttempt)
		.innerJoin(quiz, eq(quizAttempt.quizId, quiz.id))
		.innerJoin(lesson, eq(quiz.lessonId, lesson.id))
		.innerJoin(section, eq(lesson.sectionId, section.id))
		.where(and(eq(section.courseId, courseId), eq(section.id, sectionId)))
		.limit(1);
	if (attempt) {
		throw new HTTPException(409, {
			message: "This section can't be deleted because a student has attempted one of its quizzes",
		});
	}
}

function createSlug(title: string) {
	const base = title
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	return `${base || "course"}-${nanoid(8)}`;
}

export const courseService = {
	listForInstructor(instructorId: string) {
		return db.query.course.findMany({
			where: { instructorId },
			orderBy: { updatedAt: "desc" },
			with: {
				category: { columns: { id: true, name: true, slug: true } },
				department: { columns: { id: true, name: true, code: true } },
			},
		});
	},

	async create(instructorId: string, input: CreateCourseInput) {
		for (let attempt = 0; attempt < 3; attempt++) {
			try {
				const [created] = await db
					.insert(course)
					.values({
						...input,
						instructorId,
						slug: createSlug(input.title),
						level: "major",
						gradeLevel: null,
						status: "draft",
						publishedAt: null,
					})
					.returning();

				return created;
			} catch (error) {
				if (!isUniqueViolation(error) || attempt === 2) throw error;
			}
		}

		throw new Error("Could not generate a unique course slug");
	},

	async getById(instructorId: string, courseId: string) {
		const found = await db.query.course.findFirst({
			where: { id: courseId, instructorId },
			with: {
				category: { columns: { id: true, name: true, slug: true } },
				department: { columns: { id: true, name: true, code: true } },
				sections: {
					orderBy: { position: "asc" },
					with: {
						lessons: {
							orderBy: { position: "asc" },
							with: {
								quizzes: {
									with: {
										questions: {
											orderBy: { position: "asc" },
											with: {
												options: { orderBy: { position: "asc" } },
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
		if (!found) throw new HTTPException(404, { message: "Course not found" });
		return found;
	},

	async createSection(
		instructorId: string,
		courseId: string,
		input: CreateSectionInput,
	) {
		await assertCourseOwner(instructorId, courseId);
		const [last] = await db
			.select({ position: section.position })
			.from(section)
			.where(eq(section.courseId, courseId))
			.orderBy(desc(section.position))
			.limit(1);
		const [created] = await db
			.insert(section)
			.values({
				courseId,
				title: input.title,
				position: (last?.position ?? 0) + 1,
			})
			.returning();
		return created;
	},

	async updateSection(
		instructorId: string,
		courseId: string,
		sectionId: string,
		input: UpdateSectionInput,
	) {
		await assertCourseOwner(instructorId, courseId);
		const [updated] = await db
			.update(section)
			.set(input)
			.where(and(eq(section.id, sectionId), eq(section.courseId, courseId)))
			.returning();
		if (!updated) throw new HTTPException(404, { message: "Section not found" });
		return updated;
	},

	async deleteSection(
		instructorId: string,
		courseId: string,
		sectionId: string,
	) {
		await assertCourseOwner(instructorId, courseId);
		await assertNoAttemptsInSection(courseId, sectionId);
		const [deleted] = await db
			.delete(section)
			.where(and(eq(section.id, sectionId), eq(section.courseId, courseId)))
			.returning({ id: section.id });
		if (!deleted) throw new HTTPException(404, { message: "Section not found" });
	},

	async createLesson(
		instructorId: string,
		courseId: string,
		sectionId: string,
		input: CreateLessonInput,
	) {
		await assertCourseOwner(instructorId, courseId);
		const parentSection = await db.query.section.findFirst({
			where: { id: sectionId, courseId },
			columns: { id: true },
		});
		if (!parentSection) {
			throw new HTTPException(404, { message: "Section not found" });
		}

		const [last] = await db
			.select({ position: lesson.position })
			.from(lesson)
			.where(eq(lesson.sectionId, sectionId))
			.orderBy(desc(lesson.position))
			.limit(1);

		return db.transaction(async (tx) => {
			const [created] = await tx
				.insert(lesson)
				.values({
					...input,
					sectionId,
					position: (last?.position ?? 0) + 1,
				})
				.returning();
			if (created.type === "quiz") {
				await tx.insert(quiz).values({
					lessonId: created.id,
					title: created.title,
				});
			}
			return created;
		});
	},

	async updateLesson(
		instructorId: string,
		courseId: string,
		lessonId: string,
		input: UpdateLessonInput,
	) {
		await getOwnedLesson(instructorId, courseId, lessonId);
		const [updated] = await db
			.update(lesson)
			.set(input)
			.where(eq(lesson.id, lessonId))
			.returning();
		if (!updated) throw new HTTPException(404, { message: "Lesson not found" });
		return updated;
	},

	async deleteLesson(
		instructorId: string,
		courseId: string,
		lessonId: string,
	) {
		await getOwnedLesson(instructorId, courseId, lessonId);
		await assertNoAttemptsInLesson(lessonId);
		await db.delete(lesson).where(eq(lesson.id, lessonId));
	},

	async saveQuiz(
		instructorId: string,
		courseId: string,
		lessonId: string,
		input: SaveQuizInput,
	) {
		const ownedLesson = await getOwnedLesson(instructorId, courseId, lessonId);
		if (ownedLesson.type !== "quiz") {
			throw new HTTPException(400, {
				message: "Quiz content can only be saved to a quiz lesson",
			});
		}

		return db.transaction(async (tx) => {
			const [existingQuiz] = await tx
				.select({ id: quiz.id })
				.from(quiz)
				.where(eq(quiz.lessonId, lessonId))
				.limit(1);

			if (existingQuiz) {
				const [attempt] = await tx
					.select({ id: quizAttempt.id })
					.from(quizAttempt)
					.where(eq(quizAttempt.quizId, existingQuiz.id))
					.limit(1);
				if (attempt) {
					throw new HTTPException(409, {
						message: "This quiz can't be edited after a student has attempted it",
					});
				}
			}

			const [savedQuiz] = existingQuiz
				? await tx
						.update(quiz)
						.set({
							title: input.title,
							passingScore: input.passingScore,
							maxAttempts: input.maxAttempts,
							timeLimitMinutes: input.timeLimitMinutes,
						})
						.where(eq(quiz.id, existingQuiz.id))
						.returning()
				: await tx
						.insert(quiz)
						.values({
							lessonId,
							title: input.title,
							passingScore: input.passingScore,
							maxAttempts: input.maxAttempts,
							timeLimitMinutes: input.timeLimitMinutes,
						})
						.returning();

			await tx.delete(question).where(eq(question.quizId, savedQuiz.id));
			for (const [questionIndex, item] of input.questions.entries()) {
				const [savedQuestion] = await tx
					.insert(question)
					.values({
						quizId: savedQuiz.id,
						type: item.type,
						prompt: item.prompt,
						points: item.points,
						position: questionIndex + 1,
					})
					.returning();
				await tx.insert(questionOption).values(
					item.options.map((option, optionIndex) => ({
						questionId: savedQuestion.id,
						text: option.text,
						isCorrect: option.isCorrect,
						position: optionIndex + 1,
					})),
				);
			}

			return savedQuiz;
		});
	},
};
