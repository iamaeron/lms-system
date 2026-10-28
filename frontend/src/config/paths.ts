const portal = "/portal";

export const paths = {
	login: { path: "/login", getHref: () => "/login" },
	portal: {
		root: { path: "portal", getHref: () => portal },

		// ---------- STUDENT ----------
		student: {
			root: { path: "student", getHref: () => `${portal}/student` }, // dashboard
			classrooms: {
				path: "classrooms", // list + "join with code"
				getHref: () => `${portal}/student/classrooms`,
			},
			// Classroom tabs: stream (index), classwork, people
			classroom: {
				path: "classrooms/:classroomId",
				getHref: (classroomId: string) =>
					`${portal}/student/classrooms/${classroomId}`,
			},
			classwork: {
				path: "classrooms/:classroomId/classwork",
				getHref: (classroomId: string) =>
					`${portal}/student/classrooms/${classroomId}/classwork`,
			},
			people: {
				path: "classrooms/:classroomId/people",
				getHref: (classroomId: string) =>
					`${portal}/student/classrooms/${classroomId}/people`,
			},
			// A single assignment / quiz / material post
			post: {
				path: "classrooms/:classroomId/classwork/:postId",
				getHref: (classroomId: string, postId: string) =>
					`${portal}/student/classrooms/${classroomId}/classwork/${postId}`,
			},
			// Everything due across all classrooms
			todo: { path: "todo", getHref: () => `${portal}/student/todo` },
			grades: { path: "grades", getHref: () => `${portal}/student/grades` },
			reviews: { path: "reviews", getHref: () => `${portal}/student/reviews` },
		},

		// ---------- TEACHER ----------
		teacher: {
			root: { path: "teacher", getHref: () => `${portal}/teacher` }, // home
			classrooms: {
				path: "classrooms",
				getHref: () => `${portal}/teacher/classrooms`,
			},
			// Classroom tabs: stream (index), classwork, people, grades
			classroom: {
				path: "classrooms/:classroomId",
				getHref: (classroomId: string) =>
					`${portal}/teacher/classrooms/${classroomId}`,
			},
			classwork: {
				path: "classrooms/:classroomId/classwork",
				getHref: (classroomId: string) =>
					`${portal}/teacher/classrooms/${classroomId}/classwork`,
			},
			people: {
				path: "classrooms/:classroomId/people",
				getHref: (classroomId: string) =>
					`${portal}/teacher/classrooms/${classroomId}/people`,
			},
			grades: {
				path: "classrooms/:classroomId/grades",
				getHref: (classroomId: string) =>
					`${portal}/teacher/classrooms/${classroomId}/grades`,
			},
			// A single post: edit it and review its submissions
			post: {
				path: "classrooms/:classroomId/classwork/:postId",
				getHref: (classroomId: string, postId: string) =>
					`${portal}/teacher/classrooms/${classroomId}/classwork/${postId}`,
			},
			// Course library (sections + lessons + quizzes editor)
			courses: {
				path: "courses",
				getHref: () => `${portal}/teacher/courses`,
			},
			course: {
				path: "courses/:courseId",
				getHref: (courseId: string) => `${portal}/teacher/courses/${courseId}`,
			},
			// Submissions waiting to be graded, across all classrooms
			grading: {
				path: "grading",
				getHref: () => `${portal}/teacher/grading`,
			},
			reviews: {
				path: "reviews",
				getHref: () => `${portal}/teacher/reviews`,
			},
		},

		// ---------- ADMIN ----------
		admin: {
			root: { path: "admin", getHref: () => `${portal}/admin` }, // dashboard
			users: { path: "users", getHref: () => `${portal}/admin/users` },
			courses: { path: "courses", getHref: () => `${portal}/admin/courses` },
			categories: {
				path: "categories",
				getHref: () => `${portal}/admin/categories`,
			},
			departments: {
				path: "departments",
				getHref: () => `${portal}/admin/departments`,
			},
			classrooms: {
				path: "classrooms",
				getHref: () => `${portal}/admin/classrooms`,
			},
			reviews: { path: "reviews", getHref: () => `${portal}/admin/reviews` },
		},
	},
} as const;
