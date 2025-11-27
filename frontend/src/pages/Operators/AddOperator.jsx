import "./AddOperator.css";
import "./operatorShared.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import HomeContainerLayout from "../../components/HomeContainerLayout";

function AddOperator() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    hotline: "",
    address: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      hotline: "",
      address: "",
      description: "",
    });
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
      await axios.post("http://localhost:8089/api/operators", {
        name: formData.name.trim(),
        hotline: formData.hotline || null,
        address: formData.address || null,
        description: formData.description || null,
      });

      alert("Thêm nhà xe thành công!");
      navigate("/operators");
    } catch (err) {
      console.error("Lỗi khi thêm nhà xe:", err);
      const errorMessage =
        err.response?.data || "Không thể thêm nhà xe, vui lòng thử lại!";
      alert(errorMessage);
    }
  };

  const headerContent = (
    <div className="header-wrapper">
      <div className="header-inner">
        <div className="header-left">
          <div className="lang">
            <span className="flag">➕</span>
            <span className="text">Create</span>
          </div>
        </div>
        <div className="header-center">
          <h2 className="route">Thêm nhà xe mới</h2>
          <p className="date">Bổ sung đối tác vận hành vào hệ thống</p>
        </div>
        <div className="header-right">
          <div className="profile">
            <span className="avatar">👩‍💼</span>
            <span className="name">Operator Admin</span>
          </div>
        </div>
      </div>
    </div>
  );

  const rightContent = (
    <div className="operator-right-stack">
      <div className="operator-summary-card">
        <h3>Gợi ý thông tin</h3>
        <p>Nhập đầy đủ tên, hotline, địa chỉ và mô tả để người dùng dễ dàng liên hệ.</p>
        <ul className="operator-summary-list">
          <li>
            <span>Trạng thái mặc định</span>
            <span>ACTIVE</span>
          </li>
          <li>
            <span>Hotline</span>
            <span>Tùy chọn</span>
          </li>
        </ul>
      </div>
      <div className="operator-side-note">
        Sau khi lưu, thông tin nhà xe sẽ xuất hiện ngay trong danh sách. Bạn có thể chỉnh sửa
        bất cứ lúc nào ở màn hình “Cập nhật nhà xe”.
      </div>
    </div>
  );

  const leftContent = (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Thêm nhà xe mới</h2>
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

export default AddOperator;
