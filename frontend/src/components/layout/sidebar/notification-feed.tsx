import { BellIcon, CloseCircleIcon } from "@solar-icons/react/linear";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	notificationMutations,
	notificationQueries,
} from "@/features/notification/queries";

export default function NotificationFeed() {
	const queryClient = useQueryClient();
	const {
		data: notifications = [],
		isPending,
		isError,
	} = useQuery(notificationQueries.list());
	const invalidate = () =>
		queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
	const removeNotification = useMutation({
		mutationFn: notificationMutations.remove,
		onSuccess: invalidate,
	});
	const clearNotifications = useMutation({
		mutationFn: notificationMutations.clear,
		onSuccess: invalidate,
	});
	const markRead = useMutation({
		mutationFn: notificationMutations.markRead,
		onSuccess: invalidate,
	});
	const unreadCount = notifications.filter((notification) => !notification.readAt).length;
	const expandedHeight = `${Math.min(Math.max(notifications.length, 1) * 68, 260)}px`;

	return (
		<section className="shrink-0 border-t border-zinc-200 px-3 py-3">
			<div className="mb-2 flex items-center justify-between px-1">
				<div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
					<BellIcon size={16} />
					<span>Notifications</span>
					{unreadCount > 0 && (
						<span className="rounded-full bg-blue-100 px-1.5 text-xs text-blue-700">
							{unreadCount}
						</span>
					)}
				</div>
				{notifications.length > 0 && (
					<button
						type="button"
						className="text-xs text-zinc-500 hover:text-zinc-800"
						onClick={() => clearNotifications.mutate()}
					>
						Clear
					</button>
				)}
			</div>
			{isPending ? (
				<p className="px-1 py-2 text-sm text-zinc-500">Loading notifications…</p>
			) : isError ? (
				<p className="px-1 py-2 text-sm text-zinc-500">Couldn’t load notifications.</p>
			) : notifications.length === 0 ? (
				<p className="px-1 py-2 text-sm text-zinc-500">You’re all caught up.</p>
			) : (
				<div
					className="notification-stack"
					style={{ "--notification-expanded-height": expandedHeight } as React.CSSProperties}
					aria-label={`${notifications.length} notifications. Hover to expand.`}
				>
					{notifications.map((notification, index) => (
						<article
							key={notification.id}
							className={`notification-stack-card rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_3px_8px_rgba(0,0,0,0.08)] ${notification.readAt ? "" : "border-l-2 border-l-blue-500"}`}
							style={{ "--notification-index": index } as React.CSSProperties}
							onClick={() => {
								if (!notification.readAt) markRead.mutate(notification.id);
							}}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<p className="text-sm font-medium text-zinc-800">
										{notification.title}
									</p>
									{notification.description && (
										<p className="truncate text-xs text-zinc-500">
											{notification.description}
										</p>
									)}
								</div>
								<button
									type="button"
									aria-label="Dismiss notification"
									className="text-zinc-400 hover:text-zinc-700"
									onClick={(event) => {
										event.stopPropagation();
										removeNotification.mutate(notification.id);
									}}
								>
									<CloseCircleIcon size={16} />
								</button>
							</div>
						</article>
					))}
				</div>
			)}
		</section>
	);
}
