import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
	{ to: "/", label: "Trang chủ", icon: "🏠" },
	{ to: "/trips", label: "Tìm chuyến", icon: "🚌" },
];

export default function Sidebar() {
	const { isAuthed, fullName, logout } = useAuth();
	const { pathname } = useLocation();
	return (
		<aside className="sidenav">
			<div className="sidenav__brand">
				<div className="avatar">{fullName ? fullName[0] : "G"}</div>
				<div className="brand__text">
					<div className="brand__name">{fullName || "Guest"}</div>
					<div className="brand__role">{isAuthed ? "USER" : "GUEST"}</div>
				</div>
			</div>
			<nav className="sidenav__nav">
				{navItems.map((item) => (
					<Link key={item.to} to={item.to} className={"sidenav__link" + (pathname === item.to ? " active" : "") }>
						<span className="sidenav__icon" aria-hidden>{item.icon}</span>
						<span>{item.label}</span>
					</Link>
				))}
				<div className="sidenav__spacer" />
				{!isAuthed ? (
					<div className="sidenav__auth">
						<Link to="/login" className="sidenav__link">Đăng nhập</Link>
						<Link to="/register" className="sidenav__link">Đăng ký</Link>
					</div>
				) : (
					<button className="sidenav__logout" onClick={logout}>Đăng xuất</button>
				)}
			</nav>
		</aside>
	);
}

