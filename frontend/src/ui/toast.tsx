import { Toast } from "@base-ui/react/toast";
import { cn } from "cn";
import type { ReactNode } from "react";
import { toastRoot, toneOf } from "@/config/toast";

export const toastManager = Toast.createToastManager();

export function ToastProvider({ children }: { children: ReactNode }) {
	return (
		<Toast.Provider toastManager={toastManager} limit={3}>
			{children}
			{/* <Toast.Portal>
				<Toast.Viewport className="fixed right-4 bottom-4 z-100 w-88 max-w-[calc(100vw-2rem)]">
					<ToastList />
				</Toast.Viewport>
			</Toast.Portal> */}
		</Toast.Provider>
	);
}

function ToastList() {
	const { toasts } = Toast.useToastManager();

	return toasts.map((item) => (
		<Toast.Root
			key={item.id}
			toast={item}
			className={toastRoot({ tone: toneOf(item.type) })}
		>
			<Toast.Content
				className={cn(
					"flex items-start justify-between gap-3 transition-opacity duration-200",
					"data-behind:opacity-0 data-behind:data-expanded:opacity-100",
				)}
			>
				<div className="min-w-0">
					<Toast.Title className="text-sm font-semibold text-zinc-900" />
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
	));
}
