import { EyeClosedIcon, EyeIcon } from "@solar-icons/react/linear";
import { useState } from "react";
import { ActionIcon } from "@/components/ui/action-icon";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxIndicator } from "@/components/ui/checkbox";
import { Field, FieldControl, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignInMutation } from "@/lib/mutations/auth.mutation";

export default function Signin() {
	const [viewPass, setViewPass] = useState(false);
	const { mutate: signIn, isPending } = useSignInMutation();

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		signIn({
			password: formData.get("password") as string,
			email: formData.get("email") as string,
			rememberMe: formData.get("remember_me") !== null,
		});
	};

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="max-w-md px-4 mx-auto w-full">
				<h1 className="text-zinc-700 text-2xl font-medium mb-4 tracking-tight">
					Sign in to your account
				</h1>

				<form onSubmit={handleSubmit} className="w-full space-y-4">
					<Field>
						<FieldLabel>Email</FieldLabel>
						<FieldControl
							name="email"
							required
							placeholder="example@email.com"
							render={<Input />}
						/>
					</Field>

					<Field>
						<FieldLabel>Password</FieldLabel>
						<FieldControl
							type={viewPass ? "text" : "password"}
							name="password"
							required
							placeholder="Enter your password"
							render={
								<Input
									rightSection={
										<ActionIcon
											type="button"
											variant="ghost"
											size="sm"
											className="-mr-1"
											onClick={() => setViewPass(!viewPass)}
										>
											{viewPass ? (
												<EyeClosedIcon size={20} />
											) : (
												<EyeIcon size={20} />
											)}
										</ActionIcon>
									}
								/>
							}
						/>
					</Field>

					<div>
						<Field className="flex-row items-center gap-0">
							<Checkbox id="remember">
								<CheckboxIndicator />
							</Checkbox>
							<FieldLabel htmlFor="remember">Remember me</FieldLabel>
						</Field>
					</div>

					<Button
						type="submit"
						disabled={isPending}
						loading={isPending}
						className="w-full"
					>
						Sign in
					</Button>
				</form>
				<p className="text-zinc-500 text-xs text-center mt-2 w-full">
					Forgot your password? Please head to the IT office to for a new one.
				</p>
			</div>
		</div>
	);
}
