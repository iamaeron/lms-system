import { AddIcon, SquareAcademicCapIcon } from "@solar-icons/react/linear";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { paths } from "@/config/paths";
import { classroomMutations } from "@/features/classroom/mutations";
import { classroomQueries } from "@/features/classroom/queries";
import { courseQueries } from "@/features/course/queries";
import { getApiErrorMessage } from "@/lib/api-error";
import { Button } from "@/ui/button";

export default function ClassroomCourseClasswork({
	classroomId,
}: {
	classroomId: string;
}) {
	const [selectedCourseId, setSelectedCourseId] = useState("");
	const queryClient = useQueryClient();
	const classwork = useQuery(classroomQueries.courseClasswork(classroomId));
	const courses = useQuery(courseQueries.list());
	const items = classwork.data?.data ?? [];
	const addedIds = new Set(items.map((item) => item.course.id));
	const availableCourses = (courses.data?.data ?? []).filter(
		(course) => !addedIds.has(course.id),
	);
	const addCourse = useMutation({
		mutationFn: (courseId: string) =>
			classroomMutations.addCourseToClasswork(classroomId, courseId),
		onSuccess: async () => {
			setSelectedCourseId("");
			await queryClient.invalidateQueries({
				queryKey: ["classrooms", "classwork-courses", classroomId],
			});
		},
	});

	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (selectedCourseId) addCourse.mutate(selectedCourseId);
	};

	return (
		<section className="space-y-5 rounded-xl border border-zinc-100 bg-white p-5 sm:p-6">
			<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
				<div>
					<h3 className="font-medium text-zinc-800">Course materials</h3>
					<p className="mt-1 text-sm text-zinc-500">
						Add a course from your library to make it available in this
						classroom’s classwork.
					</p>
				</div>

				{courses.data?.data.length ? (
					<form onSubmit={submit} className="flex gap-2">
						<label className="sr-only" htmlFor={`course-select-${classroomId}`}>
							Course to add
						</label>
						<select
							id={`course-select-${classroomId}`}
							className="min-w-48 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
							value={selectedCourseId}
							onChange={(event) => setSelectedCourseId(event.target.value)}
							disabled={!availableCourses.length || addCourse.isPending}
						>
							<option value="">
								{availableCourses.length
									? "Select a course"
									: "All courses added"}
							</option>
							{availableCourses.map((course) => (
								<option key={course.id} value={course.id}>
									{course.title}
								</option>
							))}
						</select>
						<Button
							type="submit"
							disabled={!selectedCourseId || addCourse.isPending}
						>
							<AddIcon size={16} />
							{addCourse.isPending ? "Adding..." : "Add course"}
						</Button>
					</form>
				) : null}
			</div>

			{addCourse.isError && (
				<p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
					{getApiErrorMessage(
						addCourse.error,
						"Could not add course to classwork.",
					)}
				</p>
			)}
			{courses.isError && (
				<p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
					Couldn’t load your course library. Try reloading this tab.
				</p>
			)}
			{classwork.isError && (
				<p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
					Couldn’t load classwork courses. Try reloading this tab.
				</p>
			)}

			{classwork.isPending ? (
				<p className="text-sm text-zinc-500">Loading classroom courses...</p>
			) : items.length ? (
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{items.map((item) => (
						<Link
							key={item.postId}
							to={paths.portal.teacher.course.getHref(item.course.id)}
							className="block overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-md"
						>
							{item.course.thumbnailUrl ? (
								<img
									src={item.course.thumbnailUrl}
									alt=""
									className="h-32 w-full object-cover"
								/>
							) : (
								<div className="flex h-32 items-center justify-center bg-blue-50 text-blue-600">
									<SquareAcademicCapIcon size={30} />
								</div>
							)}
							<div className="p-4">
								<h4 className="font-medium text-zinc-800">
									{item.course.title}
								</h4>
								<p className="mt-1 line-clamp-2 min-h-10 text-sm text-zinc-500">
									{item.course.summary || "No course summary."}
								</p>
								<p className="mt-3 text-xs text-zinc-500">
									{item.course.sectionCount} sections ·{" "}
									{item.course.lessonCount} lessons
								</p>
							</div>
						</Link>
					))}
				</div>
			) : !courses.isPending && !courses.isError && !courses.data?.data.length ? (
				<div className="rounded-lg border border-dashed border-zinc-200 px-5 py-8 text-center">
					<p className="text-sm text-zinc-600">
						Your course library is empty.
					</p>
					<Link
						to={paths.portal.teacher.courses.getHref()}
						className="mt-2 inline-block text-sm font-medium text-blue-700 hover:text-blue-900"
					>
						Create a course
					</Link>
				</div>
			) : (
				<p className="rounded-lg border border-dashed border-zinc-200 px-5 py-8 text-center text-sm text-zinc-500">
					No courses have been added to this classroom yet.
				</p>
			)}
		</section>
	);
}
