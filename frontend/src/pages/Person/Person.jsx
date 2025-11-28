import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Home/Home.css";
import "./Person.css";
import { useAuth } from "../../context/AuthContext";
import { changePasswordApi, updateProfileApi } from "../../lib/api";

// Lịch sử vé mẫu (fake)
const fakeTickets = [
  {
    id: "LD-0001",
    code: "LD123456",
    from: "TP. HCM",
    to: "Cần Thơ",
    date: "20/11/2025",
    time: "08:00",
    seat: "B12",
    status: "Hoàn thành",
  },
  {
    id: "LD-0002",
    code: "LD123987",
    from: "Cần Thơ",
    to: "TP. HCM",
    date: "05/12/2025",
    time: "14:30",
    seat: "A03",
    status: "Hoàn thành",
  },
  {
    id: "LD-0003",
    code: "LD456789",
    from: "TP. HCM",
    to: "Đà Lạt",
    date: "24/12/2025",
    time: "21:00",
    seat: "C05",
    status: "Đã đặt",
  },
];

export default function Person() {
  const { user, fullName, isAuthed, logout, updateUser } = useAuth();
  const nav = useNavigate();

  const phone = user?.phone || "";
  const initialEmail = user?.email || "";

  const [activeTab, setActiveTab] = useState("info");

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);

  // Thông tin tài khoản
  const [profileName, setProfileName] = useState(fullName || "");
  const [profileEmail, setProfileEmail] = useState(initialEmail);
  const [birthDate, setBirthDate] = useState(user?.dateOfBirth || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  // Đổi mật khẩu
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    setProfileName(fullName || "");
    setProfileEmail(user?.email || "");
    setBirthDate(user?.dateOfBirth || "");
    setGender(user?.gender || "");
    setAvatarPreview(user?.avatar || null);
  }, [fullName, user]);

  if (!isAuthed) {
    nav("/login");
    return null;
  }

  function isValidEmail(value) {
    const trimmed = (value || "").trim();
    if (!trimmed) return true; // cho phép bỏ trống
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(trimmed);
  }

  // ------------ ĐỔI MẬT KHẨU ------------
  async function handleChangePassword(e) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPwError("Vui lòng nhập đầy đủ các trường.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setPwLoading(true);
    try {
      const res = await changePasswordApi({ oldPassword, newPassword });
      if (res && res.success) {
        setPwSuccess(res.message || "Đổi mật khẩu thành công.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPwError(
          (res && res.message) || "Không thể đổi mật khẩu, vui lòng thử lại."
        );
      }
    } catch (err) {
      setPwError(
        (err &&
          err.response &&
          err.response.data &&
          err.response.data.message) ||
          "Có lỗi xảy ra khi đổi mật khẩu."
      );
    } finally {
      setPwLoading(false);
    }
  }

  // ------------ LƯU THÔNG TIN TÀI KHOẢN ------------
  async function handleSaveProfile() {
    setProfileMsg("");
    setProfileError("");

    const trimmedName = (profileName || "").trim();
    const trimmedEmail = (profileEmail || "").trim();

    if (!trimmedName) {
      setProfileError("Họ và tên không được để trống.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setProfileError("Email không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    if (birthDate) {
      const d = new Date(birthDate);
      if (Number.isNaN(d.getTime())) {
        setProfileError("Ngày sinh không hợp lệ.");
        return;
      }
      const today = new Date();
      if (d > today) {
        setProfileError("Ngày sinh không được lớn hơn ngày hiện tại.");
        return;
      }
    }

    try {
      const res = await updateProfileApi({
        fullName: trimmedName,
        email: trimmedEmail || null,
        dateOfBirth: birthDate || null,
        gender: gender || null,
      });

      if (res && res.success) {
        const updated = res.user || {};

        updateUser({
          fullName: updated.fullName || trimmedName,
          email: updated.email || trimmedEmail || "",
          dateOfBirth: updated.dateOfBirth || birthDate || null,
          gender: updated.gender || gender || null,
          avatar: updated.avatar || avatarPreview || null,
        });

        setProfileMsg(res.message || "Đã lưu thay đổi.");
      } else {
        setProfileError(
          (res && res.message) || "Không thể lưu thay đổi."
        );
      }
    } catch (err) {
      const msg =
        (err &&
          err.response &&
          err.response.data &&
          err.response.data.message) ||
        "Có lỗi xảy ra khi lưu thông tin.";
      setProfileError(msg);
    }
  }

  // ------------ AVATAR ------------
  function handleAvatarClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleAvatarChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError(
        "File không hợp lệ. Vui lòng chọn một file hình ảnh (JPG, PNG...)."
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;

      try {
        const res = await updateProfileApi({
          avatar: dataUrl,
        });

        const updated = (res && res.user) || {};
        const nextAvatar = updated.avatar || dataUrl;

        setAvatarPreview(nextAvatar);
        updateUser({
          fullName: updated.fullName || profileName || fullName || "",
          email: updated.email || profileEmail || "",
          dateOfBirth: updated.dateOfBirth || birthDate || null,
          gender: updated.gender || gender || null,
          avatar: nextAvatar,
        });

        setProfileMsg(
          (res && res.message) || "Đã cập nhật ảnh đại diện."
        );
        setProfileError("");
      } catch (err) {
        console.error("Lỗi cập nhật avatar:", err);
        const msg =
          (err &&
            err.response &&
            err.response.data &&
            err.response.data.message) ||
          "Không thể cập nhật ảnh đại diện. Vui lòng thử lại.";
        setProfileError(msg);
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  }

  // ------------ JSX ------------
  return (
    <div className="ld-home">
      {/* HEADER */}
      <header className="ld-header">
        <div className="ld-header-inner">
          <Link to="/" className="ld-logo">
            <div className="ld-logo-square">LD</div>
            <div className="ld-logo-text">
              <div className="ld-logo-title">LONG DISTANCE BUS</div>
              <div className="ld-logo-subtitle">
                Cùng bạn trên mọi nẻo đường dài
              </div>
            </div>
          </Link>

          <nav className="ld-nav">
            <Link to="/" className="ld-nav-link">
              Trang chủ
            </Link>
            <span className="ld-nav-link">Lịch trình</span>
            <span className="ld-nav-link">Tra cứu vé</span>
            <Link to="/news" className="ld-nav-link">
              Tin tức
            </Link>
            <span className="ld-nav-link">Hóa đơn</span>
            <Link to="/support" className="ld-nav-link">
              Liên hệ
            </Link>
            <span className="ld-nav-link">Về chúng tôi</span>
          </nav>

          <div className="ld-header-auth">
            <div
              className="ld-user-chip"
              role="button"
              tabIndex={0}
              onClick={() => nav("/person")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  nav("/person");
                }
              }}
            >
              <div className="ld-user-avatar">
                {user && user.avatar ? (
                  <img src={user.avatar} alt={fullName || "Avatar"} />
                ) : fullName ? (
                  fullName.charAt(0).toUpperCase()
                ) : (
                  "U"
                )}
              </div>
              <div className="ld-user-info">
                <div className="ld-user-name">{fullName || "Người dùng"}</div>
                <button
                  type="button"
                  className="ld-user-logout"
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="ld-person-main">
        <div className="ld-person-layout">
          {/* SIDEBAR */}
          <aside className="ld-person-sidebar">
            <div className="ld-person-menu-card">
              <button
                className={
                  "ld-person-menu-item" +
                  (activeTab === "info"
                    ? " ld-person-menu-item--active"
                    : "")
                }
                onClick={() => setActiveTab("info")}
              >
                <span className="ld-person-menu-icon ld-person-menu-icon--info">
                  🧑
                </span>
                <span>Thông tin tài khoản</span>
              </button>

              <button
                className={
                  "ld-person-menu-item" +
                  (activeTab === "history"
                    ? " ld-person-menu-item--active"
                    : "")
                }
                onClick={() => setActiveTab("history")}
              >
                <span className="ld-person-menu-icon ld-person-menu-icon--history">
                  🔄
                </span>
                <span>Lịch sử mua vé</span>
              </button>

              <button
                className={
                  "ld-person-menu-item" +
                  (activeTab === "password"
                    ? " ld-person-menu-item--active"
                    : "")
                }
                onClick={() => setActiveTab("password")}
              >
                <span className="ld-person-menu-icon ld-person-menu-icon--password">
                  🔒
                </span>
                <span>Đổi mật khẩu</span>
              </button>

              <button
                className="ld-person-menu-item ld-person-menu-item--logout"
                onClick={logout}
              >
                <span className="ld-person-menu-icon ld-person-menu-icon--logout">
                  ⏻
                </span>
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="ld-person-content">
            {/* TAB: THÔNG TIN TÀI KHOẢN */}
            {activeTab === "info" && (
              <div className="ld-person-panel">
                <h1 className="ld-person-title">Thông tin tài khoản</h1>
                <p className="ld-person-desc">
                  Đây là thông tin cơ bản của tài khoản mà bạn đang sử dụng.
                </p>

                {profileError && (
                  <div className="ld-person-alert ld-person-alert--error">
                    {profileError}
                  </div>
                )}
                {profileMsg && (
                  <div className="ld-person-alert ld-person-alert--success">
                    {profileMsg}
                  </div>
                )}

                <div className="ld-person-info-grid">
                  {/* Cột trái: avatar + nút chọn ảnh */}
                  <div className="ld-person-info-left">
                    <div
                      className="ld-person-avatar-big"
                      onClick={handleAvatarClick}
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" />
                      ) : (
                        <span>
                          {fullName
                            ? fullName.charAt(0).toUpperCase()
                            : "U"}
                        </span>
                      )}
                      <div className="ld-person-avatar-edit">Đổi ảnh</div>
                    </div>

                    <button
                      type="button"
                      className="ld-person-avatar-btn"
                      onClick={handleAvatarClick}
                    >
                      Chọn ảnh
                    </button>
                    <p className="ld-person-avatar-hint">
                      Dung lượng tối đa 1 MB. Định dạng: JPG, PNG.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                    />
                  </div>

                  {/* Cột phải: form */}
                  <div className="ld-person-info-right">
                    <div className="ld-person-field-row">
                      <div className="ld-person-field-label">Họ và tên</div>
                      <div className="ld-person-field-value">
                        <input
                          type="text"
                          className="ld-person-input"
                          placeholder="Nhập họ và tên"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ld-person-field-row">
                      <div className="ld-person-field-label">Số điện thoại</div>
                      <div className="ld-person-field-value ld-person-field-value--static">
                        {phone || "—"}
                      </div>
                    </div>

                    <div className="ld-person-field-row">
                      <div className="ld-person-field-label">Email</div>
                      <div className="ld-person-field-value">
                        <input
                          type="email"
                          className="ld-person-input"
                          placeholder="Nhập email (nếu có)"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ld-person-field-row">
                      <div className="ld-person-field-label">Ngày sinh</div>
                      <div className="ld-person-field-value">
                        <input
                          type="date"
                          className="ld-person-input"
                          value={birthDate || ""}
                          onChange={(e) => setBirthDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="ld-person-field-row">
                      <div className="ld-person-field-label">Giới tính</div>
                      <div className="ld-person-field-value">
                        <select
                          className="ld-person-input ld-person-select"
                          value={gender || ""}
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                          <option value="OTHER">Khác</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ld-person-info-actions">
                  <button
                    type="button"
                    className="ld-person-btn ld-person-btn-primary"
                    onClick={handleSaveProfile}
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            )}

            {/* TAB: LỊCH SỬ MUA VÉ */}
            {activeTab === "history" && (
              <div className="ld-person-panel">
                <h1 className="ld-person-title">Lịch sử mua vé</h1>
                <p className="ld-person-desc">
                  Đây là bảng lịch sử mẫu. Sau này bạn có thể thay dữ liệu giả
                  bằng API thật từ booking-service.
                </p>

                <div className="ld-person-table-wrapper">
                  <table className="ld-person-table">
                    <thead>
                      <tr>
                        <th>Mã vé</th>
                        <th>Tuyến</th>
                        <th>Ngày đi</th>
                        <th>Giờ</th>
                        <th>Ghế</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fakeTickets.map((t) => (
                        <tr key={t.id}>
                          <td>{t.code}</td>
                          <td>
                            {t.from} → {t.to}
                          </td>
                          <td>{t.date}</td>
                          <td>{t.time}</td>
                          <td>{t.seat}</td>
                          <td>{t.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: ĐỔI MẬT KHẨU */}
            {activeTab === "password" && (
              <div className="ld-person-panel">
                <h1 className="ld-person-title">Đổi mật khẩu</h1>
                <p className="ld-person-desc">
                  Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho bất
                  kỳ ai.
                </p>
                <p className="ld-person-desc-small">
                  Nếu bạn quên mật khẩu hiện tại, hãy{" "}
                  <Link to="/forgot" className="ld-person-link">
                    sử dụng chức năng "Quên mật khẩu"
                  </Link>{" "}
                  tại trang đăng nhập.
                </p>
                {pwError && (
                  <div className="ld-person-alert ld-person-alert--error">
                    {pwError}
                  </div>
                )}
                {pwSuccess && (
                  <div className="ld-person-alert ld-person-alert--success">
                    {pwSuccess}
                  </div>
                )}

                <form
                  className="ld-person-form"
                  onSubmit={handleChangePassword}
                >
                  <div className="ld-person-form-row">
                    <label className="ld-person-label">Mật khẩu cũ</label>
                    <input
                      type="password"
                      className="ld-person-input"
                      placeholder="Nhập mật khẩu cũ"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>

                  <div className="ld-person-form-row">
                    <label className="ld-person-label">Mật khẩu mới</label>
                    <input
                      type="password"
                      className="ld-person-input"
                      placeholder="Nhập mật khẩu mới"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="ld-person-form-row">
                    <label className="ld-person-label">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="ld-person-input"
                      placeholder="Nhập lại mật khẩu mới"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="ld-person-form-actions">
                    <button
                      type="button"
                      className="ld-person-btn ld-person-btn-secondary"
                      onClick={() => {
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setPwError("");
                        setPwSuccess("");
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="ld-person-btn ld-person-btn-primary"
                      disabled={pwLoading}
                    >
                      {pwLoading ? "Đang xử lý..." : "Xác nhận"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
