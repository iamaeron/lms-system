import { useFormContext } from "@/lib/form";
import { Button } from "../ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(s) => s.isSubmitting}>
			{(isSubmitting) => (
				<Button type="submit" loading={isSubmitting}>
					{children}
				</Button>
			)}
		</form.Subscribe>
	);
}
