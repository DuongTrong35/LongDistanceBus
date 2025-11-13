import "./Staff.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Staff() {
  const navigate = useNavigate();
  const ClickAddStaff = () => {
    navigate("/employee/addemployee");
  };

  const [editedIds, setEditedIds] = useState([]);
  //   const handleEdit = (id) => {
  //   setEditedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  //   navigate("/employee/edit", { state: { id } });
  // };
  const handleEdit = (id) => {
    navigate("/employee/updateemployee", { state: { id } });
  };

  const [dsnhanvien, setDsNhanVien] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNhanVien = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8083/api/employees");
        setDsNhanVien(response.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu nhân viên!");
      } finally {
        setLoading(false);
      }
    };

    fetchNhanVien();
  }, []);

  const [selectedIds, setSelectedIds] = useState([]);
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một nhân viên để xóa!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa các mục đã chọn?")) {
      return;
    }

    try {
      // Gọi API xóa từng nhân viên
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://localhost:8083/api/employees/${id}`)
        )
      );

      alert("Xóa thành công!");
      // Làm mới danh sách
      const response = await axios.get("http://localhost:8083/api/employees");
      setDsNhanVien(response.data);
      setSelectedIds([]);
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
      alert("Xóa thất bại, vui lòng thử lại!");
    }
  };

  // Tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchTerm.trim() === "") {
        // Nếu ô tìm kiếm trống → load lại toàn bộ nhân viên
        const response = await axios.get("http://localhost:8083/api/employees");
        setDsNhanVien(response.data);
        return;
      }
      // Nếu có nội dung tìm kiếm → gọi API search
      const response = await axios.get(
        `http://localhost:8083/api/employees/search?keyword=${searchTerm}`
      );
      setDsNhanVien(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      alert("Không tìm thấy nhân viên nào!");
    }
  };
  const ReloadStaff = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8083/api/employees");
      setDsNhanVien(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu nhân viên!");
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   ReloadStaff();
  // }, []);

  return (
    <div className="col-md-12">
      <div className="bg-white border-bottom p-3 mb-3">
        <div className="row align-items-center">
          <div className="col-auto" onClick={ClickAddStaff}>
            <a className="btn btn-outline-primary">
              <i className="bi bi-plus-circle"></i> Thêm
            </a>
          </div>

          <div className="col-auto" onClick={ReloadStaff}>
            <a className="btn btn-success">
              <i className="bi bi-plus-circle"></i> Làm mới
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
                  placeholder="Nhập tên, SĐT hoặc email..."
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
                        selectedIds.length === dsnhanvien.length &&
                        dsnhanvien.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(dsnhanvien.map((nv) => nv.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                    />
                  </th>
                  <th>Id</th>
                  <th>Id tài khoản</th>
                  <th>Họ</th>
                  <th>Tên</th>
                  <th>Giới tính</th>
                  <th>Ngày sinh</th>
                  <th>CMND</th>
                  <th>SĐT</th>
                  <th>Email</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {dsnhanvien.length > 0 ? (
                  dsnhanvien
                    .filter((nv) => nv.tinhtrang === 1) // lọc chỉ lấy những nhân viên có tình trạng = 1
                    .map((nv) => (
                      <tr key={nv.id}>
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedIds.includes(nv.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds((prev) => [...prev, nv.id]);
                              } else {
                                setSelectedIds((prev) =>
                                  prev.filter((item) => item !== nv.id)
                                );
                              }
                            }}
                          />
                        </td>
                        <td>{nv.id}</td>
                        <td>{nv.userid}</td>
                        <td>{nv.honv}</td>
                        <td>{nv.tennv}</td>
                        <td>{nv.gioitinh}</td>
                        <td>
                          {new Date(nv.ngaysinh).toLocaleDateString("vi-VN")}
                        </td>
                        <td>{nv.cmnd}</td>
                        <td>{nv.sdt}</td>
                        <td>{nv.email}</td>
                        <td className="d-flex justify-content-center align-items-center">
                          <div className="btn-group" role="group">
                            <a
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleEdit(nv.id)}
                            >
                              <i className="bi bi-pencil"></i>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center">
                      Không có dữ liệu nhân viên
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
}

export default Staff;
