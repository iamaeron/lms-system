import { useLayoutEffect, useRef } from "react";
import { Outlet } from "react-router";
import AppLayoutHeader from "@/components/layout/header/app-layout.header";
import Sidebar from "@/components/layout/sidebar";

export default function AppLayout() {
	const mainRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		if (mainRef.current) mainRef.current.scrollTop = 0;
	}, []);

	return (
		<div className="flex h-screen overflow-hidden bg-zinc-100">
			<Sidebar />

			<main
				ref={mainRef}
				className="m-2 min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain rounded-2xl bg-white"
			>
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
