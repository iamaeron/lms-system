import { hashPassword } from "better-auth/crypto";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./index";
import {
	account,
	category,
	classroom,
	classroomMember,
	course,
	department,
	lesson,
	lessonProgress,
	post,
	postAttachment,
	postComment,
	question,
	questionOption,
	quiz,
	section,
	submission,
	topic,
	user,
} from "./schema";

const DAY = 24 * 60 * 60 * 1000;

// Systems Plus College Foundation (Balibago, Angeles City)
// Source: spcf.edu.ph/academics. "College of Education" has no page of its own
// on the site; its programs (BEEd, BSEd) are listed under CASS.
const colleges = [
	{
		code: "CASS",
		name: "College of Arts and Social Sciences and Education",
		programs: [
			{ slug: "bee", title: "Bachelor of Elementary Education" },
			{ slug: "bse", title: "Bachelor of Secondary Education" },
			{ slug: "abcom", title: "Bachelor of Arts in Communication" },
			{ slug: "bssw", title: "Bachelor of Science in Social Work" },
		],
	},
	{
		code: "COB",
		name: "College of Business",
		programs: [
			{ slug: "bsa", title: "Bachelor of Science in Accountancy" },
			{
				slug: "bsba",
				title: "Bachelor of Science in Business Administration",
			},
			{
				slug: "bsca",
				title: "Bachelor of Science in Customs Administration",
			},
			{
				slug: "bsrem",
				title: "Bachelor of Science in Real Estate Management",
			},
		],
	},
	{
		code: "CCIS",
		name: "College of Computing and Information Sciences",
		programs: [
			{ slug: "bscs", title: "Bachelor of Science in Computer Science" },
			{ slug: "bsit", title: "Bachelor of Science in Information Technology" },
			{ slug: "bsis", title: "Bachelor of Science in Information Systems" },
			{
				slug: "bsemc",
				title: "Bachelor of Science in Entertainment and Multimedia Computing",
			},
		],
	},
	{
		code: "COC",
		name: "College of Criminology",
		programs: [{ slug: "bsc", title: "Bachelor of Science in Criminology" }],
	},
	{
		code: "COE",
		name: "College of Engineering",
		programs: [
			{ slug: "bscpe", title: "Bachelor of Science in Computer Engineering" },
			{
				slug: "bsece",
				title:
					"Bachelor of Science in Electronics and Communications Engineering",
			},
		],
	},
	{
		code: "CHM",
		name: "College of Hospitality Management",
		programs: [
			{ slug: "bstm", title: "Bachelor of Science in Tourism" },
			{ slug: "bshm", title: "Bachelor of Science in Hospitality Management" },
		],
	},
	{
		code: "CON",
		name: "College of Nursing",
		programs: [{ slug: "bsn", title: "Bachelor of Science in Nursing" }],
	},
];

async function resetDatabase() {
	console.log("🧹 Resetting database...");

	await db.execute(sql`
    TRUNCATE TABLE
      "post_comment",
      "post_attachment",
      "submission",
      "quiz_attempt",
      "post",
      "topic",
      "question_option",
      "question",
      "quiz",
      "lesson_progress",
      "classroom_member",
      "classroom",
      "review",
      "lesson",
      "section",
      "course",
      "department",
      "category",
      "verification",
      "account",
      "session",
      "user"
    RESTART IDENTITY CASCADE;
  `);

	console.log("✨ Database cleared!");
}

async function seed() {
	await resetDatabase();

	console.log("🌱 Starting database seed...");

	try {
		const hashedPassword = await hashPassword("test123");

		// ---------- users ----------
		const usersToSeed = [
			{
				name: "System Administrator",
				email: "admin@example.com",
				role: "admin" as const,
			},
			{
				name: "Angel Calventos",
				email: "teacher@example.com",
				role: "teacher" as const,
			},
			{
				name: "Aeron Sencil",
				email: "student@example.com",
				role: "student" as const,
			},
		];

		console.log("👥 Seeding 3 users (admin, teacher, student)...");

		const users: Record<string, typeof user.$inferSelect> = {};

		for (const item of usersToSeed) {
			const [createdUser] = await db
				.insert(user)
				.values({
					id: nanoid(),
					name: item.name,
					email: item.email,
					emailVerified: true,
					role: item.role,
				})
				.onConflictDoNothing()
				.returning();

			if (!createdUser) {
				throw new Error(`Failed to create ${item.role} user for seeding.`);
			}

			users[item.role] = createdUser;
			console.log(`✅ ${item.role} created: ${createdUser.email}`);

			await db
				.insert(account)
				.values({
					id: nanoid(),
					accountId: createdUser.id,
					providerId: "credential",
					userId: createdUser.id,
					password: hashedPassword,
				})
				.onConflictDoNothing();
		}

		const teacher = users.teacher;
		const student = users.student;

		// ---------- category ----------
		const [degreeCategory] = await db
			.insert(category)
			.values({ name: "Degree Programs", slug: "degree-programs" })
			.returning();

		// ---------- departments + courses ----------
		console.log("🏫 Seeding SPCF colleges and degree programs...");

		const courseIdBySlug: Record<string, string> = {};
		const now = new Date();

		for (const college of colleges) {
			const [dept] = await db
				.insert(department)
				.values({ name: college.name, code: college.code })
				.returning();

			for (const program of college.programs) {
				const [created] = await db
					.insert(course)
					.values({
						title: program.title,
						slug: program.slug,
						summary: `${program.title} offered by the ${college.name}.`,
						level: "major",
						status: "published",
						publishedAt: now,
						instructorId: teacher.id,
						departmentId: dept.id,
						categoryId: degreeCategory.id,
					})
					.returning();

				courseIdBySlug[program.slug] = created.id;
			}

			console.log(
				`✅ ${college.code}: ${college.programs.length} program(s) created`,
			);
		}

		// ---------- sample course content (BSIT) ----------
		// Placeholder content for demo purposes, not the official curriculum.
		console.log("📚 Seeding sample content for BSIT...");

		const bsitId = courseIdBySlug.bsit;

		const [module1] = await db
			.insert(section)
			.values({
				courseId: bsitId,
				title: "Module 1: Introduction to Computing",
				position: 1,
			})
			.returning();

		const [lessonWhatIsIt, _lessonHardware, lessonQuiz] = await db
			.insert(lesson)
			.values([
				{
					sectionId: module1.id,
					title: "What is Information Technology?",
					type: "text",
					content:
						"# What is Information Technology?\n\nInformation Technology (IT) is the use of computers, networks and software to store, process and share information.",
					position: 1,
					isPreview: true,
				},
				{
					sectionId: module1.id,
					title: "Parts of a Computer",
					type: "text",
					content:
						"# Parts of a Computer\n\nA computer is made of input devices, a processor, memory, storage and output devices.",
					position: 2,
				},
				{
					sectionId: module1.id,
					title: "Module 1 Quiz",
					type: "quiz",
					position: 3,
				},
			])
			.returning();

		const [moduleQuiz] = await db
			.insert(quiz)
			.values({
				lessonId: lessonQuiz.id,
				title: "Module 1 Quiz",
				passingScore: 70,
				maxAttempts: 3,
			})
			.returning();

		const quizQuestions = [
			{
				prompt: 'Which part of the computer is considered its "brain"?',
				options: [
					{ text: "Monitor", isCorrect: false },
					{ text: "CPU", isCorrect: true },
					{ text: "Keyboard", isCorrect: false },
					{ text: "Speaker", isCorrect: false },
				],
			},
			{
				prompt: "Which of the following is an input device?",
				options: [
					{ text: "Printer", isCorrect: false },
					{ text: "Monitor", isCorrect: false },
					{ text: "Mouse", isCorrect: true },
					{ text: "Projector", isCorrect: false },
				],
			},
		];

		for (const [qIndex, q] of quizQuestions.entries()) {
			const [createdQuestion] = await db
				.insert(question)
				.values({
					quizId: moduleQuiz.id,
					type: "single_choice",
					prompt: q.prompt,
					points: 1,
					position: qIndex + 1,
				})
				.returning();

			await db.insert(questionOption).values(
				q.options.map((option, oIndex) => ({
					questionId: createdQuestion.id,
					text: option.text,
					isCorrect: option.isCorrect,
					position: oIndex + 1,
				})),
			);
		}

		// ---------- sample classroom ----------
		console.log("🎓 Seeding sample classroom...");

		const [room] = await db
			.insert(classroom)
			.values({
				ownerId: teacher.id,
				name: "Introduction to Computing",
				section: "BSIT 1-A",
				subject: "Information Technology",
			})
			.returning();

		// owner is not added automatically, so add the teacher row here
		await db.insert(classroomMember).values([
			{ classroomId: room.id, userId: teacher.id, role: "teacher" },
			{ classroomId: room.id, userId: student.id, role: "student" },
		]);

		const [week1] = await db
			.insert(topic)
			.values({ classroomId: room.id, name: "Module 1", position: 1 })
			.returning();

		const [welcome, material, assignmentPost] = await db
			.insert(post)
			.values([
				{
					classroomId: room.id,
					authorId: teacher.id,
					type: "announcement",
					body: "Welcome to BSIT 1-A! Check the Classwork tab for this week's materials.",
					status: "published",
					publishedAt: now,
				},
				{
					classroomId: room.id,
					authorId: teacher.id,
					topicId: week1.id,
					type: "material",
					title: "Module 1 Reading",
					body: "Read the lesson before our next meeting.",
					status: "published",
					publishedAt: now,
				},
				{
					classroomId: room.id,
					authorId: teacher.id,
					topicId: week1.id,
					type: "assignment",
					title: "Activity 1: Parts of a Computer",
					body: "List the main parts of a computer and describe what each one does.",
					status: "published",
					publishedAt: now,
					dueAt: new Date(now.getTime() + 7 * DAY),
					maxPoints: 20,
				},
			])
			.returning();

		await db.insert(post).values({
			classroomId: room.id,
			authorId: teacher.id,
			topicId: week1.id,
			type: "quiz",
			title: "Module 1 Quiz",
			status: "published",
			publishedAt: now,
			dueAt: new Date(now.getTime() + 10 * DAY),
			maxPoints: 100,
			quizId: moduleQuiz.id,
		});

		// the material post shares the whole BSIT course plus one lesson
		await db.insert(postAttachment).values([
			{
				postId: material.id,
				kind: "course",
				courseId: bsitId,
				position: 0,
			},
			{
				postId: material.id,
				kind: "lesson",
				lessonId: lessonWhatIsIt.id,
				position: 1,
			},
		]);

		await db.insert(postComment).values({
			postId: welcome.id,
			authorId: student.id,
			body: "Thank you, ma'am!",
		});

		await db.insert(submission).values({
			postId: assignmentPost.id,
			userId: student.id,
			content:
				"CPU, memory, storage, input devices and output devices. The CPU processes instructions.",
			status: "submitted",
		});

		await db.insert(lessonProgress).values({
			classroomId: room.id,
			userId: student.id,
			lessonId: lessonWhatIsIt.id,
			completedAt: now,
		});

		console.log(`✅ Classroom created. Join code: ${room.joinCode}`);
		console.log("🎉 Seeding complete. Password for all users: test123");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}

seed();
