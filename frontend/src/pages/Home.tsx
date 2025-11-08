import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { loginApi } from '../lib/api';
import { useAuth } from "../context/AuthContext";
import "./home.css";

export default function Home() {
  const nav = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Tạm thời chỉ điều hướng và show alert – khi có API sẽ gọi thật
    if (!from || !to || !date) return alert("Nhập đầy đủ điểm đi, điểm đến và ngày.");
    nav(`/trips?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  return (
    <div className="home">
      {/* NAVBAR */}
      <header className="nav">
        <div className="brand" onClick={() => nav("/")}>LongDistanceBus</div>
        <nav className="links">
          <Link to="/login" className="btn ghost">Đăng nhập</Link>
          <Link to="/register" className="btn primary">Đăng ký</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Đặt vé xe đường dài dễ dàng</h1>
        <p>Chọn tuyến phù hợp, giữ chỗ nhanh, thanh toán an toàn.</p>

        {/* SEARCH CARD */}
        <form className="card" onSubmit={onSearch}>
          <div className="row">
            <label>
              Điểm đi
              <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="VD: Bến xe Miền Đông" />
            </label>
            <label>
              Điểm đến
              <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="VD: Bến xe Cần Thơ" />
            </label>
            <label>
              Ngày đi
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
          </div>
          <button type="submit" className="btn search">Tìm chuyến</button>
        </form>
      </section>

      {/* SECTIONS DEMO */}
      <section className="grid">
        <div className="tile">
          <h3>Tuyến phổ biến</h3>
          <ul>
            <li>TP.HCM → Cần Thơ</li>
            <li>TP.HCM → Nha Trang</li>
            <li>Hà Nội → Hải Phòng</li>
          </ul>
        </div>
        <div className="tile">
          <h3>Ưu đãi nổi bật</h3>
          <p>Giảm 10% cho chuyến đi trong tuần • Áp dụng đến 30/12</p>
        </div>
        <div className="tile">
          <h3>Tin tức</h3>
          <p>Ra mắt tính năng chọn ghế trực quan – cập nhật 11/2025</p>
        </div>
      </section>

      <footer className="foot">© {new Date().getFullYear()} LongDistanceBus</footer>
    </div>
  );
}
