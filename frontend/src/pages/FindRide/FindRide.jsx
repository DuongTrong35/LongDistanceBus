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
          {seat.soghe + ""}
        </div>
      );
    });

  ////////////////////////////////////////////////////////
  const [selected, setSelected] = useState(null);

  const data = [
    {
      id: 1,
      time: "22:00",
      title: "AN MINH - KIEN GIANG",
      address: "THỨ 11, AN MINH , KIEN GIANG",
    },
    {
      id: 2,
      time: "22:00",
      title: "Tân Hiệp",
      address: "81 Ấp Đông Hưng, TT Tân Hiệp, Huyện Tân Hiệp, Tỉnh Kiên Giang",
    },
    {
      id: 3,
      time: "22:00",
      title: "BV BÌNH DÂN",
      address: "BỆNH VIỆN BÌNH DÂN, TP. Hồ Chí Minh",
    },
    {
      id: 4,
      time: "22:15",
      title: "BEN NHUT - KIEN GIANG",
      address: "KIÊN GIANG , Rạch giá",
    },
  ];
  // Hiển thị

  const [showList, setShowList] = useState(false);

  const [SelectedValueected, setSelectedValue] = useState(null);
  const givearrive = (e) => {
    const firstSpan = e.currentTarget.querySelector(
      ".HomeLeftCustomerCenterTimeItemCenter span:first-child"
    );

    if (!firstSpan) return;

    const fullText = firstSpan.textContent.trim();
    const value = fullText.split(" - ").slice(1).join(" - ");
    console.log("Test:", value);

    setSelectedValue(value);
    setShowList(false);
  };

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
            <div className="HomeLeftCustomerCenter">
              <div className="HomeLeftCustomerLeft">
                <p
                  style={{ fontSize: "20px", fontWeight: 700, marginbottom: 0 }}
                >
                  Thông tin khách hàng
                </p>
                <div className="HomeLeftCustomerLeftNamCustomer">
                  <p>Nhập họ và tên</p>
                  <span className="text-danger">*</span>
                </div>
                <input
                  type="text"
                  style={{ width: "350px", padding: "8px 12px" }}
                />

                <div className="HomeLeftCustomerLeftNamCustomer">
                  <p>Số điện thoại</p>
                  <span className="text-danger">*</span>
                </div>
                <input
                  type="text"
                  style={{ width: "350px", padding: "8px 12px" }}
                />

                <div className="HomeLeftCustomerLeftNamCustomer">
                  <p>Email</p>
                  <span className="text-danger">*</span>
                </div>
                <input
                  type="text"
                  style={{ width: "350px", padding: "8px 12px" }}
                />
              </div>
              <div className="HomeLeftCustomerRight">
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: 400,
                    color: "red",
                    textAlign: "center",
                  }}
                >
                  ĐIỀU KHOẢN & LƯU Ý
                </p>

                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "red",
                  }}
                >
                  Quý khách vui lòng Đăng ký/Đăng nhập tài khoản để nhận chương
                  trình khuyến mãi.
                </p>

                <p style={{ fontSize: "15px", fontWeight: 500 }}>
                  (*) Quý khách vui lòng có mặt tại bến xuất phát của xe trước
                  ít nhất 30 phút giờ xe khởi hành, mang theo thông báo đã thanh
                  toán vé thành công có chứa mã vé được gửi từ hệ thống KONOHA
                  BUS. Vui lòng liên hệ Trung tâm tổng đài{" "}
                  <span style={{ fontWeight: 700, color: "red" }}>
                    1900 6067
                  </span>{" "}
                  để được hỗ trợ.
                </p>

                <p style={{ fontSize: "15px", fontWeight: 500 }}>
                  (*) Nếu quý khách có nhu cầu trung chuyển, vui lòng liên hệ
                  Tổng đài trung chuyển{" "}
                  <span style={{ fontWeight: 700, color: "red" }}>
                    1900 6918
                  </span>{" "}
                  trước khi đặt vé. Chúng tôi không đón/trung chuyển tại những
                  điểm xe trung chuyển không thể tới được.
                </p>

                <p style={{ fontSize: "15px", fontWeight: 500 }}>
                  (*) Nếu quý khách có nhu cầu di chuyển chặng đường ngắn hơn so
                  với hành trình, vui lòng gọi Tổng đài{" "}
                  <span style={{ fontWeight: 700, color: "red" }}>
                    1900 6067
                  </span>{" "}
                  để được hưởng chính sách giá vé tốt nhất.
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                style={{ width: "16px", height: "16px", marginRight: "8px" }}
              />
              <span>
                <a
                  href="#"
                  style={{
                    textDecoration: "underline",
                    color: "#f25c2a", // màu cam kiểu FUTA
                    fontWeight: 500,
                    marginRight: "4px",
                  }}
                >
                  Chấp nhận điều khoản
                </a>
                đặt vé &amp; chính sách bảo mật thông tin của KONOHA BUS
              </span>
            </div>
          </div>
          <div className="HomeLeftCustomerCenterTime">
            <div
              className="HomeLeftCustomerCenterTimeBanner"
              style={{
                display: "flex",
              }}
            >
              <p style={{ fontSize: "20px", fontWeight: 700, marginbottom: 0 }}>
                Thông tin đón trả
              </p>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "2px solid #f25c2a",
                  color: "#f25c2a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: 1,
                  marginLeft: "5px",
                  marginTop: "5px",
                }}
              >
                i
              </div>
            </div>

            <div className="HomeLeftCustomerCenterTimeCenter">
              <div className="HomeLeftCustomerCenterTimeCenterFrom">
                <p>ĐIỂM ĐÓN</p>
                <div className="HomeLeftCustomerCenterTimeCenterFromvp">
                  <div className="HomeLeftCustomerCenterTimeCenterFromvpchose">
                    <input type="radio" name="pickup" value="benxe" />
                    <span className="label-text active">Bến xe/VP</span>
                    <div className="input-arrow-wrapper">
                      <input
                        type="text"
                        placeholder="Đồng Đen"
                        className="input-with-arrow"
                        onClick={() => setShowList((prev) => !prev)}
                        value={SelectedValueected ?? ""}
                        readOnly
                      />
                    </div>
                    {showList && (
                      <div className="HomeLeftCustomerCenterTimeCover">
                        <div className="search-wrapper">
                          <span className="search-icon">🔍</span>
                          <input
                            type="text"
                            className="search-input"
                            placeholder="Nhập tên bến xe, văn phòng"
                          />
                        </div>
                        <div
                          className="HomeLeftCustomerCenterTimeItem"
                          onClick={(e) => givearrive(e)}
                        >
                          <div className="HomeLeftCustomerCenterTimeItemLeft">
                            <input type="radio" name="pickup" value="benxe" />
                          </div>
                          <div className="HomeLeftCustomerCenterTimeItemCenter">
                            <span>13:00 - Phước Long - Bạc Liêu</span>
                            <span>Phước Long - Bạc Liêu</span>
                          </div>
                          <a href="#" className="link-xemvitri">
                            Xem vị trí
                          </a>
                        </div>
                        <div className="custom-divider"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ marginTop: "18px" }}>
                  <div>
                    <span>Quý khách vui lòng có mặt tại Bến xe/Văn Phòng</span>
                  </div>

                  <div style={{ display: "flex", gap: "6px", fontWeight: 600 }}>
                    <span>Rạch Sỏi</span>
                    <span style={{ color: "red" }}>Trước 23:40 19/11/2025</span>
                  </div>

                  <div>
                    <span>
                      để được trung chuyển hoặc kiểm tra thông tin trước khi lên
                      xe.
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  width: "1px",
                  height: "235px", // chỉnh theo ý bạn
                  backgroundColor: "#e5e5e5", // xám nhạt
                  margin: "0 8px", // nếu muốn cách 2 bên một chút
                }}
              ></div>
              <div className="HomeLeftCustomerCenterTimeCenterTo">
                <p>ĐIỂM TRẢ</p>
                <div className="HomeLeftCustomerCenterTimeCenterFromvp">
                  <div className="HomeLeftCustomerCenterTimeCenterFromvpchose">
                    <input type="radio" name="pickup" value="benxe" />
                    <span className="label-text active">Bến xe/VP</span>
                    <div className="input-arrow-wrapper">
                      <input
                        type="text"
                        placeholder="Đồng Đen"
                        className="input-with-arrow"
                        onClick={() => setShowList((prev) => !prev)}
                        value={SelectedValueected ?? ""}
                        readOnly
                      />
                    </div>
                    {showList && (
                      <div className="HomeLeftCustomerCenterTimeCover">
                        <div className="search-wrapper">
                          <span className="search-icon">🔍</span>
                          <input
                            type="text"
                            className="search-input"
                            placeholder="Nhập tên bến xe, văn phòng"
                          />
                        </div>
                        <div
                          className="HomeLeftCustomerCenterTimeItem"
                          onClick={(e) => givearrive(e)}
                        >
                          <div className="HomeLeftCustomerCenterTimeItemLeft">
                            <input type="radio" name="pickup" value="benxe" />
                          </div>
                          <div className="HomeLeftCustomerCenterTimeItemCenter">
                            <span>13:00 - Phước Long - Bạc Liêu</span>
                            <span>Phước Long - Bạc Liêu</span>
                          </div>
                          <a href="#" className="link-xemvitri">
                            Xem vị trí
                          </a>
                        </div>
                        <div className="custom-divider"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="HomeLeftCustomerCenterBottom ">
            <div className="flex flex-col gap-1">
              <div className="w-20 rounded-full bg-[#00613D] text-center text-xs text-white py-1">
                FUTAPAY
              </div>

              <div className="text-2xl font-medium text-black">0đ</div>
            </div>

            <div className="flex flex-auto items-center justify-end">
              <button
                type="button"
                className="ant-btn ant-btn-round ant-btn-default button-default active w-28"
              >
                <span>Thanh toán</span>
              </button>
            </div>
          </div>
        </div>

        <div className="HomeRight">
          {/* <h2>Thông tin đặt vé</h2>
          <p>Ghế bạn chọn: {selectedSeats.join(", ") || "Chưa chọn"}</p> */}
          <div className="HomeRightDepartureInformation">
            <p style={{ marginBottom: "0", fontWeight: "700" }}>
              Thông tin lượt đi
            </p>
            <div className="mt-2 flex justify-between">
              <span
                className="mr-2 text-gray w-20"
                style={{ marginRight: "10px" }}
              >
                Tuyến xe:
              </span>
              <span className="text-right text-black">
                BX An Nhon - BX Mien Tay
              </span>
            </div>

            <div className="mt-2 flex justify-between">
              <span
                className="mr-2 text-gray w-20"
                style={{ marginRight: "10px" }}
              >
                Thời gian xuất bến:
              </span>
              <span className="text-right text-black">20:01 20/11/2025</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span
                className="mr-2 text-gray w-20"
                style={{ marginRight: "10px" }}
              >
                Số lượng:
              </span>
              <span className="text-right text-black">4 Ghế</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span
                className="mr-2 text-gray w-20"
                style={{ marginRight: "10px" }}
              >
                Số ghế:
              </span>
              <span className="text-right text-black">1</span>
            </div>

            <div className="mt-2 flex justify-between">
              <span
                className="mr-2 text-gray w-20"
                style={{ marginRight: "10px" }}
              >
                Tổng tiền lượt đi:
              </span>
              <span className="text-right text-black">1.200.000đ</span>
            </div>
          </div>

          <div className="HomeRightDeparturePrice">
            <div class="price-detail">
              <span class="title">Chi tiết giá</span>
              <span class="icon">i</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span
                className="mr-2 text-gray w-20"
                style={{ marginRight: "10px" }}
              >
                Gía vé lượt đi:
              </span>
              <span className="text-right text-black">1.200.000đ</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span
                className="mr-2 text-gray w-20"
                style={{ marginRight: "10px" }}
              >
                Phí thanh toán:
              </span>
              <span className="text-right text-black">0đ</span>
            </div>

            <div class="customerline"></div>

            <div className="mt-2 flex justify-between">
              <span
                className="mr-2 text-gray w-20"
                style={{ marginRight: "10px" }}
              >
                Tổng tiền:
              </span>
              <span className="text-right text-black">1.200.000đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindRide;
