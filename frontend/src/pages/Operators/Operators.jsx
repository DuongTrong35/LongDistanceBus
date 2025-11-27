import "./Operators.css";
import "./operatorShared.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import HomeContainerLayout from "../../components/HomeContainerLayout";

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

  const total = dsOperators.length;
  const activeCount = dsOperators.filter((op) => op.status === "ACTIVE").length;
  const inactiveCount = total - activeCount;

  // Không dùng header khi nằm trong AppShell
  const headerContent = null;

  const rightContent = (
    <div className="operator-right-stack">
      <div className="operator-summary-card">
        <h3>Trạng thái hệ thống</h3>
        <ul className="operator-summary-list">
          <li>
            <span>Tổng số nhà xe</span>
            <span>{total}</span>
          </li>
          <li>
            <span>Đang hoạt động</span>
            <span>{activeCount}</span>
          </li>
          <li>
            <span>Tạm dừng</span>
            <span>{inactiveCount}</span>
          </li>
        </ul>
      </div>

      <div className="operator-side-note">
        <strong>Mẹo nhanh:</strong> Sử dụng ô tìm kiếm để lọc nhanh theo tên hoặc hotline.
        Luôn kiểm tra lại thông tin trước khi xoá vì thao tác này không thể hoàn tác.
      </div>
    </div>
  );

  const leftContent = (
    <div className="col-md-12">
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
                        <td style={{ textAlign: "center" }}>
                          <a
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleEdit(op.id)}
                            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          >
                            <i className="bi bi-pencil"></i>
                          </a>
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
  );

  return (
    <HomeContainerLayout
      headerContent={headerContent}
      leftContent={leftContent}
      rightContent={rightContent}
    />
  );
}

export default Operators;


