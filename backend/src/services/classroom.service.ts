import type {
	AddCourseToClassworkInput,
	CreateClassroomInput,
	UpdateClassroomInput,
} from "@shared/schema/classroom.schema";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db } from "@/db";
import {
	classroom,
	classroomMember,
	generateJoinCode,
	post,
	postAttachment,
} from "@/db/schema";
import type { Membership } from "@/lib/env";
import { isUniqueViolation } from "@/lib/errors";

type Role = Membership["role"];
type Classroom = typeof classroom.$inferSelect;

const ownerColumns = { id: true, name: true, image: true } as const;

// Only teachers should see the join code and join toggle
function serialize<T extends Classroom>(room: T, role: Role) {
	if (role === "teacher") return room;
	const { joinCode: _code, joinEnabled: _enabled, ...rest } = room;
	return rest;
}

export const classroomService = {
	async listForUser(userId: string, includeArchived = false) {
		const rows = await db.query.classroomMember.findMany({
			where: { userId },
			orderBy: { joinedAt: "desc" },
			with: {
				classroom: {
					with: {
						owner: { columns: ownerColumns },
						members: {
							where: { role: "student" },
							orderBy: { joinedAt: "asc" },
							limit: 3,
							columns: {},
							with: { user: { columns: ownerColumns } },
						},
						department: true,
					},
					extras: {
						memberCount: (table, { sql }) =>
							sql<number>`(
            select count(*)::int
            from ${classroomMember}
            where ${classroomMember.classroomId} = ${table.id}
			and ${classroomMember.role} = 'student'
          )`.mapWith(Number),
					},
				},
			},
		});

		return rows.flatMap((row) =>
			row.classroom && (includeArchived || !row.classroom.archivedAt)
				? [
						{
							role: row.role,
							joinedAt: row.joinedAt,
							classroom: serialize(row.classroom, row.role),
						},
					]
				: [],
		);
	},

	// Creates the classroom and the owner's teacher membership together
	async create(ownerId: string, input: CreateClassroomInput) {
		for (let attempt = 0; attempt < 3; attempt++) {
			try {
				return await db.transaction(async (tx) => {
					const [room] = await tx
						.insert(classroom)
						.values({ ...input, ownerId })
						.returning();

					await tx.insert(classroomMember).values({
						classroomId: room.id,
						userId: ownerId,
						role: "teacher",
					});

					return room;
				});
			} catch (error) {
				// join_code is the only unique column besides the id: retry
				if (!isUniqueViolation(error) || attempt === 2) throw error;
			}
		}
		throw new Error("Could not generate a unique join code");
	},

	async listCourseClasswork(classroomId: string) {
		const posts = await db.query.post.findMany({
			where: { classroomId, type: "material" },
			orderBy: { createdAt: "desc" },
			with: {
				attachments: {
					where: { kind: "course" },
					orderBy: { position: "asc" },
					with: {
						course: {
							columns: {
								id: true,
								title: true,
								summary: true,
								thumbnailUrl: true,
							},
							with: {
								sections: {
									columns: { id: true },
									with: { lessons: { columns: { id: true } } },
								},
							},
						},
					},
				},
			},
		});

		return posts.flatMap((classworkPost) =>
			classworkPost.attachments.flatMap((attachment) => {
				if (!attachment.course) return [];
				return [
					{
						postId: classworkPost.id,
						createdAt: classworkPost.createdAt,
						course: {
							id: attachment.course.id,
							title: attachment.course.title,
							summary: attachment.course.summary,
							thumbnailUrl: attachment.course.thumbnailUrl,
							sectionCount: attachment.course.sections.length,
							lessonCount: attachment.course.sections.reduce(
								(total, courseSection) => total + courseSection.lessons.length,
								0,
							),
						},
					},
				];
			}),
		);
	},

	async addCourseToClasswork(
		classroomId: string,
		authorId: string,
		input: AddCourseToClassworkInput,
	) {
		const courseToAdd = await db.query.course.findFirst({
			where: { id: input.courseId, instructorId: authorId },
			columns: { id: true, title: true },
		});
		if (!courseToAdd) {
			throw new HTTPException(404, { message: "Course not found" });
		}

		const [existing] = await db
			.select({ id: post.id })
			.from(postAttachment)
			.innerJoin(post, eq(postAttachment.postId, post.id))
			.where(
				and(
					eq(post.classroomId, classroomId),
					eq(post.type, "material"),
					eq(postAttachment.kind, "course"),
					eq(postAttachment.courseId, courseToAdd.id),
				),
			)
			.limit(1);
		if (existing) {
			throw new HTTPException(409, {
				message: "This course is already in the classroom classwork",
			});
		}

		const created = await db.transaction(async (tx) => {
			const [classworkPost] = await tx
				.insert(post)
				.values({
					classroomId,
					authorId,
					type: "material",
					title: courseToAdd.title,
					status: "published",
					publishedAt: new Date(),
				})
				.returning();
			await tx.insert(postAttachment).values({
				postId: classworkPost.id,
				kind: "course",
				courseId: courseToAdd.id,
			});
			return classworkPost;
		});

		return created;
	},

	async getById(classroomId: string, role: Role) {
		const room = await db.query.classroom.findFirst({
			where: { id: classroomId },
			with: {
				owner: { columns: ownerColumns },
				members: {
					where: { role: "student" },
					orderBy: { joinedAt: "asc" },
					limit: 3,
					columns: {},
					with: { user: { columns: ownerColumns } },
				},
				department: true,
			},
			extras: {
				memberCount: (table, { sql }) =>
					sql<number>`(
            select count(*)::int
            from ${classroomMember}
            where ${classroomMember.classroomId} = ${table.id}
			and ${classroomMember.role} = 'student'
          )`.mapWith(Number),
			},
		});
		if (!room) throw new HTTPException(404, { message: "Classroom not found" });
		return serialize(room, role);
	},

	async update(classroomId: string, input: UpdateClassroomInput) {
		const { archived, ...fields } = input;

		const [room] = await db
			.update(classroom)
			.set({
				...fields,
				...(archived === undefined
					? {}
					: { archivedAt: archived ? new Date() : null }),
			})
			.where(eq(classroom.id, classroomId))
			.returning();

		if (!room) throw new HTTPException(404, { message: "Classroom not found" });
		return room;
	},

	async regenerateJoinCode(classroomId: string) {
		const [room] = await db
			.update(classroom)
			.set({ joinCode: generateJoinCode() })
			.where(eq(classroom.id, classroomId))
			.returning();

		if (!room) throw new HTTPException(404, { message: "Classroom not found" });
		return room;
	},

	// Joins as a student. Joining twice is a no-op.
	async join(userId: string, code: string) {
		const room = await db.query.classroom.findFirst({
			where: { joinCode: code },
		});

		if (!room || room.archivedAt) {
			throw new HTTPException(404, { message: "Invalid class code" });
		}
		if (!room.joinEnabled) {
			throw new HTTPException(403, {
				message: "Joining is turned off for this class",
			});
		}

		await db
			.insert(classroomMember)
			.values({ classroomId: room.id, userId })
			.onConflictDoNothing();

		return serialize(room, "student");
	},

	listMembers(classroomId: string) {
		return db.query.classroomMember.findMany({
			where: { classroomId },
			orderBy: { joinedAt: "asc" },
			with: { user: { columns: ownerColumns } },
		});
	},

	// Used for both "teacher removes a student" and "member leaves"
	async removeMember(classroomId: string, userId: string) {
		const room = await db.query.classroom.findFirst({
			where: { id: classroomId },
			columns: { ownerId: true },
		});
		if (!room) throw new HTTPException(404, { message: "Classroom not found" });
		if (room.ownerId === userId) {
			throw new HTTPException(400, {
				message: "The owner can't be removed from their own classroom",
			});
		}

		const removed = await db
			.delete(classroomMember)
			.where(
				and(
					eq(classroomMember.classroomId, classroomId),
					eq(classroomMember.userId, userId),
				),
			)
			.returning({ id: classroomMember.id });

		if (removed.length === 0) {
			throw new HTTPException(404, { message: "Member not found" });
		}
	},
};
