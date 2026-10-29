import { cn } from "cn";
import * as React from "react";

function ClearIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-label="Clear icon"
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="icon icon-tabler icons-tabler-outline icon-tabler-x"
			{...props}
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M18 6l-12 12" />
			<path d="M6 6l12 12" />
		</svg>
	);
}

interface TextareaProps extends React.ComponentProps<"textarea"> {
	leftSection?: React.ReactNode;
	rightSection?: React.ReactNode;
	clearable?: boolean;
	onClear?: () => void;
	wrapperClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			className,
			leftSection,
			rightSection,
			clearable,
			onClear,
			value,
			wrapperClassName,
			...props
		},
		ref,
	) => {
		const innerRef = React.useRef<HTMLTextAreaElement>(null);
		React.useImperativeHandle(ref, () => {
			const textarea = innerRef.current;
			if (!textarea) {
				throw new Error("Textarea element is not mounted");
			}
			return textarea;
		});

		const showClear = clearable && !!value;

		const handleClear = () => {
			if (onClear) {
				onClear();
			} else if (props.onChange) {
				const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
					window.HTMLTextAreaElement.prototype,
					"value",
				)?.set;
				const textarea = innerRef.current;
				if (textarea && nativeTextareaValueSetter) {
					nativeTextareaValueSetter.call(textarea, "");
					const event = new Event("input", { bubbles: true });
					textarea.dispatchEvent(event);
				}
			}
			innerRef.current?.focus();
		};

		return (
			<div
				className={cn("relative flex w-full", wrapperClassName)}
			>
				{leftSection && (
					<div className="absolute left-3 top-3 flex items-center pointer-events-none text-zinc-400">
						{leftSection}
					</div>
				)}
				<textarea
					ref={innerRef}
					data-slot="textarea"
					value={value}
					className={cn(
						"bg-zinc-50 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full min-w-0 min-h-24 resize-y rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_0_0_rgba(0,0,0,0.03),0_2px_4px_0_rgba(0,0,0,0.08),inset_0_1px_0_0_rgba(255,255,255,1)] placeholder:text-zinc-400 focus:bg-white text-zinc-600 focus:text-black px-3.5 py-2 transition-[color,box-shadow] text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
						"outline-2 focus:-outline-offset-1 focus:outline-primary outline-transparent",
						"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
						leftSection && "pl-9",
						(rightSection || showClear) && "pr-9",
						rightSection && showClear && "pr-14",
						className,
					)}
					{...props}
				/>
				{(showClear || rightSection) && (
					<div className="absolute right-3 top-3 flex items-center gap-2 text-zinc-400">
						{showClear && (
							<button
								type="button"
								onClick={handleClear}
								className="pointer-events-auto flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
								tabIndex={-1}
								aria-label="Clear textarea"
							>
								<ClearIcon className="size-3.5" />
							</button>
						)}
						{rightSection}
					</div>
				)}
			</div>
		);
	},
);

Textarea.displayName = "Textarea";

export type { TextareaProps };
export { Textarea };
