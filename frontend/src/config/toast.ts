import { cva, type VariantProps } from "class-variance-authority";
import { toastManager } from "@/ui/toast";

export const toastRoot = cva(
	[
		"absolute right-2 left-2 bottom-2 w-auto max-w-[calc(100%-1rem)] origin-bottom select-none overflow-hidden rounded-xl bg-zinc-50 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_0_0_rgba(0,0,0,0.03),0_4px_6px_1px_rgba(0,0,0,0.05),inset_0_1px_0_0_rgba(255,255,255,1)] px-4 py-3.5",
		"z-[calc(1000_-_var(--toast-index))] h-[var(--toast-frontmost-height,var(--toast-height))]",
		"[--gap:0.75rem] [--peek:0.75rem] [--scale:calc(max(0,1_-_(var(--toast-index)*0.1)))] [--shrink:calc(1_-_var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))]",
		"[--offset-y:calc(var(--toast-offset-y)*-1_+_var(--toast-index)*var(--gap)*-1_+_var(--toast-swipe-movement-y))]",
		"[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)_-_var(--toast-index)*var(--peek)_-_var(--shrink)*var(--height)))_scale(var(--scale))]",
		"transition-[transform,opacity,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
		"data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
		"data-starting-style:opacity-0 data-starting-style:[transform:translateY(150%)]",
		"data-ending-style:opacity-0 data-ending-style:[transform:translateY(150%)]",
		"data-[swipe-direction=right]:data-ending-style:[transform:translateX(calc(var(--toast-swipe-movement-x)_+_150%))_translateY(var(--offset-y))]",
		"data-[swipe-direction=down]:data-ending-style:[transform:translateY(calc(var(--toast-swipe-movement-y)_+_150%))]",
		"data-limited:opacity-0",
	],
	{
		variants: {
			tone: {
				default: "border-zinc-200",
				success: "border-emerald-300",
				error: "border-rose-300",
			},
		},
		defaultVariants: { tone: "default" },
	},
);

export const toast = {
	success: (title: string, description?: string) =>
		toastManager.add({ title, description, type: "success" }),
	error: (title: string, description?: string) =>
		toastManager.add({ title, description, type: "error", priority: "high" }),
	info: (title: string, description?: string) =>
		toastManager.add({ title, description, type: "info" }),
	close: (id?: string) => toastManager.close(id),
	promise: ((...args: Parameters<typeof toastManager.promise>) =>
		toastManager.promise(...args)) as typeof toastManager.promise,
};

type Tone = NonNullable<VariantProps<typeof toastRoot>["tone"]>;

export function toneOf(type: string | undefined): Tone {
	return type === "success" || type === "error" ? type : "default";
}
