import { Select as BaseSelect } from "@base-ui/react/select";
import { cn } from "cn";

interface SelectProps<Value = any> extends BaseSelect.Root.Props<Value> {}

function Select<Value = any>(props: SelectProps<Value>) {
	return <BaseSelect.Root {...props} />;
}

interface SelectLabelProps extends BaseSelect.Label.Props {}

function SelectLabel({ className, ...props }: SelectLabelProps) {
	return (
		<BaseSelect.Label
			className={cn("text-sm font-medium mb-1", className)}
			{...props}
		/>
	);
}

interface SelectTriggerProps extends BaseSelect.Trigger.Props {}

function SelectTrigger({ className, ...props }: SelectTriggerProps) {
	return (
		<BaseSelect.Trigger
			className={cn(
				"flex min-w-44 items-center justify-between gap-2 px-3 py-1.5 text-sm text-zinc-700 bg-white rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_0_0_rgba(0,0,0,0.07),0_6px_10px_0_rgba(0,0,0,0.05)] relative",
				"transition-colors outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pressed:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-zinc-400/70 focus-visible:ring-offset-2",
				className,
			)}
			{...props}
		/>
	);
}

interface SelectValueProps extends BaseSelect.Value.Props {}

function SelectValue({ className, ...props }: SelectValueProps) {
	return (
		<BaseSelect.Value
			className={cn("data-placeholder:text-zinc-500", className)}
			{...props}
		/>
	);
}

interface SelectIconProps extends BaseSelect.Icon.Props {}

function SelectIcon({ className, ...props }: SelectIconProps) {
	return <BaseSelect.Icon className={cn(className)} {...props} />;
}

interface SelectPortalProps extends BaseSelect.Portal.Props {}

function SelectPortal(props: SelectPortalProps) {
	return <BaseSelect.Portal {...props} />;
}

interface SelectBackdropProps extends BaseSelect.Backdrop.Props {}

function SelectBackdrop({ className, ...props }: SelectBackdropProps) {
	return <BaseSelect.Backdrop className={cn(className)} {...props} />;
}

interface SelectPositionerProps extends BaseSelect.Positioner.Props {}

function SelectPositioner({
	className,
	sideOffset = 4,
	...props
}: SelectPositionerProps) {
	return (
		<BaseSelect.Positioner
			sideOffset={sideOffset}
			className={cn("z-50 outline-none", className)}
			{...props}
		/>
	);
}

interface SelectPopupProps extends BaseSelect.Popup.Props {}

function SelectPopup({ className, ...props }: SelectPopupProps) {
	return (
		<BaseSelect.Popup
			className={cn(
				"group min-w-(--anchor-width) origin-(--transform-origin) text-zinc-900 bg-white rounded-lg relative",
				"shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_0_0_rgba(0,0,0,0.07),0_6px_10px_0_rgba(0,0,0,0.05)]",
				"outline-none transition-[scale,opacity] duration-100 ease-out",
				"data-starting-style:scale-[0.98] data-starting-style:opacity-0",
				"data-ending-style:scale-[0.98] data-ending-style:opacity-0",
				"motion-reduce:transition-none",
				// keep only the width tweak for aligned mode
				"data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)]",
				className,
			)}
			{...props}
		/>
	);
}

interface SelectListProps extends BaseSelect.List.Props {}

function SelectList({ className, ...props }: SelectListProps) {
	return (
		<BaseSelect.List
			className={cn(
				"relative max-h-(--available-height) overflow-y-auto p-1 scroll-py-1",
				className,
			)}
			{...props}
		/>
	);
}

interface SelectGroupProps extends BaseSelect.Group.Props {}

function SelectGroup({ className, ...props }: SelectGroupProps) {
	return <BaseSelect.Group className={cn(className)} {...props} />;
}

interface SelectGroupLabelProps extends BaseSelect.GroupLabel.Props {}

function SelectGroupLabel({ className, ...props }: SelectGroupLabelProps) {
	return <BaseSelect.GroupLabel className={cn(className)} {...props} />;
}

interface SelectItemProps extends BaseSelect.Item.Props {}

function SelectItem({ className, ...props }: SelectItemProps) {
	return (
		<BaseSelect.Item
			className={cn(
				"grid min-w-(--anchor-width) cursor-default select-none grid-cols-[1fr_auto] items-center gap-2",
				"rounded-md py-1 pl-2 pr-2 text-sm text-zinc-700 outline-none",
				"group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)]",
				"data-highlighted:bg-zinc-100 data-highlighted:text-zinc-950",
				"data-disabled:cursor-not-allowed data-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

interface SelectItemTextProps extends BaseSelect.ItemText.Props {}

function SelectItemText({ className, ...props }: SelectItemTextProps) {
	return <BaseSelect.ItemText className={cn("flex-1", className)} {...props} />;
}

interface SelectItemIndicatorProps extends BaseSelect.ItemIndicator.Props {}

function SelectItemIndicator({
	className,
	...props
}: SelectItemIndicatorProps) {
	return (
		<BaseSelect.ItemIndicator
			className={cn(
				"flex items-center justify-center text-zinc-900",
				className,
			)}
			{...props}
		/>
	);
}

interface SelectArrowProps extends BaseSelect.Arrow.Props {}

function SelectArrow({ className, ...props }: SelectArrowProps) {
	return <BaseSelect.Arrow className={cn(className)} {...props} />;
}

interface SelectScrollUpArrowProps extends BaseSelect.ScrollUpArrow.Props {}

function SelectScrollUpArrow({
	className,
	...props
}: SelectScrollUpArrowProps) {
	return (
		<BaseSelect.ScrollUpArrow
			className={cn(
				"absolute top-0 z-10 flex h-4 w-full cursor-default items-center justify-center rounded-t-lg bg-white text-xs",
				"data-[direction=up]:before:absolute data-[direction=up]:before:-top-full data-[direction=up]:before:h-full data-[direction=up]:before:w-full data-[direction=up]:before:content-['']",
				className,
			)}
			{...props}
		/>
	);
}

interface SelectScrollDownArrowProps extends BaseSelect.ScrollDownArrow.Props {}

function SelectScrollDownArrow({
	className,
	...props
}: SelectScrollUpArrowProps) {
	return (
		<BaseSelect.ScrollDownArrow
			className={cn(
				"absolute bottom-0 z-10 flex h-4 w-full cursor-default items-center justify-center rounded-b-lg bg-white text-xs",
				"data-[direction=up]:before:absolute data-[direction=up]:before:-top-full data-[direction=up]:before:h-full data-[direction=up]:before:w-full data-[direction=up]:before:content-['']",
				className,
			)}
			{...props}
		/>
	);
}

interface SelectSeparatorProps extends BaseSelect.Separator.Props {}

function SelectSeparator({ className, ...props }: SelectSeparatorProps) {
	return (
		<BaseSelect.Separator
			className={cn("my-1 h-px bg-zinc-200", className)}
			{...props}
		/>
	);
}

export type {
	SelectArrowProps,
	SelectBackdropProps,
	SelectGroupLabelProps,
	SelectGroupProps,
	SelectIconProps,
	SelectItemIndicatorProps,
	SelectItemProps,
	SelectItemTextProps,
	SelectLabelProps,
	SelectListProps,
	SelectPopupProps,
	SelectPortalProps,
	SelectPositionerProps,
	SelectProps,
	SelectScrollDownArrowProps,
	SelectScrollUpArrowProps,
	SelectSeparatorProps,
	SelectTriggerProps,
	SelectValueProps,
};
export {
	Select,
	SelectArrow,
	SelectBackdrop,
	SelectGroup,
	SelectGroupLabel,
	SelectIcon,
	SelectItem,
	SelectItemIndicator,
	SelectItemText,
	SelectLabel,
	SelectList,
	SelectPopup,
	SelectPortal,
	SelectPositioner,
	SelectScrollDownArrow,
	SelectScrollUpArrow,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
