import { BellIcon } from "@solar-icons/react/linear";
import { Outlet, useMatches } from "react-router";
import Sidebar from "@/components/layout/sidebar";
import { ActionIcon } from "@/components/ui/action-icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";

export default function AppLayout() {
	const matches = useMatches();
	// Find the deepest match that has a title in its handle
	const titleMatch = [...matches]
		.reverse()
		.find(
			(match) =>
				match.handle &&
				typeof match.handle === "object" &&
				"title" in match.handle,
		);
	const title = (titleMatch?.handle as { title?: string } | undefined)?.title;

	return (
		<div className="min-h-screen flex bg-zinc-50">
			<Sidebar />

			{/* 2. Main Content Area where nested child routes render */}
			<main className="flex-1 w-full">
				<div className="max-w-5xl mx-auto">
					<header className="p-4 flex items-center justify-between">
						{title && (
							<h1 className="text-xl font-medium tracking-tight text-foreground">
								{title}
							</h1>
						)}

						<div className="flex items-center gap-1">
							<Tooltip content="Notifications">
								<ActionIcon variant="ghost">
									<BellIcon strokeWidth={2} size={20} />
								</ActionIcon>
							</Tooltip>

							<Avatar>
								<AvatarFallback>K</AvatarFallback>
							</Avatar>
						</div>
					</header>
					<div className="p-4">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
}
