import { Outlet } from "react-router";
import AppLayoutHeader from "@/components/layout/header/app-layout.header";
import Sidebar from "@/components/layout/sidebar";

export default function AppLayout() {
	return (
		<div className="flex h-screen overflow-hidden bg-zinc-100">
			<Sidebar />

			<main className="m-2 min-w-0 flex-1 overflow-y-auto rounded-2xl bg-white">
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
