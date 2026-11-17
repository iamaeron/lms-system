import { Tabs } from "@base-ui/react/tabs";
import { CheckCircleIcon, CopyIcon } from "@solar-icons/react/bold";
import type { Icon } from "@solar-icons/react/lib/types";
import {
	CalendarIcon,
	ClipboardListIcon,
	PeopleNearbyIcon,
	SquareAcademicCapIcon,
} from "@solar-icons/react/linear";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { cn } from "cn";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import ClassroomCourseClasswork from "@/components/teacher/classroom-course-classwork";
import DefaultClassBanner from "@/components/teacher/default-class-banner";
import { classroomQueries } from "@/features/classroom/queries";
import { classLabel } from "@/lib/classroom";
import { ActionIcon } from "@/ui/action-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";

const classroomTabs = [
	{ value: "stream", label: "Stream" },
	{ value: "classwork", label: "Classwork" },
	{ value: "people", label: "People" },
	{ value: "grades", label: "Grades" },
] as const;

type ClassroomTab = (typeof classroomTabs)[number]["value"];

function PeoplePanel({ classroomId }: { classroomId: string }) {
	const { data, isPending, isError } = useQuery(
		classroomQueries.members(classroomId),
	);

	return (
		<section className="rounded-xl border border-zinc-100 bg-white p-5 sm:p-6">
			<div className="mb-5 flex items-center justify-between">
				<div>
					<h3 className="font-medium text-zinc-800">Class members</h3>
					<p className="mt-1 text-sm text-zinc-500">
						Teachers and students in this classroom.
					</p>
				</div>
				{data && (
					<span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
						{data.data.length} people
					</span>
				)}
			</div>

			{isPending ? (
				<div className="space-y-3">
					{[0, 1, 2].map((row) => (
						<div key={row} className="flex items-center gap-3 rounded-lg p-2">
							<div className="size-9 animate-pulse rounded-full bg-zinc-100" />
							<div className="space-y-2">
								<div className="h-3 w-32 animate-pulse rounded bg-zinc-100" />
								<div className="h-2.5 w-16 animate-pulse rounded bg-zinc-100" />
							</div>
						</div>
					))}
				</div>
			) : isError ? (
				<p
					role="alert"
					className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700"
				>
					Couldn’t load the classroom roster. Try opening this tab again.
				</p>
			) : data?.data.length ? (
				<div className="divide-y divide-zinc-100">
					{data.data.map((member) => (
						<div
							key={member.id}
							className="flex items-center gap-3 py-3 first:pt-1"
						>
							<Avatar className="size-9 bg-zinc-100 text-zinc-700">
								<AvatarImage src={member.user.image ?? ""} />
								<AvatarFallback>
									{member.user.name?.charAt(0).toUpperCase() ?? "?"}
								</AvatarFallback>
							</Avatar>
							<span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-800">
								{member.user.name || "Unnamed user"}
							</span>
							<span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-500">
								{member.role}
							</span>
						</div>
					))}
				</div>
			) : (
				<p className="rounded-lg bg-zinc-50 p-4 text-sm text-zinc-500">
					No members have joined this classroom yet.
				</p>
			)}
		</section>
	);
}

function EmptyTab({
	icon: Icon,
	title,
	description,
	buttonLabel,
}: {
	icon: Icon;
	title: string;
	description: string;
	buttonLabel?: string;
}) {
	return (
		<section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center">
			<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
				<Icon size={24} />
			</div>
			<h3 className="text-base font-medium text-zinc-800">{title}</h3>
			<p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
			{buttonLabel && (
				<Button
					className="mt-5"
					disabled
					title="Classwork actions are not available yet"
				>
					{buttonLabel}
				</Button>
			)}
		</section>
	);
}

export default function TeacherClassroom() {
	const { classroomId = "" } = useParams();
	const { data } = useSuspenseQuery(classroomQueries.detail(classroomId));
	const classroom = data.data;
	const label = classLabel(classroom);
	const [copied, setCopied] = useState(false);
	const copyTimeout = useRef<number | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const paramTab = searchParams.get("tab");
	const activeTab = classroomTabs.some((tab) => tab.value === paramTab)
		? (paramTab as ClassroomTab)
		: "stream";

	const onTabChange = (value: unknown) => {
		if (!classroomTabs.some((tab) => tab.value === value)) return;
		setSearchParams((current) => {
			const next = new URLSearchParams(current);
			next.set("tab", value as ClassroomTab);
			return next;
		});
	};

	useEffect(
		() => () => {
			if (copyTimeout.current !== null) {
				window.clearTimeout(copyTimeout.current);
			}
		},
		[],
	);

	const copyClassCode = async () => {
		try {
			await navigator.clipboard.writeText(classroom.joinCode);
			setCopied(true);
			if (copyTimeout.current !== null) {
				window.clearTimeout(copyTimeout.current);
			}
			copyTimeout.current = window.setTimeout(() => {
				setCopied(false);
				copyTimeout.current = null;
			}, 3000);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div className="space-y-5">
			<Tabs.Root
				value={activeTab}
				onValueChange={onTabChange}
				className="space-y-5"
			>
				<section className="overflow-hidden rounded-xl bg-white">
					<DefaultClassBanner
						classroom={classroom}
						className="min-h-44 rounded-b-xl flex-col justify-end p-6 sm:p-8"
					>
						<p className="mb-2 text-sm font-medium text-zinc-800/70">
							{classroom.subjectCode || "Classroom"}
							{label ? ` · ${label}` : ""}
						</p>
						<h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-black/70">
							{classroom.name}
						</h2>
					</DefaultClassBanner>

					<Tabs.List className="relative flex gap-1 overflow-x-auto border-b border-zinc-100 px-3 sm:px-5">
						{classroomTabs.map((tab) => (
							<Tabs.Tab
								key={tab.value}
								value={tab.value}
								className={cn(
									"relative z-10 shrink-0 border-b-2 group/tab-item border-transparent px-2 py-3 text-sm font-medium text-zinc-500 outline-none transition-colors hover:text-zinc-800 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-blue-400 data-active:text-blue-500",
								)}
							>
								<span className="px-2 py-1 group-hover/tab-item:bg-zinc-100 rounded-full">
									{tab.label}
								</span>
							</Tabs.Tab>
						))}
						<Tabs.Indicator
							className="absolute bottom-0 z-20 h-1 w-5 rounded-t-xl rounded-b-sm bg-blue-500 transition-[left] duration-300 ease-out"
							style={{
								left: "calc(var(--active-tab-left) + (var(--active-tab-width) - 1.25rem) / 2)",
							}}
						/>
					</Tabs.List>
				</section>

				<Tabs.Panel value="stream" className="outline-none">
					<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_17rem]">
						<EmptyTab
							icon={ClipboardListIcon}
							title="Your class stream is ready"
							description="Announcements, assignments, and class updates will appear here."
							buttonLabel="Create a post"
						/>
						<aside className="space-y-4">
							<section className="rounded-xl bg-white p-5 shadow-sm">
								<h3 className="font-medium text-zinc-700">About this class</h3>
								<p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-500">
									{classroom.description ||
										"Add a description to let students know what this class is about."}
								</p>
								<div className="mt-4 space-y-3 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
									<div className="flex items-center gap-2">
										<PeopleNearbyIcon size={17} className="shrink-0" />
										<span>
											{classroom.memberCount} student
											{classroom.memberCount === 1 ? "" : "s"}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<SquareAcademicCapIcon size={17} className="shrink-0" />
										<span>
											{classroom.department?.name || "No college assigned"}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<CalendarIcon size={17} className="shrink-0" />
										<span>
											Created{" "}
											{new Date(classroom.createdAt).toLocaleDateString()}
										</span>
									</div>
								</div>
							</section>
							<section className="rounded-xl p-5 bg-zinc-100">
								<h3 className="font-medium text-zinc-700">Class code</h3>
								{classroom.joinEnabled ? (
									<>
										<p className="mt-1 text-sm text-zinc-500">
											Share this code with student to invite them.
										</p>
										<div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-white pl-4 p-1.5 text-zinc-700">
											<code className="font-mono text-lg font-semibold tracking-wide">
												{classroom.joinCode}
											</code>
											<ActionIcon
												variant="ghost"
												aria-label={
													copied ? "Class code copied" : "Copy class code"
												}
												title={copied ? "Copied!" : "Copy class code"}
												onClick={copyClassCode}
												className="relative size-8 p-0 text-zinc-500 hover:text-zinc-800"
											>
												<CopyIcon
													aria-hidden="true"
													className={cn(
														"absolute size-4 transition-opacity duration-300",
														copied ? "opacity-0" : "opacity-100",
													)}
												/>
												<CheckCircleIcon
													aria-hidden="true"
													className={cn(
														"absolute size-4 text-emerald-500 transition-opacity duration-500",
														copied ? "opacity-100" : "opacity-0",
													)}
												/>
											</ActionIcon>
										</div>
									</>
								) : (
									<p className="mt-1 text-sm text-zinc-500">
										Joining is currently turned off.
									</p>
								)}
							</section>
						</aside>
					</div>
				</Tabs.Panel>

				<Tabs.Panel value="classwork" className="outline-none">
					<ClassroomCourseClasswork classroomId={classroomId} />
				</Tabs.Panel>

				<Tabs.Panel value="people" className="outline-none">
					<PeoplePanel classroomId={classroomId} />
				</Tabs.Panel>

				<Tabs.Panel value="grades" className="outline-none">
					<EmptyTab
						icon={PeopleNearbyIcon}
						title="Grades will show here"
						description="Once students submit classwork, you’ll be able to review and manage their grades here."
					/>
				</Tabs.Panel>
			</Tabs.Root>
		</div>
	);
}
