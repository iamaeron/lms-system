import { AltArrowDownIcon, CheckIcon } from "@solar-icons/react/linear";
import { useFieldContext } from "@/lib/form";
import { Field, FieldControl, FieldLabel } from "../../ui/field";
import {
	Select,
	SelectItem,
	SelectItemIndicator,
	SelectItemText,
	SelectList,
	SelectPopup,
	SelectPortal,
	SelectPositioner,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";

type SelectOption = {
	label: string;
	value: string;
};

export function SelectField({
	label,
	required,
	options,
	placeholder,
}: {
	label: string;
	required?: boolean;
	options: SelectOption[];
	placeholder?: string;
}) {
	const field = useFieldContext<string>();
	const { isTouched, isValid, errors } = field.state.meta;
	const invalid = isTouched && !isValid;

	return (
		<Field required={required} invalid={invalid} name={field.name}>
			<Select
				modal={false}
				value={field.state.value || null}
				onValueChange={(value) => {
					if (value !== null) {
						field.handleChange(value);
					}
				}}
				items={options}
			>
				<FieldLabel>{label}</FieldLabel>
				<FieldControl
					render={
						<SelectTrigger
							className="w-full min-w-0"
							aria-invalid={invalid || undefined}
							onBlur={field.handleBlur}
						>
							<SelectValue placeholder={placeholder} />
							<AltArrowDownIcon strokeWidth={2} size={16} />
						</SelectTrigger>
					}
				/>
				<SelectPortal>
					<SelectPositioner>
						<SelectPopup>
							<SelectList>
								{options.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										<SelectItemText>{option.label}</SelectItemText>
										<SelectItemIndicator>
											<CheckIcon strokeWidth={2} size={16} />
										</SelectItemIndicator>
									</SelectItem>
								))}
							</SelectList>
						</SelectPopup>
					</SelectPositioner>
				</SelectPortal>
			</Select>
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
