import "./Operators.css";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/", label: "Trang chủ", icon: "🏠" },
  { to: "/trips", label: "Tìm chuyến", icon: "🚌" },
  { to: "/employee", label: "Nhân viên", icon: "👨‍💻" },
  { to: "/operators", label: "Nhà xe", icon: "🚐" },
];
function Operators() {
  const navigate = useNavigate();

  const ClickAddOperator = () => {
    navigate("/operators/addoperator");
  };

  const handleEdit = (id) => {
    navigate("/operators/updateoperator", { state: { id } });
  };

  const [dsOperators, setDsOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8089/api/operators");
        setDsOperators(response.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu nhà xe!");
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  const [selectedIds, setSelectedIds] = useState([]);
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một nhà xe để xóa!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa các mục đã chọn?")) {
      return;
    }

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://localhost:8089/api/operators/${id}`)
        )
      );

      alert("Xóa thành công!");
      const response = await axios.get("http://localhost:8089/api/operators");
      setDsOperators(response.data);
      setSelectedIds([]);
    } catch (error) {
      console.error("Lỗi khi xóa nhà xe:", error);
      alert("Xóa thất bại, vui lòng thử lại!");
    }
  };

  // Tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchTerm.trim() === "") {
        const response = await axios.get("http://localhost:8089/api/operators");
        setDsOperators(response.data);
        return;
      }
      const response = await axios.get(
        `http://localhost:8089/api/operators/search?keyword=${searchTerm}`
      );
      setDsOperators(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      alert("Không tìm thấy nhà xe nào!");
    }
  };

  const ReloadOperators = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8089/api/operators");
      setDsOperators(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu nhà xe!");
    } finally {
      setLoading(false);
    }
  };
  const { isAuthed, fullName, logout } = useAuth();
  const { pathname } = useLocation();
  return (
    <>
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

        <div className="col-md-10 operation">
          <div className="bg-white border-bottom p-3 mb-3">
            <div className="row align-items-center">
              <div className="col-auto" onClick={ClickAddOperator}>
                <a className="btn btn-outline-primary">
                  <i className="bi bi-plus-circle"></i> Thêm
                </a>
              </div>

              <div className="col-auto" onClick={ReloadOperators}>
                <a className="btn btn-success">
                  <i className="bi bi-arrow-clockwise"></i> Làm mới
                </a>
              </div>

              <div className="col">
                <form
                  className="d-flex justify-content-end"
                  onSubmit={handleSearch}
                >
                  <div className="input-group" style={{ width: "300px" }}>
                    <input
                      type="text"
                      name="searchString"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control"
                      placeholder="Nhập tên nhà xe hoặc hotline..."
                    />
                    <button type="submit" className="btn btn-outline-secondary">
                      <i className="bi bi-search"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {loading && <p>Đang tải dữ liệu...</p>}
          {error && <p className="text-danger">{error}</p>}

          <form>
            <div className="mb-3">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleDeleteSelected}
              >
                <i className="bi bi-trash"></i> Xóa mục đã chọn
              </button>
            </div>

            <div className="px-3">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="selectAll"
                          checked={
                            selectedIds.length === dsOperators.length &&
                            dsOperators.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(dsOperators.map((op) => op.id));
                            } else {
                              setSelectedIds([]);
                            }
                          }}
                        />
                      </th>
                      <th>Id</th>
                      <th>Tên nhà xe</th>
                      <th>Hotline</th>
                      <th>Địa chỉ</th>
                      <th>Mô tả</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dsOperators.length > 0 ? (
                      dsOperators
                        .filter((op) => op.status === "ACTIVE") // Chỉ hiển thị nhà xe đang hoạt động
                        .map((op) => (
                          <tr key={op.id}>
                            <td>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedIds.includes(op.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedIds((prev) => [...prev, op.id]);
                                  } else {
                                    setSelectedIds((prev) =>
                                      prev.filter((item) => item !== op.id)
                                    );
                                  }
                                }}
                              />
                            </td>
                            <td>{op.id}</td>
                            <td>{op.name}</td>
                            <td>{op.hotline || "-"}</td>
                            <td>{op.address || "-"}</td>
                            <td>
                              {op.description
                                ? op.description.length > 50
                                  ? op.description.substring(0, 50) + "..."
                                  : op.description
                                : "-"}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  op.status === "ACTIVE"
                                    ? "bg-success"
                                    : "bg-secondary"
                                }`}
                              >
                                {op.status}
                              </span>
                            </td>
                            <td className="d-flex justify-content-center align-items-center">
                              <div className="btn-group" role="group">
                                <a
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEdit(op.id)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
                          Không có dữ liệu nhà xe
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Operators;
