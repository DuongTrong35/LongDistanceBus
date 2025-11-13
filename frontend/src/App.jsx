// client/frontend/src/App.jsx
import "./App.css";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import RequireAuth from "./context/RequireAuth";
import AppShell from "./components/AppShell";
import Staff from "./pages/Staff/Staff"
import AddStaff from "./pages/Staff/AddStaff"
import UpdateStaff from "./pages/Staff/UpdateStaff"

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // nếu muốn xài icon
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // nếu có xài dropdown/modal

export default function App() {
	return (
		<Routes>
			<Route element={<AppShell />}>
				<Route path="/" element={<Home />} />
				<Route path="/trips" element={<Trips />} />
				<Route path="/trips/:id" element={<TripDetail />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/employee" element={<Staff />} />
				<Route path="/employee/addemployee" element={<AddStaff />} />
				<Route path="/employee/updateemployee" element={<UpdateStaff />} />

				{/* Example: protect booking detail if needed */}
				<Route path="/secure/trips" element={<RequireAuth><Trips/></RequireAuth>} />
				<Route path="/secure/trips/:id" element={<RequireAuth><TripDetail/></RequireAuth>} />
			</Route>
		</Routes>
	);
}

