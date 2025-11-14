import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FindRide.css";

function FindRide() {
  const id = "PTHCMX1"; // id xe cần lấy ghế
  const [ghetren, setGheTren] = useState([]);
  const [gheduoi, setGheDuoi] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats, setSoldSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //  Gọi API lấy ghế theo busId
  useEffect(() => {
    const fetchSeat = async () => {
      try {
        setLoading(true);
        setError(null);

        //  Nếu backend có JWT thì bạn cần gửi token ở đây
        const { data } = await axios.get(
          `http://localhost:8084/api/seats/bus/${id}`,
          {
            headers: {
              // Authorization: `Bearer ${token}`, // nếu có token
            },
          }
        );

        // Tách tầng trên / dưới theo "loai"
        setGheDuoi(data.filter((s) => s.loai === 0));
        setGheTren(data.filter((s) => s.loai === 1));

        setSoldSeats(data.filter((s) => s.tinhtrang === 1).map((s) => s.id));
      } catch (err) {
        console.error(err);
        setError(
          "Không thể tải dữ liệu ghế! (Lỗi 401 có thể do thiếu token hoặc sai CORS)"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSeat();
  }, [id]);

  // Hàm chọn ghế
  const handleSelect = (seatCode) => {
    console.log("Sold seats (immediately after setState):", soldSeats); // chưa chắc đúng

    if (soldSeats.includes(seatCode)) return;
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatCode));
    } else {
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  // Render từng ghế
  const renderSeats = (seats) =>
    seats.map((seat) => {
      // const seatCode = seat.maghe || seat.soGhe || seat.id;
      const seatCode = seat.id;
      console.log("Test:", seatCode);
      const isSold = soldSeats.includes(seatCode);
      console.log("Kết quả:", isSold);
      const isSelected = selectedSeats.includes(seatCode);
      return (
        <div
          key={seatCode}
          className={`seat ${
            isSold ? "sold" : isSelected ? "selected" : "available"
          }`}
          onClick={() => handleSelect(seatCode)}
        >
          {seat.soghe+""}
        </div>
      );
    });

  // Hiển thị
  return (
    <div className="HomeContainer">
      <div className="HomeBanner"> Chọn ghế xe {id}</div>

      <div className="HomeCenter">
        <div className="HomeLeft">
          {loading ? (
            <p>Đang tải ghế...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="seat-container">
              <div className="header">
                <h4>Chọn ghế</h4>
                <a href="#">Thông tin xe</a>
              </div>

              <div className="seat-layout">
                <div className="floor">
                  <h5>Tầng dưới</h5>
                  <div className="seat-grid">{renderSeats(gheduoi)}</div>
                </div>

                <div className="floor">
                  <h5>Tầng trên</h5>
                  <div className="seat-grid">{renderSeats(ghetren)}</div>
                </div>
              </div>

              <div className="legend">
                <div>
                  <span className="legend-box sold"></span> Đã bán
                </div>
                <div>
                  <span className="legend-box available"></span> Còn trống
                </div>
                <div>
                  <span className="legend-box selected"></span> Đang chọn
                </div>
              </div>
            </div>
          )}

          <div className="HomeLeftCustomer">
            <p>Thông tin khách hàng</p>
            <div className="HomeLeftCustomerCenter">
              <div className="HomeLeftCustomerLeft">
                .HomeLeftCustomerLeft
              </div>
              <div className="HomeLeftCustomerRight">

              </div>
            </div>
          </div>
        </div>

        <div className="HomeRight">
          <h2>Thông tin đặt vé</h2>
          <p>Ghế bạn chọn: {selectedSeats.join(", ") || "Chưa chọn"}</p>
        </div>
      </div>
    </div>
  );
}

export default FindRide;
