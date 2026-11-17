import { AltArrowLeftIcon, BellIcon } from "@solar-icons/react/linear";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useMatches, useNavigate } from "react-router";
import { sessionQueryOptions } from "@/lib/session";
import { ActionIcon } from "@/ui/action-icon";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { Tooltip } from "@/ui/tooltip";

const AppLayoutHeader = () => {
	const { data: user } = useQuery(sessionQueryOptions);
	const navigate = useNavigate();
	const location = useLocation();

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
	const handle = titleMatch?.handle as
		| { title?: string; showBack?: boolean }
		| undefined;
	const title = handle?.title;
	const showBack = handle?.showBack ?? false;

	const goBack = () => {
		// const historyIndex = window.history.state?.idx;
		// if (typeof historyIndex === "number" && historyIndex > 0) {
		// 	navigate(-1);
		// 	return;
		// }
		const segments = location.pathname.split("/").filter(Boolean);
		segments.pop();
		navigate(`/${segments.join("/")}` || "/");
	};

	return (
		<header className="p-4 flex items-center justify-between">
			<div className="flex min-w-0 items-center gap-2">
				{showBack && (
					<Button
						variant="ghost"
						size="icon"
						aria-label="Go back"
						onClick={goBack}
					>
						<AltArrowLeftIcon size={20} />
					</Button>
				)}
				{title && (
					<h1 className="truncate text-xl font-medium tracking-tight text-foreground">
						{title}
					</h1>
				)}
			</div>

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
