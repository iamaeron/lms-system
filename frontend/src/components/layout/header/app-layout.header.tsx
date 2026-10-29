import { BellIcon } from "@solar-icons/react/linear";
import { useQuery } from "@tanstack/react-query";
import { useMatches } from "react-router";
import { ActionIcon } from "@/components/ui/action-icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { sessionQueryOptions } from "@/lib/session";

const AppLayoutHeader = () => {
	const { data: user } = useQuery(sessionQueryOptions);

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
					<AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
				</Avatar>
			</div>
		</header>
	);
};

export default AppLayoutHeader;
