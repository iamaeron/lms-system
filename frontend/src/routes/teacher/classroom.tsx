import {
	CalendarIcon,
	ClipboardListIcon,
	PeopleNearbyIcon,
	SquareAcademicCapIcon,
} from "@solar-icons/react/linear";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import DefaultClassBanner from "@/components/teacher/default-class-banner";
import { classroomQueries } from "@/features/classroom/queries";
import { classLabel } from "@/lib/classroom";
import { Button } from "@/ui/button";

export default function TeacherClassroom() {
	const { classroomId = "" } = useParams();
	const { data } = useSuspenseQuery(classroomQueries.detail(classroomId));
	const classroom = data.data;
	const label = classLabel(classroom);

	return (
		<div className="space-y-5">
			<section className="overflow-hidden rounded-xl bg-white shadow-sm">
				<DefaultClassBanner classroom={classroom} className="min-h-44 flex-col justify-end p-6 sm:p-8">
					<p className="mb-2 text-sm font-medium text-zinc-800/70">
						{classroom.subjectCode || "Classroom"}{label ? ` · ${label}` : ""}
					</p>
					<h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-zinc-900">
						{classroom.name}
					</h2>
				</DefaultClassBanner>

				<nav aria-label="Classroom sections" className="flex gap-1 overflow-x-auto border-b border-zinc-100 px-3 sm:px-5">
					<a href="#stream" aria-current="page" className="border-b-2 border-blue-600 px-4 py-3 text-sm font-medium text-blue-700">Stream</a>
					<a href="#classwork" className="border-b-2 border-transparent px-4 py-3 text-sm text-zinc-500 hover:text-zinc-800">Classwork</a>
					<a href="#people" className="border-b-2 border-transparent px-4 py-3 text-sm text-zinc-500 hover:text-zinc-800">People</a>
					<a href="#grades" className="border-b-2 border-transparent px-4 py-3 text-sm text-zinc-500 hover:text-zinc-800">Grades</a>
				</nav>
			</section>

			<div id="stream" className="grid gap-4 md:grid-cols-[minmax(0,1fr)_17rem]">
				<section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white px-6 py-10 text-center">
					<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
						<ClipboardListIcon size={24} />
					</div>
					<h3 className="text-base font-medium text-zinc-800">Your class stream is ready</h3>
					<p className="mt-1 max-w-sm text-sm text-zinc-500">Announcements, assignments, and class updates will appear here.</p>
					<Button className="mt-5" disabled title="Class posts are not available yet">Create a post</Button>
				</section>

				<aside className="space-y-4">
					<section className="rounded-xl bg-white p-5 shadow-sm">
						<h3 className="font-medium text-zinc-800">About this class</h3>
						<p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-500">{classroom.description || "Add a description to let students know what this class is about."}</p>
						<div className="mt-4 space-y-3 border-t border-zinc-100 pt-4 text-sm text-zinc-600">
							<div className="flex items-center gap-2"><PeopleNearbyIcon size={17} /><span>{classroom.memberCount} student{classroom.memberCount === 1 ? "" : "s"}</span></div>
							<div className="flex items-center gap-2"><SquareAcademicCapIcon size={17} /><span>{classroom.department?.name || "No college assigned"}</span></div>
							<div className="flex items-center gap-2"><CalendarIcon size={17} /><span>Created {new Date(classroom.createdAt).toLocaleDateString()}</span></div>
						</div>
					</section>

					<section className="rounded-xl bg-white p-5 shadow-sm">
						<h3 className="font-medium text-zinc-800">Class code</h3>
						{classroom.joinEnabled ? (
							<>
								<p className="mt-1 text-sm text-zinc-500">Share this code with students to invite them.</p>
								<p className="mt-3 rounded-lg bg-zinc-50 px-3 py-2 font-mono text-lg tracking-widest text-zinc-800">{classroom.joinCode}</p>
							</>
						) : <p className="mt-1 text-sm text-zinc-500">Joining is currently turned off.</p>}
					</section>
				</aside>
			</div>
		</div>
	);
}
