// import {  } from "@solar-icons/react/bold";

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
import { NavLink, useNavigate } from "react-router";
import { defaultClassMeshStyle } from "@/components/teacher/default-class-banner";
import { sidebarNavigation } from "@/config/nav-links";
import { paths } from "@/config/paths";
import { toastRoot, toneOf } from "@/config/toast";
import { classroomQueries } from "@/features/classroom/queries";
import { authClient } from "@/lib/auth-client";
import { classLabel } from "@/lib/classroom";
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
import { Tooltip } from "@/ui/tooltip";
import NavItem from "./nav-item";
import NotificationFeed from "./notification-feed";

const Sidebar = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	// Access the cached user session resolved by the loader
	const { data: user, isPending } = useQuery(sessionQueryOptions);
	const { data: classrooms } = useQuery({
		...classroomQueries.list(),
		enabled: user?.role === "teacher",
	});

	const handleSignOut = async () => {
		await authClient.signOut();
		queryClient.invalidateQueries({ queryKey: ["session"] });
		navigate("/login");
	};

	return (
		// <div className="w-76 p-2 flex">
		<aside className="relative flex w-70 flex-col overflow-y-auto bg-zinc-100">
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
						<MenuPositioner sideOffset={6} className="z-50">
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
							className="mb-3 border-t border-zinc-200 border-dashed group first:border-0"
						>
							<hr className="border-t border-white group-first:border-0 mb-3 border-dashed" />
							<div className="px-3">
								<p className="text-xs font-medium text-zinc-400 px-2 mb-1">
									{section.group}
								</p>

								<div>
									{section.items.map((item) => (
										<div key={item.link}>
											<NavItem item={item} />
											{user.role === "teacher" &&
												item.label === "Classrooms" && (
													<div className="relative ml-[22px] pl-2.5">
														<span
															aria-hidden="true"
															className="absolute -top-1 bottom-3 -left-0.5 border-l border-zinc-300"
														/>
														{classrooms?.data
															.slice(0, 5)
															.map(({ classroom }) => (
																<NavLink
																	key={classroom.id}
																	to={paths.portal.teacher.classroom.getHref(
																		classroom.id,
																	)}
																	className={({ isActive }) =>
																		`group/classroom relative my-0.5 rounded-lg px-2 min-w-0 flex py-1.25 text-sm before:absolute before:-left-3 before:bottom-1/2 before:rounded-bl-sm before:w-3 before:border-b before:border-l before:h-5 before:border-zinc-300 ${isActive ? "font-medium text-blue-500" : "text-zinc-600 hover:text-zinc-800"}`
																	}
																	end
																>
																	{({ isActive }) => (
																		<>
																			<div
																				className={cn(
																					"absolute inset-0 z-0 rounded-lg transition-[scale,transform] bg-zinc-200/70 opacity-0 group-hover/classroom:opacity-100 group-active/classroom:scale-97 duration-150",
																				)}
																			/>
																			<div className="flex-1 flex min-w-0 items-center gap-2 z-2 relative">
																				<Avatar
																					className={cn(
																						"size-5.5 border border-white ring-2 text-[11px] font-semibold text-zinc-800",
																						isActive
																							? "ring-blue-400"
																							: "ring-white",
																					)}
																					style={defaultClassMeshStyle(
																						classroom,
																					)}
																				>
																					<AvatarFallback className="text-[11px] font-semibold">
																						{classroom.name
																							.charAt(0)
																							.toUpperCase()}
																					</AvatarFallback>
																				</Avatar>
																				<p className="flex min-w-0 flex-1 items-center gap-2">
																					<span className="min-w-0 truncate">
																						{classroom.subjectCode}
																					</span>
																					<span className="ml-auto shrink-0 text-xs text-zinc-400">
																						{classLabel(classroom)}
																					</span>
																				</p>
																			</div>
																		</>
																	)}
																</NavLink>
															))}
													</div>
												)}
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			)}
			<NotificationFeed />
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
