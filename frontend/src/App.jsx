// client/frontend/src/App.jsx
import "./App.css";

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Forgot from "./pages/Auth/Forgot";
import Trips from "./pages/Trips/Trips";
import TripDetail from "./pages/Trips/TripDetail";
import RequireAuth from "./context/RequireAuth";
import AppShell from "./components/AppShell";
import Staff from "./pages/Staff/Staff";
import AddStaff from "./pages/Staff/AddStaff"
import UpdateStaff from "./pages/Staff/UpdateStaff"
import SeatSelection from "./pages/FindRide/SeatSelection"
import FindRide from "./pages/FindRide/FindRide"
import Support from "./pages/Support/Support";
import Testthanhtoan from "./pages/ThanhToan/PaymentPage"
import Anyroute from "./pages/Route/Busroute"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // nếu muốn xài icon
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // nếu có xài dropdown/modal

export default function App() {
	return (
		<Routes>
			<Route>
				<Route path="/" element={<Home />} />
				<Route path="/trips" element={<Trips />} />
				<Route path="/trips/:id" element={<TripDetail />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/forgot" element={<Forgot />} />
				<Route path="/support" element={<Support />} />
				<Route path="/employee" element={<Staff />} />
				<Route path="/employee/addemployee" element={<AddStaff />} />
				<Route path="/employee/updateemployee" element={<UpdateStaff />} />
				<Route path="/test" element={<SeatSelection />} />
				<Route path="/ride" element={<FindRide />} />
				<Route path="/tt" element={<Testthanhtoan />} />
				<Route path="/cd" element={<Anyroute />} />

				{/* Example: protect booking detail if needed */}
				<Route path="/secure/trips" element={<RequireAuth><Trips/></RequireAuth>} />
				<Route path="/secure/trips/:id" element={<RequireAuth><TripDetail/></RequireAuth>} />
			</Route>
		</Routes>
	);
}

