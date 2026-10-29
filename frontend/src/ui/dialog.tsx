import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "cn";

interface DialogProps extends BaseDialog.Root.Props {}

function Dialog(props: DialogProps) {
	return <BaseDialog.Root {...props} />;
}

interface DialogTriggerProps extends BaseDialog.Trigger.Props {}

function DialogTrigger({ className, ...props }: DialogTriggerProps) {
	return <BaseDialog.Trigger className={cn(className)} {...props} />;
}

interface DialogPortalProps extends BaseDialog.Portal.Props {}

function DialogPortal(props: DialogPortalProps) {
	return <BaseDialog.Portal {...props} />;
}

interface DialogBackdropProps extends BaseDialog.Backdrop.Props {}

function DialogBackdrop({ className, ...props }: DialogBackdropProps) {
	return (
		<BaseDialog.Backdrop
			className={cn(
				"fixed inset-0 z-50 min-h-dvh bg-black opacity-20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-50 supports-[-webkit-touch-callout:none]:absolute",
				className,
			)}
			{...props}
		/>
	);
}

interface DialogViewportProps extends BaseDialog.Viewport.Props {}

function DialogViewport({ className, ...props }: DialogViewportProps) {
	return <BaseDialog.Viewport className={cn(className)} {...props} />;
}

interface DialogPopupProps extends BaseDialog.Popup.Props {}

function DialogPopup({ className, ...props }: DialogPopupProps) {
	return (
		<BaseDialog.Popup
			className={cn(
				"w-100 bg-white z-50 max-w-[calc(100vw-3rem)] fixed top-1/2 left-1/2 -mt-8 -translate-x-1/2 -translate-y-1/2 transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 p-5 rounded-lg shadow-xl shadow-black/5",
				className,
			)}
			{...props}
		/>
	);
}

interface DialogTitleProps extends BaseDialog.Title.Props {}

function DialogTitle({ className, ...props }: DialogTitleProps) {
	return (
		<BaseDialog.Title
			className={cn("font-medium mb-2", className)}
			{...props}
		/>
	);
}

interface DialogDescriptionProps extends BaseDialog.Description.Props {}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
	return (
		<BaseDialog.Description
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

// Relax children typing to avoid cross-version React types issues (accept bigint, etc.)
interface DialogFooterProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	children?: any;
}

function DialogFooter({ className, ...props }: DialogFooterProps) {
	return (
		<div
			className={cn("flex items-center justify-end gap-1 mt-6", className)}
			{...props}
		/>
	);
}

interface DialogCloseProps extends BaseDialog.Close.Props {}

function DialogClose({ className, ...props }: DialogCloseProps) {
	return <BaseDialog.Close className={cn(className)} {...props} />;
}

export type {
	DialogBackdropProps,
	DialogCloseProps,
	DialogDescriptionProps,
	DialogFooterProps,
	DialogPopupProps,
	DialogPortalProps,
	DialogProps,
	DialogTitleProps,
	DialogTriggerProps,
	DialogViewportProps,
};
export {
	Dialog,
	DialogBackdrop,
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogPopup,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
	DialogViewport,
};
