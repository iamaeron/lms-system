export const paths = {
  login: { path: "/login", getHref: () => "/login" },
  portal: {
    root: { path: "/portal", getHref: () => "/portal" },
    student: {
      root: { path: "student", getHref: () => "/portal/student" },
      courses: { path: "courses", getHref: () => "/portal/student/courses" },
      grades: { path: "grades", getHref: () => "/portal/student/grades" },
    },
    teacher: {
      root: { path: "teacher", getHref: () => "/portal/teacher" },
      assignments: {
        path: "assignments",
        getHref: () => "/portal/teacher/assignments",
      },
      classrooms: {
        path: "classrooms",
        getHref: () => "/portal/teacher/classrooms",
      },
      quizzes: { path: "quizzes", getHref: () => "/portal/teacher/quizzes" },
      gradebook: {
        path: "gradebook",
        getHref: () => "/portal/teacher/gradebook",
      },
    },
  },
} as const;
