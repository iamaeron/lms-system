import { AddIcon, MagnifierIcon } from "@solar-icons/react/linear";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TeacherClassrooms() {
	return (
		<div>
			<div className="flex items-center justify-between">
				<Input
					wrapperClassName="max-w-xs"
					placeholder="Search for a class ..."
					leftSection={<MagnifierIcon strokeWidth={2} size={16} />}
					rightSection={<span className="text-sm">Ctrl K</span>}
				/>

				<div>
					<Button>
						<AddIcon />
						New Class
					</Button>
				</div>
			</div>
		</div>
	);
}
