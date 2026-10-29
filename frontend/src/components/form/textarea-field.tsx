import { useFieldContext } from "@/lib/form";
import { Field, FieldControl, FieldLabel } from "../../ui/field";
import { Textarea } from "../../ui/textarea";

export function TextareaField({
	label,
	...props
}: { label: string } & React.ComponentProps<typeof Textarea>) {
	const field = useFieldContext<string>();
	const { isTouched, isValid, errors } = field.state.meta;
	const invalid = isTouched && !isValid;

	return (
		<Field invalid={invalid} name={field.name}>
			<FieldLabel>{label}</FieldLabel>
			<FieldControl
				value={field.state.value}
				onChange={(event) => field.handleChange(event.target.value)}
				onBlur={field.handleBlur}
				render={<Textarea {...props} aria-invalid={invalid || undefined} />}
			/>
			{invalid && (
				<p className="text-sm text-destructive">
					{errors
						.map((error) =>
							typeof error === "string" ? error : error?.message,
						)
						.join(", ")}
				</p>
			)}
		</Field>
	);
}
