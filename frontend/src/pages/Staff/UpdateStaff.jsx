import "./AddStaff.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function UpdateStaff() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; 

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

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8083/api/employees/${id}`)
        .then((res) => {
          const nv = res.data;
          setFormData({
            maNV: nv.id,
            hoNV: nv.honv || "",
            tenNV: nv.tennv || "",
            gioiTinh: nv.gioitinh || "",
            ngaySinh: nv.ngaysinh ? nv.ngaysinh.substring(0, 10) : "",
            cmnd: nv.cmnd || "",
            soDT: nv.sdt || "",
            email: nv.email || "",
            chucVu: nv.chucvu || "",
          });
        })
        .catch((err) => console.error("Lỗi tải nhân viên:", err));
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

  const Clickcomebackstaff = () => {
    navigate("/employee");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8083/api/employees/${id}`, {
        id: formData.maNV,
        honv: formData.hoNV,
        tennv: formData.tenNV,
        gioitinh: formData.gioiTinh,
        ngaysinh: formData.ngaySinh,
        cmnd: formData.cmnd,
        sdt: formData.soDT,
        email: formData.email,
        chucvu: formData.chucVu,
      })
      .then(() => {
        alert("Cập nhật thành công!");
        navigate("/employee");
      })
      .catch((err) => console.error("Lỗi cập nhật:", err));
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Cập nhật thành viên</h2>
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
                  <i className="bi bi-check-circle" ></i> Lưu nhân viên
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateStaff;
