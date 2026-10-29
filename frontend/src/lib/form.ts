import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { SelectField } from "@/components/form/select-field";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";

const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

const { useAppForm } = createFormHook({
	fieldComponents: {
		SelectField,
		TextField,
		TextareaField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});

export { useAppForm, useFieldContext, useFormContext };
