import { hashPassword } from "better-auth/crypto";
import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./index";
import { account, user } from "./schema";

async function resetDatabase() {
	console.log("🧹 Resetting database...");

	await db.execute(sql`
    TRUNCATE TABLE 
      "submission",
      "assignment",
      "quiz_attempt",
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

		const usersToSeed = [
			{
				name: "System Administrator",
				email: "admin@example.com",
				role: "admin" as const,
			},
			{
				name: "Teacher Angel",
				email: "teacher@example.com",
				role: "teacher" as const,
			},
			{
				name: "Student Aeron",
				email: "student@example.com",
				role: "student" as const,
			},
		];

		console.log("👥 Seeding 3 users (admin, teacher, student)...");

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

		console.log("🎉 Seeding complete. Password for all users: test123");
	} catch (error) {
		console.error("❌ Seeding failed:", error);
		process.exit(1);
	} finally {
		process.exit(0);
	}
}

seed();
