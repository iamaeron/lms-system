import { cn } from "cn";
import * as React from "react";
import { Avatar, AvatarFallback } from "./avatar";

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	max?: number;
}

function AvatarGroup({ children, max, className, ...props }: AvatarGroupProps) {
	const items = React.Children.toArray(children);
	const visible = max ? items.slice(0, max) : items;
	const overflowCount = max && items.length > max ? items.length - max : 0;

	return (
		<div className={cn("isolate flex items-center", className)} {...props}>
			{React.Children.map(visible, (child, index) => (
				<div
					style={{ "--z": visible.length - index } as React.CSSProperties}
					className={cn(
						"relative border-4 border-white rounded-full transition-all duration-150 z-(--z) hover:z-30 hover:scale-105",
						index !== 0 && "-ml-3",
					)}
				>
					{child}
				</div>
			))}

			{overflowCount > 0 && (
				<div className="relative z-0 -ml-3 transition-all duration-150 border-4 border-white rounded-full hover:z-30 hover:scale-105">
					<Avatar>
						<AvatarFallback>+{overflowCount}</AvatarFallback>
					</Avatar>
				</div>
			)}
		</div>
	);
}

export type { AvatarGroupProps };
export { AvatarGroup };
