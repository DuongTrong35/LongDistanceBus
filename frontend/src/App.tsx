// client/frontend/src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import RequireAuth from "./context/RequireAuth";
import AppShell from "./components/AppShell";

export default function App() {
	return (
		<Routes>
			<Route element={<AppShell />}>
				<Route path="/" element={<Home />} />
				<Route path="/trips" element={<Trips />} />
				<Route path="/trips/:id" element={<TripDetail />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				{/* Example: protect booking detail if needed */}
				<Route path="/secure/trips" element={<RequireAuth><Trips/></RequireAuth>} />
				<Route path="/secure/trips/:id" element={<RequireAuth><TripDetail/></RequireAuth>} />
			</Route>
		</Routes>
	);
}
