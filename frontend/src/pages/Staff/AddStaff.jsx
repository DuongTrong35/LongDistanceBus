import "./AddStaff.css";
import { useNavigate , Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import axios from "axios";
const navItems = [
  { to: "/", label: "Trang chủ", icon: "🏠" },
  { to: "/trips", label: "Tìm chuyến", icon: "🚌" },
  { to: "/employee", label: "Nhân viên", icon: "👨‍💻" },
  { to: "/operators", label: "Nhà xe", icon: "🚐" },
];
function AddStaff() {
  const navigate = useNavigate();
  const { isAuthed, fullName, logout } = useAuth();
  const { pathname } = useLocation();
  // Khởi tạo state lưu dữ liệu form
  const [formData, setFormData] = useState({
    maNV: "",
    hoNV: "",
    tenNV: "",
    gioiTinh: "",
    ngaySinh: "",
    cmnd: "",
    soDT: "",
    email: "",
    chucVu: "",
  });

  // Xử lý khi nhập vào input hoặc chọn select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Nút làm mới - xóa toàn bộ dữ liệu form
  const handleReset = () => {
    setFormData({
      maNV: "",
      hoNV: "",
      tenNV: "",
      gioiTinh: "",
      ngaySinh: "",
      cmnd: "",
      soDT: "",
      email: "",
      chucVu: "",
    });
  };

  // Nút hủy quay lại trang danh sách
  const Clickcomebackstaff = () => {
    navigate("/employee");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8083/api/employees", {
        id: formData.maNV,
        honv: formData.hoNV,
        tennv: formData.tenNV,
        gioitinh: formData.gioiTinh,
        ngaysinh: formData.ngaySinh,
        cmnd: formData.cmnd,
        sdt: formData.soDT,
        email: formData.email,
        chucvu: formData.chucVu,
        tinhtrang: 1, // ✅ Mặc định là 1 (đang hoạt động)
      });

      alert("Thêm nhân viên thành công!");
      navigate("/employee");
    } catch (err) {
      console.error("Lỗi khi thêm nhân viên:", err);
      alert("Không thể thêm nhân viên, vui lòng thử lại!");
    }
  };
  return (
    <div className="Homecontainer">
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
                  <Link
                    key={item.to}
                    to={item.to}
                    className={
                      "sidenav__link" + (pathname === item.to ? " active" : "")
                    }
                  >
                    <span className="sidenav__icon" aria-hidden>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div className="sidenav__spacer" />
                {!isAuthed ? (
                  <div className="sidenav__auth">
                    <Link to="/login" className="sidenav__link">
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="sidenav__link">
                      Đăng ký
                    </Link>
                  </div>
                ) : (
                  <button className="sidenav__logout" onClick={logout}>
                    Đăng xuất
                  </button>
                )}
              </nav>
            </aside>
    <div className="container-fluid p-4 addstaff">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Thêm nhân viên mới</h2>
        <button className="btn btn-primary" type="button" onClick={handleReset}>
          <i className="bi bi-arrow-repeat"></i> Làm mới
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form>
            <h5 className="border-bottom pb-2 mb-3">
              <i className="bi bi-person text-primary"></i> Thông Tin Cơ Bản
            </h5>

            <div className="row">
              <div className="col-md-12 form-grid">
                <div className="mb-3">
                  <label className="form-label">Mã nhân viên</label>
                  <input
                    name="maNV"
                    className="form-control"
                    placeholder="Nhập mã nhân viên"
                    value={formData.maNV}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Họ nhân viên</label>
                  <input
                    name="hoNV"
                    className="form-control"
                    placeholder="Nhập họ nhân viên"
                    value={formData.hoNV}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tên nhân viên</label>
                  <input
                    name="tenNV"
                    className="form-control"
                    placeholder="Nhập tên nhân viên"
                    value={formData.tenNV}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Giới tính</label>
                  <select
                    name="gioiTinh"
                    className="form-select"
                    value={formData.gioiTinh}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn giới tính --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    name="ngaySinh"
                    type="date"
                    className="form-control"
                    value={formData.ngaySinh}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Chứng minh nhân dân</label>
                  <input
                    name="cmnd"
                    className="form-control"
                    placeholder="Nhập chứng minh nhân dân"
                    value={formData.cmnd}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    name="soDT"
                    className="form-control"
                    placeholder="Nhập số điện thoại"
                    value={formData.soDT}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    className="form-control"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Chức vụ</label>
                  <input
                    name="chucVu"
                    className="form-control"
                    placeholder="Nhập chức vụ"
                    value={formData.chucVu}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="border-top pt-4 mt-4">
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={Clickcomebackstaff}
                >
                  <i className="bi bi-x-circle"></i> Hủy
                </button>

                <button type="submit" className="btn btn-danger px-4" onClick={handleSubmit}>
                  <i className="bi bi-check-circle"></i> Lưu nhân viên
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default AddStaff;
