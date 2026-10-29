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

interface InputProps extends React.ComponentProps<"input"> {
	leftSection?: React.ReactNode;
	rightSection?: React.ReactNode;
	clearable?: boolean;
	onClear?: () => void;
	wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			leftSection,
			rightSection,
			clearable,
			onClear,
			value,
			onChange,
			wrapperClassName,
			...props
		},
		ref,
	) => {
		const innerRef = React.useRef<HTMLInputElement>(null);
		React.useImperativeHandle(ref, () => {
			const input = innerRef.current;
			if (!input) {
				throw new Error("Input element is not mounted");
			}
			return input;
		});

		const isNumberType = type === "number";
		const showClear = clearable && !!value;

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (isNumberType) {
				const val = e.target.value;
				const isValidPartialNumber = /^-?\d*\.?\d*$/.test(val);
				if (!isValidPartialNumber) {
					return;
				}
			}
			onChange?.(e);
		};

		const handleClear = () => {
			if (onClear) {
				onClear();
			} else if (onChange) {
				const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
					window.HTMLInputElement.prototype,
					"value",
				)?.set;
				const input = innerRef.current;
				if (input && nativeInputValueSetter) {
					nativeInputValueSetter.call(input, "");
					const event = new Event("input", { bubbles: true });
					input.dispatchEvent(event);
				}
			}
			innerRef.current?.focus();
		};

		return (
			<div
				className={cn("relative flex w-full items-center", wrapperClassName)}
			>
				{leftSection && (
					<div className="absolute left-3 flex items-center pointer-events-none text-zinc-400">
						{leftSection}
					</div>
				)}
				<input
					ref={innerRef}
					type={isNumberType ? "text" : type}
					inputMode={isNumberType ? "decimal" : props.inputMode}
					data-slot="input"
					value={value}
					onChange={handleChange}
					className={cn(
						"file:text-foreground bg-zinc-50 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex w-full min-w-0 rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_0_0_rgba(0,0,0,0.03),0_2px_4px_0_rgba(0,0,0,0.08),inset_0_1px_0_0_rgba(255,255,255,1)] placeholder:text-zinc-400 focus:bg-white text-zinc-600 focus:text-black px-3.5 py-1.5 transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent text-sm file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
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
					<div className="absolute right-3 flex items-center gap-2 text-zinc-400">
						{showClear && (
							<button
								type="button"
								onClick={handleClear}
								className="pointer-events-auto flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
								tabIndex={-1}
								aria-label="Clear input"
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

Input.displayName = "Input";

export type { InputProps };
export { Input };
