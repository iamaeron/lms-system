import { Field as BaseField } from "@base-ui/react/field";
import { cn } from "cn";
import { createContext, useContext } from "react";
import { Tooltip } from "./tooltip";

const FieldRequiredContext = createContext(false);

interface FieldProps extends BaseField.Root.Props {
	required?: boolean;
}

function Field({ className, required = false, ...props }: FieldProps) {
	return (
		<FieldRequiredContext.Provider value={required}>
			<BaseField.Root
				className={cn("flex flex-col gap-1", className)}
				{...props}
			/>
		</FieldRequiredContext.Provider>
	);
}

interface FieldLabelProps extends BaseField.Label.Props {
	required?: boolean;
}

function FieldLabel({
	className,
	required,
	children,
	...props
}: FieldLabelProps) {
	const fieldRequired = useContext(FieldRequiredContext);
	const isRequired = required ?? fieldRequired;

	return (
		<BaseField.Label
			className={cn("text-sm text-zinc-700 pl-2 inline-block", className)}
			{...props}
		>
			{children}
			{isRequired && (
				<span aria-hidden="true" className="text-red-500 ml-0.5">
					*
				</span>
			)}
		</BaseField.Label>
	);
}

interface FieldControlProps extends BaseField.Control.Props {}

function FieldControl({ className, required, ...props }: FieldControlProps) {
	const fieldRequired = useContext(FieldRequiredContext);

	return (
		<BaseField.Control
			className={cn(className)}
			required={required ?? (fieldRequired || undefined)}
			{...props}
		/>
	);
}

interface FieldDescriptionProps extends BaseField.Description.Props {}

function FieldDescription({ className, ...props }: FieldDescriptionProps) {
	return (
		<BaseField.Description
			className={cn("text-muted-foreground text-sm pl-2", className)}
			{...props}
		/>
	);
}

interface FieldItemProps extends BaseField.Item.Props {}

function FieldItem({ className, ...props }: FieldItemProps) {
	return <BaseField.Item className={cn(className)} {...props} />;
}

interface FieldErrorProps extends BaseField.Error.Props {}

function FieldError({ className, ...props }: FieldErrorProps) {
	return <BaseField.Error className={cn(className)} {...props} />;
}

interface FieldValidityProps extends BaseField.Validity.Props {}

function FieldValidity(props: FieldValidityProps) {
	return <BaseField.Validity {...props} />;
}

export type {
	FieldControlProps,
	FieldDescriptionProps,
	FieldErrorProps,
	FieldItemProps,
	FieldLabelProps,
	FieldProps,
	FieldValidityProps,
};
export {
	Field,
	FieldControl,
	FieldDescription,
	FieldError,
	FieldItem,
	FieldLabel,
	FieldValidity,
};
