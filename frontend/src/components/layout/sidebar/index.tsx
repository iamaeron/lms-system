// import {  } from "@solar-icons/react/bold";

import { Toast } from "@base-ui/react";
import {
	BellIcon,
	Dialog2Icon,
	LogoutIcon,
	SettingsMinimalisticIcon,
	SquareAcademicCapIcon,
	UserIcon,
} from "@solar-icons/react/bold-duotone";
import {
	AltArrowDownIcon,
	PanelRightOpenIcon,
} from "@solar-icons/react/linear";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "cn";
import { useNavigate } from "react-router";
import { sidebarNavigation } from "@/config/nav-links";
import { toastRoot, toneOf } from "@/config/toast";
import { authClient } from "@/lib/auth-client";
import { sessionQueryOptions } from "@/lib/session";
import { ActionIcon } from "@/ui/action-icon";
import { Avatar, AvatarFallback } from "@/ui/avatar";
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuPortal,
	MenuPositioner,
	MenuSeparator,
	MenuTrigger,
} from "@/ui/menu";
import NavItem from "./nav-item";

const Sidebar = () => {
	const { toasts } = Toast.useToastManager();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// Access the cached user session resolved by the loader
	const { data: user, isPending } = useQuery(sessionQueryOptions);

	const handleSignOut = async () => {
		await authClient.signOut();
		queryClient.invalidateQueries({ queryKey: ["session"] });
		navigate("/login");
	};

	return (
		// <div className="w-76 p-2 flex">
		<aside className="relative flex w-70 flex-col overflow-hidden border border-zinc-200 bg-zinc-100">
			<header className="flex items-center justify-between pl-3 pt-4 pr-2">
				<div className="flex items-center gap-3 px-0.5">
					<div className="flex items-center gap-2">
						<div className="p-1 rounded-lg shadow-sm shadow-black/2 bg-zinc-50 border border-black/5">
							<SquareAcademicCapIcon
								strokeWidth={2}
								size={24}
								className="text-blue-500"
							/>
						</div>
						<span className="font-semibold text-xl tracking-tight text-zinc-700">
							LMS
						</span>
					</div>
				</div>
				{/* <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded capitalize">
            {user?.role}
          </span> */}

				<ActionIcon variant="ghost">
					<PanelRightOpenIcon strokeWidth={2} size={20} />
				</ActionIcon>
			</header>

			<div className="px-2 mt-5 mb-1">
				<Menu>
					<MenuTrigger
						render={(props) => (
							<button
								{...props}
								className="hover:bg-zinc-200 py-1.5 px-2 w-full text-left rounded-lg flex gap-2 items-center"
							>
								<Avatar>
									<AvatarFallback className="font-semibold">
										{user?.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 truncate">
									<span className="block text-sm text-foreground">
										{user?.name}
									</span>
									<span className="leading-none mb-1 block text-sm text-muted-foreground">
										{user?.email}
									</span>
								</div>

								{/* <ActionIcon variant="ghost"> */}
								<AltArrowDownIcon strokeWidth={2} size={16} />
								{/* </ActionIcon> */}
							</button>
						)}
					></MenuTrigger>

					<MenuPortal>
						<MenuPositioner sideOffset={6}>
							<MenuPopup className="w-(--anchor-width)">
								<MenuItem className="pl-2">
									<UserIcon
										strokeWidth={2}
										size={20}
										className="text-muted-foreground shrink-0"
									/>
									<span>Profile</span>
								</MenuItem>
								<MenuItem className="pl-2">
									<BellIcon
										strokeWidth={2}
										size={20}
										className="text-muted-foreground shrink-0"
									/>
									<span>Notifications</span>
								</MenuItem>
								<MenuItem className="pl-2">
									<Dialog2Icon
										strokeWidth={2}
										size={20}
										className="text-muted-foreground shrink-0"
									/>
									<span>Messages</span>
								</MenuItem>
								<MenuItem className="pl-2">
									<SettingsMinimalisticIcon
										strokeWidth={2}
										size={20}
										className="text-muted-foreground shrink-0"
									/>
									<span>Settings</span>
								</MenuItem>
								<MenuSeparator />
								{/* <MenuSeparator /> */}
								<MenuItem onClick={handleSignOut} className="pl-2">
									<LogoutIcon
										strokeWidth={2}
										size={20}
										className="text-muted-foreground shrink-0"
									/>
									<span>Log out</span>
								</MenuItem>
							</MenuPopup>
						</MenuPositioner>
					</MenuPortal>
				</Menu>
			</div>

			{/* main navs */}
			{isPending || !user ? (
				<div className="flex-1"></div>
			) : (
				<div className="flex-1">
					{sidebarNavigation[user.role].map((section) => (
						<div
							key={section.group}
							className="mb-4 border-t border-zinc-200 border-dashed group first:border-0"
						>
							<hr className="border-t border-white group-first:border-0 mb-4 border-dashed" />
							<div className="px-3">
								<p className="text-xs font-medium text-muted-foreground px-2 mb-1">
									{section.group}
								</p>

								<div>
									{section.items.map((item) => (
										<NavItem key={item.link} item={item} />
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			{/* <hr className="border-t border-zinc-200" /> */}
			{toasts.map((item) => (
				<Toast.Root
					key={item.id}
					toast={item}
					className={cn(toastRoot({ tone: toneOf(item.type) }))}
				>
					<Toast.Content
						className={cn(
							"flex items-start justify-between gap-3 transition-opacity duration-200",
							"data-behind:opacity-0 data-behind:data-expanded:opacity-100",
						)}
					>
						<div className="min-w-0">
							<Toast.Title className="text-sm font-medium text-zinc-900" />
							<Toast.Description className="text-sm text-zinc-500" />
						</div>
						<Toast.Close
							aria-label="Dismiss"
							className="size-6 shrink-0 rounded-md leading-none text-zinc-500 hover:bg-zinc-100"
						>
							×
						</Toast.Close>
					</Toast.Content>
				</Toast.Root>
			))}
			{/* <div className="p-1.5 rounded-md border border-black/5 shadow-sm shadow-black/2 bg-zinc-50 text-sm text-zinc-700">
					Notification
				</div> */}
			{/*<button
          type="button"
          onClick={handleSignOut}
          className="flex gap-3 items-center font-medium text-sm text-muted-foreground px-2.5 py-1.5 hover:bg-zinc-200 rounded-lg w-full hover:text-zinc-700"
        >
          <LogoutIcon strokeWidth={2} size={20} className="shrink-0" />
          <span>Log out</span>
        </button>*/}
		</aside>
		// </div>
	);
};

export default Sidebar;
