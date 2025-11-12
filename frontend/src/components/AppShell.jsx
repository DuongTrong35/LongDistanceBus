import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppShell() {
	return (
		<div className="app-shell">
			<Sidebar />
			<main className="app-content">
				<header className="app-header">
					<h1 className="app-title">Long Distance Bus</h1>
					<div className="app-header__actions" />
				</header>
				<div className="app-body">
					<Outlet />
				</div>
			</main>
		</div>
	);
}

