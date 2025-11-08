// client/frontend/src/App.tsx
import { Routes, Route, Link, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import RequireAuth from "./context/RequireAuth";
import { useAuth } from "./context/AuthContext";

function Layout() {
  const { fullName, isAuthed, logout } = useAuth();

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ display:"flex", gap:12, alignItems:"center" }}>
        <Link to="/">Trang chủ</Link>
        <Link to="/trips">Tìm chuyến</Link>
        {!isAuthed ? (
          <>
            <Link to="/login">Đăng nhập</Link>
            <Link to="/register">Đăng ký</Link>
          </>
        ) : (
          <>
            <span>Xin chào, {fullName}</span>
            <button onClick={logout}>Đăng xuất</button>
          </>
        )}
      </nav>
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:id" element={<TripDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trips" element={<RequireAuth><Trips/></RequireAuth>} />
        <Route path="/trips/:id" element={<RequireAuth><TripDetail/></RequireAuth>} />
      </Route>
    </Routes>
  );
}
