import "./UpdateOperator.css";
import "./operatorShared.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import HomeContainerLayout from "../../components/HomeContainerLayout";

function UpdateOperator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    hotline: "",
    address: "",
    description: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8089/api/operators/${id}`)
        .then((res) => {
          const op = res.data;
          setFormData({
            name: op.name || "",
            hotline: op.hotline || "",
            address: op.address || "",
            description: op.description || "",
            status: op.status || "ACTIVE",
          });
        })
        .catch((err) => {
          console.error("Lỗi tải nhà xe:", err);
          alert("Không thể tải thông tin nhà xe!");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    if (id) {
      axios
        .get(`http://localhost:8089/api/operators/${id}`)
        .then((res) => {
          const op = res.data;
          setFormData({
            name: op.name || "",
            hotline: op.hotline || "",
            address: op.address || "",
            description: op.description || "",
            status: op.status || "ACTIVE",
          });
        })
        .catch((err) => console.error("Lỗi tải nhà xe:", err));
    }
  };

  const Clickcomebackoperator = () => {
    navigate("/operators");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || formData.name.trim() === "") {
      alert("Vui lòng nhập tên nhà xe!");
      return;
    }

    try {
      await axios.put(`http://localhost:8089/api/operators/${id}`, {
        name: formData.name.trim(),
        hotline: formData.hotline || null,
        address: formData.address || null,
        description: formData.description || null,
        status: formData.status,
      });

      alert("Cập nhật thành công!");
      navigate("/operators");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      const errorMessage =
        err.response?.data || "Không thể cập nhật nhà xe, vui lòng thử lại!";
      alert(errorMessage);
    }
  };

  const headerContent = (
    <div className="header-wrapper">
      <div className="header-inner">
        <div className="header-left">
          <div className="lang">
            <span className="flag">✏️</span>
            <span className="text">Update</span>
          </div>
        </div>
        <div className="header-center">
          <h2 className="route">Cập nhật nhà xe</h2>
          <p className="date">Điều chỉnh thông tin đối tác hiện có</p>
        </div>
        <div className="header-right">
          <div className="profile">
            <span className="avatar">🧑‍💼</span>
            <span className="name">Operator Admin</span>
          </div>
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <div className="operator-right-stack">
      <div className="operator-summary-card">
        <h3>Nhắc nhở quan trọng</h3>
        <p>Thay đổi trạng thái sẽ ảnh hưởng trực tiếp tới khả năng hiển thị trong danh sách.</p>
        <ul className="operator-summary-list">
          <li>
            <span>Lần cập nhật gần nhất</span>
            <span>{formData.name ? "Vừa tải" : "--"}</span>
          </li>
          <li>
            <span>Trạng thái hiện tại</span>
            <span>{formData.status || "ACTIVE"}</span>
          </li>
        </ul>
      </div>
      <div className="operator-side-note">
        Nếu nhà xe tạm ngưng hoạt động, hãy chuyển sang trạng thái <strong>INACTIVE</strong> thay vì xoá
        để giữ lịch sử dữ liệu.
      </div>
    </div>
  );

  const leftContent = (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Cập nhật nhà xe</h2>
        <button className="btn btn-primary" type="button" onClick={handleReset}>
          <i className="bi bi-arrow-repeat"></i> Làm mới
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form>
            <h5 className="border-bottom pb-2 mb-3">
              <i className="bi bi-bus-front text-primary"></i> Thông Tin Nhà Xe
            </h5>

            <div className="row">
              <div className="col-md-12 form-grid">
                <div className="mb-3">
                  <label className="form-label">
                    Tên nhà xe <span className="text-danger">*</span>
                  </label>
                  <input
                    name="name"
                    className="form-control"
                    placeholder="Nhập tên nhà xe (bắt buộc)"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Hotline</label>
                  <input
                    name="hotline"
                    className="form-control"
                    placeholder="Nhập số hotline"
                    value={formData.hotline}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    name="address"
                    className="form-control"
                    placeholder="Nhập địa chỉ"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    name="description"
                    className="form-control"
                    placeholder="Nhập mô tả về nhà xe"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select
                    name="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-top pt-4 mt-4">
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={Clickcomebackoperator}
                >
                  <i className="bi bi-x-circle"></i> Hủy
                </button>

                <button
                  type="submit"
                  className="btn btn-danger px-4"
                  onClick={handleSubmit}
                >
                  <i className="bi bi-check-circle"></i> Lưu nhà xe
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
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

export default UpdateOperator;
