import type { Icon } from "@solar-icons/react/lib/types";
import { cn } from "cn";
import { NavLink } from "react-router";

interface NavItemProps {
	item: {
		label: string;
		icon: Icon;
		activeIcon: Icon;
		link: string;
		badge?: undefined | string;
	};
}

const NavItem = ({ item }: NavItemProps) => {
	return (
		<NavLink
			end
			to={item.link}
			className={({ isActive }) =>
				`relative group/link flex items-center gap-3 px-2.5 py-1.5 rounded-lg text-sm transition-[colors,scale] will-change-transform ${
					isActive
						? "text-blue-600 font-medium"
						: "text-foreground border-transparent hover:text-zinc-700"
				}`
			}
		>
			{({ isActive }) => {
				const Icon = isActive ? item.activeIcon : item.icon;
				return (
					<>
						<div
							className={cn(
								"absolute inset-0 z-0 rounded-lg transition-[scale,transform] bg-zinc-200 opacity-0 group-hover/link:opacity-100 group-active/link:scale-97 duration-150",
							)}
						/>
						<Icon
							strokeWidth={2}
							size={20}
							className={cn(
								"relative z-10",
								isActive ? "text-blue-500" : "text-muted-foreground",
							)}
						/>
						<span className="relative z-10 flex-1">{item.label}</span>
						{item.badge && (
							<span className="relative z-10 text-xs uppercase bg-red-500 border border-red-600 shadow-[inset_0_-2px_0_0_var(--color-red-600),inset_0_2px_0_0_var(--color-red-400)]! text-white px-1 rounded-sm font-bold">
								{item.badge}
							</span>
						)}
					</>
				);
			}}
		</NavLink>
	);
};

export default NavItem;
