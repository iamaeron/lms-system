import { useFieldContext } from "@/lib/form";
import { Field, FieldControl, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export function TextField({
	label,
	required,
	format,
	...props
}: {
	label: string;
	required?: boolean;
	format?: (value: string) => string; // e.g. the section-letter filter
} & React.ComponentProps<typeof Input>) {
	const field = useFieldContext<string>();
	const { isTouched, isValid, errors } = field.state.meta;
	const invalid = isTouched && !isValid;

	return (
		<Field required={required} invalid={invalid} name={field.name}>
			<FieldLabel>{label}</FieldLabel>
			<FieldControl
				value={field.state.value}
				onValueChange={(v) => field.handleChange(format ? format(v) : v)}
				onBlur={field.handleBlur}
				render={<Input {...props} />}
			/>
			{invalid && (
				<p className="text-sm text-destructive">
					{/* Standard Schema (zod) errors are objects, not strings */}
					{errors
						.map((e) => (typeof e === "string" ? e : e?.message))
						.join(", ")}
				</p>
			)}
		</Field>
	);
}
