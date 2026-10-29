import { Outlet } from "react-router";
import AppLayoutHeader from "@/components/layout/header/app-layout.header";
import Sidebar from "@/components/layout/sidebar";

export default function AppLayout() {
	return (
		<div className="min-h-screen flex bg-zinc-50">
			<Sidebar />

			{/* 2. Main Content Area where nested child routes render */}
			<main className="flex-1 w-full">
				<div className="max-w-5xl mx-auto">
					<AppLayoutHeader />
					<div className="p-4">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
}
