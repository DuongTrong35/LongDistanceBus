import React, { useState, useEffect} from "react";
import axios from "axios";
import "./Busroute.css";
import logoweb from "../../assets/konoha.png";
import { useNavigate } from "react-router-dom";

function Busroute() {
    const [diemDiInput, setDiemDiInput] = useState("");
const [diemDenInput, setDiemDenInput] = useState("");


      const navigate = useNavigate();
  const handleFindTrip = (id) => {
    // navigate(`/timchuyenxe/${id}`);
    console.log("Test:", id);
  };

  const [dscd, setdscd] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  useEffect(() => {
    const fetchallschedule = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8087/api/schedule");
        setdscd(response.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu nhân viên!");
      } finally {
        setLoading(false);
      }
    };

    fetchallschedule();
  }, []);
 const filteredData = dscd.filter((ar) => {
  const matchDiemDi =
    diemDiInput === "" ||
    ar.diemdi.toLowerCase().includes(diemDiInput.toLowerCase());

  const matchDiemDen =
    diemDenInput === "" ||
    ar.diemden.toLowerCase().includes(diemDenInput.toLowerCase());

  return matchDiemDi && matchDiemDen;
});


  return (
    <>
      <div className="futa-header">
        <div className="top-bar">
          <div className="left-controls">
            <div className="control-item">
              <span className="flag">🇻🇳</span>
              <span>VI</span>
              <span className="arrow">▾</span>
            </div>

            <div className="control-item">
              <span className="phone">📱</span>
              <span>Tải ứng dụng</span>
              <span className="arrow">▾</span>
            </div>
          </div>

          <div className="logo-area">
            <img src={logoweb} alt="Futa Bus Lines" className="logo" />
          </div>

          <div className="user-control">
            <img src={"/user-avatar.png"} alt="avatar" className="avatar" />
            <span>Dương Trọng Tấn</span>
            <span className="arrow">▾</span>
          </div>
        </div>

        <ul className="nav-menu">
          <li>TRANG CHỦ</li>
          <li className="active">LỊCH TRÌNH</li>
          <li>TRA CỨU VÉ</li>
          <li>TIN TỨC</li>
          <li>HÓA ĐƠN</li>
          <li>LIÊN HỆ</li>
          <li>VỀ CHÚNG TÔI</li>
        </ul>
      </div>

      <div className="page">
        <div className="container">
          {/* Search Bar */}
          <div className="search-box">
            <input placeholder="Nhập điểm đi" 
             value={diemDiInput}
    onChange={(e) => setDiemDiInput(e.target.value)}
            />
            <span>⇄</span>
            <input placeholder="Nhập điểm đến" 
            value={diemDenInput}
    onChange={(e) => setDiemDenInput(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table">
            <div className="table-header">
              <div>Tuyến xe</div>
              {/* <div>Loại xe</div> */}
              <div style={{ textAlign: "center" }}>Quãng đường</div>
              <div style={{ textAlign: "center" }}>Thời gian hành trình</div>
              {/* <div>Giá vé</div> */}
              <div style={{ textAlign: "center" }}></div>
            </div>

            {filteredData.length > 0 ? (
              filteredData.map((ar, index) => (
                <React.Fragment key={index}>
                  <div className="table-row" key={index}>
                    <div className="route">
                      {ar.diemdi} <span>⇄</span> {ar.diemden}
                    </div>
                    {/* <div>{r.type}</div> */}
                    <div style={{ textAlign: "center" }}>{ar.quangduong} km</div>
                    <div style={{ textAlign: "center" }}>{ar.thoigian} giờ</div>
                    {/* <div></div> */}
                    <div style={{ textAlign: "center" }}>
                      <button
                        className="btn"
                        style={{
                          background: "rgba(239, 82, 34, .15)",
                          color: "#ef5222",
                          border: "none",
                          padding: "10px 20px",
                        }}
                                        onClick={() => handleFindTrip(ar.id)}

                      >
                        Tìm chuyến xe
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="text-center">Không có dữ liệu nhân viên</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Busroute;
