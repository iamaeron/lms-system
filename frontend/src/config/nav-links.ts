import {
	BookIcon as BookIconBold,
	BuildingsIcon as BuildingsIconBold,
	ClipboardCheckIcon as ClipboardCheckIconBold,
	ClipboardListIcon as ClipboardListIconBold,
	HomeSmileIcon as HomeSmileIconBold,
	MedalRibbonIcon as MedalRibbonIconBold,
	SquareAcademicCapIcon as SquareAcademicCapIconBold,
	StarIcon as StarIconBold,
	TagIcon as TagIconBold,
	UserRoundedIcon as UserRoundedIconBold,
	Widget3Icon as Widget3IconBold,
} from "@solar-icons/react/bold";
import {
	BookIcon,
	BuildingsIcon,
	ClipboardCheckIcon,
	ClipboardListIcon,
	HomeSmileIcon,
	MedalRibbonIcon,
	SquareAcademicCapIcon,
	StarIcon,
	TagIcon,
	UserRoundedIcon,
	Widget3Icon,
} from "@solar-icons/react/bold-duotone";
import { paths } from "./paths";

export type UserRole = "student" | "teacher" | "admin";

const { student, teacher, admin } = paths.portal;

// ---------- STUDENT ----------
// Students reach courses, assignments and quizzes through their classrooms,
// so there is no "Browse Courses" / standalone Quizzes entry anymore.
const studentNavigation = [
	{
		group: "MAIN",
		items: [
			{
				label: "Dashboard",
				icon: Widget3Icon,
				activeIcon: Widget3IconBold,
				link: student.root.getHref(),
			},
			{
				label: "Classrooms",
				icon: SquareAcademicCapIcon,
				activeIcon: SquareAcademicCapIconBold,
				link: student.classrooms.getHref(), // includes "join with code"
			},
		],
	},
	{
		group: "WORK",
		items: [
			{
				label: "To-do",
				icon: ClipboardListIcon,
				activeIcon: ClipboardListIconBold,
				link: student.todo.getHref(), // assignments + quizzes due, all classes
			},
			{
				label: "Grades",
				icon: MedalRibbonIcon,
				activeIcon: MedalRibbonIconBold,
				link: student.grades.getHref(),
			},
		],
	},
	{
		group: "FEEDBACK",
		items: [
			{
				label: "My Reviews",
				icon: StarIcon,
				activeIcon: StarIconBold,
				link: student.reviews.getHref(),
			},
		],
	},
];

// ---------- TEACHER ----------
// Posting assignments, quizzes and materials happens inside a classroom
// (Stream / Classwork / People / Grades tabs), not from the sidebar.
const teacherNavigation = [
	{
		group: "MAIN",
		items: [
			{
				label: "Home",
				icon: HomeSmileIcon,
				activeIcon: HomeSmileIconBold,
				link: teacher.root.getHref(),
			},
			{
				label: "Classrooms",
				icon: SquareAcademicCapIcon,
				activeIcon: SquareAcademicCapIconBold,
				link: teacher.classrooms.getHref(), // create, join codes, archive
			},
		],
	},
	{
		group: "CONTENT",
		items: [
			{
				label: "Course Library",
				icon: BookIcon,
				activeIcon: BookIconBold,
				link: teacher.courses.getHref(), // sections, lessons and quizzes editor
			},
		],
	},
	{
		group: "REVIEW",
		items: [
			{
				label: "Grading",
				icon: ClipboardCheckIcon,
				activeIcon: ClipboardCheckIconBold,
				link: teacher.grading.getHref(), // submissions queue across classrooms
			},
			{
				label: "Reviews",
				icon: StarIcon,
				activeIcon: StarIconBold,
				link: teacher.reviews.getHref(),
			},
		],
	},
];

// ---------- ADMIN ----------
const adminNavigation = [
	{
		group: "MAIN",
		items: [
			{
				label: "Dashboard",
				icon: Widget3Icon,
				activeIcon: Widget3IconBold,
				link: admin.root.getHref(),
			},
			{
				label: "Users",
				icon: UserRoundedIcon,
				activeIcon: UserRoundedIconBold,
				link: admin.users.getHref(),
			},
		],
	},
	{
		group: "CATALOG",
		items: [
			{
				label: "Courses",
				icon: BookIcon,
				activeIcon: BookIconBold,
				link: admin.courses.getHref(),
			},
			{
				label: "Categories",
				icon: TagIcon,
				activeIcon: TagIconBold,
				link: admin.categories.getHref(),
			},
			{
				label: "Departments",
				icon: BuildingsIcon,
				activeIcon: BuildingsIconBold,
				link: admin.departments.getHref(),
			},
		],
	},
	{
		group: "ACTIVITY",
		items: [
			{
				label: "Classrooms",
				icon: SquareAcademicCapIcon,
				activeIcon: SquareAcademicCapIconBold,
				link: admin.classrooms.getHref(),
			},
			{
				label: "Reviews",
				icon: StarIcon,
				activeIcon: StarIconBold,
				link: admin.reviews.getHref(), // moderation
			},
		],
	},
];

export const sidebarNavigation: Record<UserRole, typeof studentNavigation> = {
	student: studentNavigation,
	teacher: teacherNavigation,
	admin: adminNavigation,
};
