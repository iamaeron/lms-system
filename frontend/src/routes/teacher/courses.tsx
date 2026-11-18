import {
	BookIcon,
	ClipboardListIcon,
	PlayCircleIcon,
} from "@solar-icons/react/bold";
import {
	AddIcon,
	AltArrowDownIcon,
	MagnifierIcon,
	SquareAcademicCapIcon,
} from "@solar-icons/react/linear";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cn } from "cn";
import { useState } from "react";
import { Link } from "react-router";
import CreateCourseModal from "@/components/teacher/create-course-modal";
import { paths } from "@/config/paths";
import { courseQueries } from "@/features/course/queries";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
	Select,
	SelectItem,
	SelectItemIndicator,
	SelectItemText,
	SelectList,
	SelectPopup,
	SelectPortal,
	SelectPositioner,
	SelectTrigger,
	SelectValue,
} from "@/ui/select";

const libraryFilters = [
	{ label: "All courses", value: "all" },
	{ label: "Published", value: "published" },
	{ label: "Drafts", value: "draft" },
	{ label: "Archived", value: "archived" },
];

export default function TeacherCourses() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");
	const { data: response } = useSuspenseQuery(courseQueries.list());
	const courses = response.data;
	const filteredCourses = courses.filter((course) => {
		const matchesSearch = `${course.title} ${course.summary ?? ""}`
			.toLowerCase()
			.includes(search.toLowerCase());
		return matchesSearch && (status === "all" || course.status === status);
	});
	const stats = [
		{ label: "Courses", value: courses.length, icon: BookIcon },
		{
			label: "Drafts",
			value: courses.filter((course) => course.status === "draft").length,
			icon: PlayCircleIcon,
		},
		{
			label: "Published",
			value: courses.filter((course) => course.status === "published").length,
			icon: ClipboardListIcon,
		},
	];

	return (
		<div className="space-y-6 pb-8">
			<section className="relative isolate overflow-hidden rounded-lg border-3 border-zinc-900 bg-green-800 px-6 py-7 text-white shadow-[inset_0_1px_0_0_var(--color-green-700),inset_0_-3px_0_0_var(--color-green-900)] sm:px-8 sm:py-9">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-0 opacity-50"
					style={{
						backgroundImage:
							"repeating-linear-gradient(180deg, transparent 0px, transparent 27px, rgb(220 252 231 / 0.13) 28px, transparent 29px)",
					}}
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -top-36 left-6 z-0 size-64 rounded-full bg-emerald-400/20 blur-3xl"
				/>
				<svg
					aria-hidden="true"
					viewBox="0 0 250 190"
					fill="none"
					className="pointer-events-none absolute right-40 top-0 z-0 hidden h-full max-h-48 w-64 text-emerald-50/40 md:block"
					stroke="currentColor"
					strokeWidth="2.2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M60 65c18-8 36-8 54 1v66c-18-9-36-9-54-1V65Z" />
					<path d="M114 66c18-9 36-9 54-1v66c-18-8-36-8-54 1V66Z" />
					<path d="M72 80c10-3 21-3 31 1M72 92c10-3 21-3 31 1M125 81c10-4 21-4 31-1M125 93c10-4 21-4 31-1" />
					<path d="m188 41 8 16 17 2-12 12 3 17-16-8-15 8 3-17-12-12 17-2 7-16Z" />
					<path d="m193 122 38-44 11 10-38 44-16 7 5-17Z" />
					<path d="m225 85 11 10M45 111l-9 5m17 25-9 10m159-90 5-12" />
				</svg>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 right-0 z-1 w-3/5 bg-linear-to-l from-green-800 via-green-800/95 to-transparent"
				/>
				<div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
					<div className="max-w-2xl">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-zinc-200">
							<BookIcon size={15} /> Reusable teaching content
						</div>
						<h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
							Course Library
						</h2>
						<p className="mt-2 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
							Build courses from organized sections, lessons, and quizzes, then
							share them with your classrooms when they’re ready.
						</p>
					</div>
					<CreateCourseModal />
				</div>
			</section>

			<section
				aria-label="Library overview"
				className="grid gap-3 sm:grid-cols-3"
			>
				{stats.map(({ label, value, icon: Icon }) => (
					<div
						key={label}
						className="rounded-xl bg-zinc-100 p-2 shadow-sm shadow-zinc-900/3"
					>
						<div className="flex pb-1 gap-1 items-center">
							<div
								className={cn(
									"flex size-6 items-center justify-center rounded-xl text-zinc-500",
								)}
							>
								<Icon size={20} />
							</div>
							<p className="text-sm font-medium text-zinc-500">{label}</p>
						</div>
						<div className="bg-white p-2 rounded-lg">
							<p className="text-3xl font-semibold leading-none text-zinc-700">
								{value}
							</p>
						</div>
					</div>
				))}
			</section>

			<section className="space-y-4">
				<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
					<div>
						<h3 className="text-lg font-semibold tracking-tight text-zinc-800">
							Your courses
						</h3>
						<p className="mt-1 text-sm text-zinc-500">
							Manage the content you’ve created for your classes.
						</p>
					</div>
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							wrapperClassName="sm:w-64"
							placeholder="Search courses"
							aria-label="Search courses"
							leftSection={<MagnifierIcon size={16} />}
							clearable
							onClear={() => setSearch("")}
						/>
						<Select
							value={status}
							onValueChange={(value) => setStatus(value ?? "all")}
							items={libraryFilters}
						>
							<SelectTrigger className="min-w-36">
								<SelectValue />
								<AltArrowDownIcon size={16} />
							</SelectTrigger>
							<SelectPortal>
								<SelectPositioner align="end">
									<SelectPopup>
										<SelectList>
											{libraryFilters.map((filter) => (
												<SelectItem key={filter.value} value={filter.value}>
													<SelectItemText>{filter.label}</SelectItemText>
													<SelectItemIndicator>✓</SelectItemIndicator>
												</SelectItem>
											))}
										</SelectList>
									</SelectPopup>
								</SelectPositioner>
							</SelectPortal>
						</Select>
					</div>
				</div>

				{filteredCourses.length === 0 ? (
					<div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm shadow-zinc-900/3 sm:p-10">
						<div className="mx-auto flex max-w-lg flex-col items-center py-7 text-center">
							<div className="relative mb-5 flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
								<SquareAcademicCapIcon size={30} />
								<span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-white text-blue-600 shadow-sm">
									<AddIcon size={13} />
								</span>
							</div>
							<h4 className="text-lg font-semibold text-zinc-800">
								{search || status !== "all"
									? "No matching courses"
									: "Your library is ready for its first course"}
							</h4>
							<p className="mt-2 text-sm leading-6 text-zinc-500">
								{search || status !== "all"
									? "Try a different search or status filter."
									: "Create a reusable course, arrange it into sections, and add lessons or quizzes. You can attach the content to a classroom later."}
							</p>
							{(search || status !== "all") && (
								<Button
									variant="flat"
									className="mt-5"
									onClick={() => {
										setSearch("");
										setStatus("all");
									}}
								>
									Clear filters
								</Button>
							)}
						</div>
					</div>
				) : (
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
						{filteredCourses.map((course) => (
							<Link
								key={course.id}
								to={paths.portal.teacher.course.getHref(course.id)}
								className="block pt-2 group"
							>
								<div className="group group-hover:rotate-3 relative h-[168px] w-34 transition-transform group-hover:-translate-y-1">
									<div
										aria-hidden="true"
										className="absolute inset-x-1 bottom-0.5 h-2 rounded-b-sm border-x border-b border-zinc-300 bg-[repeating-linear-gradient(to_bottom,#f4f4f5_0px,#f4f4f5_1px,#d4d4d8_1px,#d4d4d8_2px)] shadow-[0_5px_8px_-5px_var(--color-zinc-500)]"
									/>
									<div className="absolute inset-x-0 top-0 h-40 overflow-hidden rounded-r-md rounded-l-[3px] border-2 border-white/15 bg-blue-950 shadow-[inset_0_5px_0_0_white]">
										{course.thumbnailUrl ? (
											<img
												src={course.thumbnailUrl}
												alt=""
												className="absolute inset-0 size-full object-cover"
											/>
										) : (
											<div className="absolute inset-0 overflow-hidden bg-linear-to-br from-indigo-700 via-blue-800 to-purple-800 p-3 text-white">
												<div
													aria-hidden="true"
													className="absolute inset-2 border border-white/25"
												/>
												<div
													aria-hidden="true"
													className="absolute -right-8 -top-8 size-28 rounded-full border-[18px] border-white/5"
												/>
												<div className="relative flex h-full flex-col items-center justify-center text-center">
													<BookIcon className="mb-3 text-white/75" size={23} />
													<p className="line-clamp-4 text-sm leading-snug tracking-wide">
														{course.title}
													</p>
													{/* <span className="mt-3 h-0.5 w-8 bg-white/80" /> */}
												</div>
											</div>
										)}
										<div
											aria-hidden="true"
											className="absolute inset-y-0 left-0 w-2 border-r border-white/15 bg-black/15 shadow-[inset_-2px_0_3px_rgb(0_0_0/0.15)]"
										/>
									</div>
								</div>
								<div className="space-y-2 pt-4">
									<div className="flex items-start justify-between gap-3">
										<h4 className="font-medium text-zinc-800">
											{course.title}
										</h4>
										{/* <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs capitalize text-zinc-600">
											{course.status}
										</span> */}
									</div>
									<p className="line-clamp-2 min-h-10 text-sm text-zinc-500">
										{course.summary || "No summary yet."}
									</p>
									<p className="text-xs text-zinc-500">
										{course.department?.code ?? "No department"}
									</p>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>

			<section className="grid gap-3 rounded-xl bg-blue-50 p-4 sm:grid-cols-[auto_1fr] sm:items-center sm:p-5">
				<div className="flex size-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
					<SquareAcademicCapIcon size={20} />
				</div>
				<div>
					<p className="text-sm font-medium text-blue-700">
						Keep reusable content separate from classwork
					</p>
					<p className="mt-1 text-sm leading-5 text-blue-700">
						Use this library to prepare courses and lessons. Post assignments,
						due dates, and announcements inside the classroom they belong to.
					</p>
				</div>
			</section>
		</div>
	);
}
