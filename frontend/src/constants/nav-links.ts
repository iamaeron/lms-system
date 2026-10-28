import {
  BookIcon as BookIconBold,
  BuildingsIcon as BuildingsIconBold,
  ClipboardCheckIcon as ClipboardCheckIconBold,
  ClipboardListIcon as ClipboardListIconBold,
  HomeSmileIcon as HomeSmileIconBold,
  MedalRibbonIcon as MedalRibbonIconBold,
  QuestionCircleIcon as QuestionCircleIconBold,
  SettingsMinimalisticIcon as SettingsMinimalisticIconBold,
  SquareAcademicCapIcon as SquareAcademicCapIconBold,
  StarIcon as StarIconBold,
  TagIcon as TagIconBold,
  UserRoundedIcon as UserRoundedIconBold,
  UsersGroupRoundedIcon as UsersGroupRoundedIconBold,
  Widget3Icon as Widget3IconBold,
} from "@solar-icons/react/bold";
import {
  BookIcon,
  BuildingsIcon,
  ClipboardCheckIcon,
  ClipboardListIcon,
  HomeSmileIcon,
  MedalRibbonIcon,
  QuestionCircleIcon,
  SettingsMinimalisticIcon,
  SquareAcademicCapIcon,
  StarIcon,
  TagIcon,
  UserRoundedIcon,
  UsersGroupRoundedIcon,
  Widget3Icon,
} from "@solar-icons/react/bold-duotone";

export type UserRole = "student" | "teacher" | "admin";

// ---------- STUDENT ----------
const studentNavigation = [
  {
    group: "MAIN",
    items: [
      {
        label: "Dashboard",
        icon: Widget3Icon,
        activeIcon: Widget3IconBold,
        link: "/student/dashboard",
      },
      {
        label: "My Classrooms",
        icon: SquareAcademicCapIcon,
        activeIcon: SquareAcademicCapIconBold,
        link: "/student/classrooms", // includes "join with code"
      },
      {
        label: "Browse Courses",
        icon: BookIcon,
        activeIcon: BookIconBold,
        link: "/student/courses",
      },
    ],
  },
  {
    group: "LEARNING",
    items: [
      {
        label: "Assignments",
        icon: ClipboardListIcon,
        activeIcon: ClipboardListIconBold,
        link: "/student/assignments",
      },
      {
        label: "Quizzes",
        icon: QuestionCircleIcon,
        activeIcon: QuestionCircleIconBold,
        link: "/student/quizzes",
      },
      {
        label: "Grades & Progress",
        icon: MedalRibbonIcon,
        activeIcon: MedalRibbonIconBold,
        link: "/student/grades",
      },
    ],
  },
  {
    group: "ACCOUNT",
    items: [
      {
        label: "My Reviews",
        icon: StarIcon,
        activeIcon: StarIconBold,
        link: "/student/reviews",
      },
      // {
      //   label: "Settings",
      //   icon: SettingsMinimalisticIcon,
      //   activeIcon: SettingsMinimalisticIconBold,
      //   link: "/student/settings",
      // },
    ],
  },
];

// ---------- TEACHER ----------
const teacherNavigation = [
  {
    group: "MAIN",
    items: [
      {
        label: "Home",
        icon: HomeSmileIcon,
        activeIcon: HomeSmileIconBold,
        link: "/teacher/",
      },
      {
        label: "My Courses",
        icon: BookIcon,
        activeIcon: BookIconBold,
        link: "/teacher/courses", // sections + lessons editor lives inside
      },
      {
        label: "Classrooms",
        icon: SquareAcademicCapIcon,
        activeIcon: SquareAcademicCapIconBold,
        link: "/teacher/classrooms", // join codes, members
      },
    ],
  },
  {
    group: "ASSESSMENTS",
    items: [
      {
        label: "Quizzes",
        icon: QuestionCircleIcon,
        activeIcon: QuestionCircleIconBold,
        link: "/teacher/quizzes",
      },
      {
        label: "Assignments",
        icon: ClipboardListIcon,
        activeIcon: ClipboardListIconBold,
        link: "/teacher/assignments",
      },
      {
        label: "Grading",
        icon: ClipboardCheckIcon,
        activeIcon: ClipboardCheckIconBold,
        link: "/teacher/grading", // submissions queue
      },
    ],
  },
  {
    group: "STUDENTS & FEEDBACK",
    items: [
      {
        label: "Students",
        icon: UsersGroupRoundedIcon,
        activeIcon: UsersGroupRoundedIconBold,
        link: "/teacher/students",
      },
      {
        label: "Reviews",
        icon: StarIcon,
        activeIcon: StarIconBold,
        link: "/teacher/reviews",
      },
    ],
  },
  // {
  //   group: "SETTINGS",
  //   items: [
  //     {
  //       label: "Settings",
  //       icon: SettingsMinimalisticIcon,
  //       activeIcon: SettingsMinimalisticIconBold,
  //       link: "/teacher/settings",
  //     },
  //   ],
  // },
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
        link: "/admin/dashboard",
      },
      {
        label: "Users",
        icon: UserRoundedIcon,
        activeIcon: UserRoundedIconBold,
        link: "/admin/users",
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
        link: "/admin/courses",
      },
      {
        label: "Categories",
        icon: TagIcon,
        activeIcon: TagIconBold,
        link: "/admin/categories",
      },
      {
        label: "Departments",
        icon: BuildingsIcon,
        activeIcon: BuildingsIconBold,
        link: "/admin/departments",
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
        link: "/admin/classrooms",
      },
      {
        label: "Reviews",
        icon: StarIcon,
        activeIcon: StarIconBold,
        link: "/admin/reviews", // moderation
      },
    ],
  },
  // {
  //   group: "SETTINGS",
  //   items: [
  //     {
  //       label: "Settings",
  //       icon: SettingsMinimalisticIcon,
  //       activeIcon: SettingsMinimalisticIconBold,
  //       link: "/admin/settings",
  //     },
  //   ],
  // },
];

export const sidebarNavigation: Record<UserRole, typeof studentNavigation> = {
  student: studentNavigation,
  teacher: teacherNavigation,
  admin: adminNavigation,
};
