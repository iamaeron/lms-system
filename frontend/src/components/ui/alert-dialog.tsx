import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { cn } from "cn";

interface AlertDialogProps extends BaseAlertDialog.Root.Props {}

function AlertDialog(props: AlertDialogProps) {
	return <BaseAlertDialog.Root {...props} />;
}

interface AlertDialogTriggerProps extends BaseAlertDialog.Trigger.Props {}

function AlertDialogTrigger({ className, ...props }: AlertDialogTriggerProps) {
	return <BaseAlertDialog.Trigger className={cn(className)} {...props} />;
}

interface AlertDialogPortalProps extends BaseAlertDialog.Portal.Props {}

function AlertDialogPortal(props: AlertDialogPortalProps) {
	return <BaseAlertDialog.Portal {...props} />;
}

interface AlertDialogBackdropProps extends BaseAlertDialog.Backdrop.Props {}

function AlertDialogBackdrop({
	className,
	...props
}: AlertDialogBackdropProps) {
	return (
		<BaseAlertDialog.Backdrop
			className={cn(
				"fixed inset-0 z-50 min-h-dvh bg-black opacity-20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-50 supports-[-webkit-touch-callout:none]:absolute",
				className,
			)}
			{...props}
		/>
	);
}

interface AlertDialogViewportProps extends BaseAlertDialog.Viewport.Props {}

function AlertDialogViewport({
	className,
	...props
}: AlertDialogViewportProps) {
	return <BaseAlertDialog.Viewport className={cn(className)} {...props} />;
}

interface AlertDialogPopupProps extends BaseAlertDialog.Popup.Props {}

function AlertDialogPopup({ className, ...props }: AlertDialogPopupProps) {
	return (
		<BaseAlertDialog.Popup
			className={cn(
				"w-100 bg-white z-50 max-w-[calc(100vw-3rem)] fixed top-1/2 left-1/2 -mt-8 -translate-x-1/2 -translate-y-1/2 transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 p-5 rounded-xl shadow-xl shadow-black/5",
				className,
			)}
			{...props}
		/>
	);
}

interface AlertDialogTitleProps extends BaseAlertDialog.Title.Props {}

function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
	return (
		<BaseAlertDialog.Title
			className={cn("font-semibold mb-2", className)}
			{...props}
		/>
	);
}

interface AlertDialogDescriptionProps
	extends BaseAlertDialog.Description.Props {}

function AlertDialogDescription({
	className,
	...props
}: AlertDialogDescriptionProps) {
	return (
		<BaseAlertDialog.Description
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

// Relax children typing to avoid cross-version React types issues (accept bigint, etc.)
interface AlertDialogFooterProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
	children?: any;
}

function AlertDialogFooter({ className, ...props }: AlertDialogFooterProps) {
	return (
		<div
			className={cn("flex items-center justify-end gap-2 mt-6", className)}
			{...props}
		/>
	);
}

interface AlertDialogCloseProps extends BaseAlertDialog.Close.Props {}

function AlertDialogClose({ className, ...props }: AlertDialogCloseProps) {
	return <BaseAlertDialog.Close className={cn(className)} {...props} />;
}

export type {
	AlertDialogBackdropProps,
	AlertDialogCloseProps,
	AlertDialogDescriptionProps,
	AlertDialogFooterProps,
	AlertDialogPopupProps,
	AlertDialogPortalProps,
	AlertDialogProps,
	AlertDialogTitleProps,
	AlertDialogTriggerProps,
	AlertDialogViewportProps,
};
export {
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogClose,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogPopup,
	AlertDialogPortal,
	AlertDialogTitle,
	AlertDialogTrigger,
	AlertDialogViewport,
};
