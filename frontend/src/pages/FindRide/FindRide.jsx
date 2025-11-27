import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./FindRide.css";
import HomeContainerLayout from "../../components/HomeContainerLayout";

function FindRide() {
  const { state } = useLocation();
  const id = state?.busid;

  const pricetmp = 350000;
  const [ghetren, setGheTren] = useState([]);
  const [gheduoi, setGheDuoi] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [soldSeats, setSoldSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dsroute, setDsRoute] = useState([]);
  const [showList, setShowList] = useState(false);
  const [showListBack, setShowListBack] = useState(false);
  const [SelectedValueected, setSelectedValue] = useState(null);
  const [SelectedValueectedBack, setSelectedValueectedBack] = useState(null);

  useEffect(() => {
    const fetchAllRoute = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8086/api/allroute");
        setDsRoute(response.data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu nhân viên!");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRoute();
  }, []);

  useEffect(() => {
    const fetchSeat = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`http://localhost:8084/api/seats/bus/${id}`);
        setGheDuoi(data.filter((s) => s.loai === 0));
        setGheTren(data.filter((s) => s.loai === 1));
        setSoldSeats(data.filter((s) => s.tinhtrang === 1).map((s) => s.id));
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu ghế! (Lỗi 401 có thể do thiếu token hoặc sai CORS)");
      } finally {
        setLoading(false);
      }
    };

    fetchSeat();
  }, [id]);

  const handleSelect = (seatCode) => {
    if (soldSeats.includes(seatCode)) return;
    if (selectedSeats.includes(seatCode)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatCode));
    } else {
      setSelectedSeats([...selectedSeats, seatCode]);
    }
  };

  const renderSeats = (seats) =>
    seats.map((seat) => {
      const seatCode = seat.id;
      const isSold = soldSeats.includes(seatCode);
      const isSelected = selectedSeats.includes(seatCode);

      return (
        <div
          key={seatCode}
          className={`seat ${isSold ? "sold" : isSelected ? "selected" : "available"}`}
          onClick={() => handleSelect(seatCode)}
        >
          {seat.soghe + ""}
        </div>
      );
    });

  const givearrive = (e) => {
    const firstSpan = e.currentTarget.querySelector(
      ".HomeLeftCustomerCenterTimeItemCenter span:first-child"
    );
    if (!firstSpan) return;
    const fullText = firstSpan.textContent.trim();
    const value = fullText.split(" - ").slice(1).join(" - ");
    setSelectedValue(value);
    setShowList(false);
  };

  const giveback = (e) => {
    const firstSpan = e.currentTarget.querySelector(
      ".HomeLeftCustomerCenterTimeItemCenter1 span:first-child"
    );
    if (!firstSpan) return;
    const fullText = firstSpan.textContent.trim();
    const value = fullText.split(" - ").slice(1).join(" - ");
    setSelectedValueectedBack(value);
    setShowListBack(false);
  };

  const leftContent = (
    <>
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
            <p style={{ fontSize: "20px", fontWeight: 700, marginbottom: 0 }}>
              Thông tin khách hàng
            </p>
            <div className="HomeLeftCustomerLeftNamCustomer">
              <p>Nhập họ và tên</p>
              <span className="text-danger">*</span>
            </div>
            <input type="text" style={{ width: "350px", padding: "8px 12px" }} />

            <div className="HomeLeftCustomerLeftNamCustomer">
              <p>Số điện thoại</p>
              <span className="text-danger">*</span>
            </div>
            <input type="text" style={{ width: "350px", padding: "8px 12px" }} />

            <div className="HomeLeftCustomerLeftNamCustomer">
              <p>Email</p>
              <span className="text-danger">*</span>
            </div>
            <input type="text" style={{ width: "350px", padding: "8px 12px" }} />
          </div>
          <div className="HomeLeftCustomerRight">
            <p
              style={{
                fontSize: "20px",
                fontWeight: 400,
                color: "red",
                textAlign: "center"
              }}
            >
              ĐIỀU KHOẢN & LƯU Ý
            </p>

            <p
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "red"
              }}
            >
              Quý khách vui lòng Đăng ký/Đăng nhập tài khoản để nhận chương trình khuyến mãi.
            </p>

            <p style={{ fontSize: "15px", fontWeight: 500 }}>
              (*) Quý khách vui lòng có mặt tại bến xuất phát của xe trước ít nhất 30 phút giờ xe khởi
              hành, mang theo thông báo đã thanh toán vé thành công có chứa mã vé được gửi từ hệ thống
              KONOHA BUS. Vui lòng liên hệ Trung tâm tổng đài{" "}
              <span style={{ fontWeight: 700, color: "red" }}>1900 6067</span> để được hỗ trợ.
            </p>

            <p style={{ fontSize: "15px", fontWeight: 500 }}>
              (*) Nếu quý khách có nhu cầu trung chuyển, vui lòng liên hệ Tổng đài trung chuyển{" "}
              <span style={{ fontWeight: 700, color: "red" }}>1900 6918</span> trước khi đặt vé. Chúng tôi
              không đón/trung chuyển tại những điểm xe trung chuyển không thể tới được.
            </p>

            <p style={{ fontSize: "15px", fontWeight: 500 }}>
              (*) Nếu quý khách có nhu cầu di chuyển chặng đường ngắn hơn so với hành trình, vui lòng gọi
              Tổng đài <span style={{ fontWeight: 700, color: "red" }}>1900 6067</span> để được hưởng
              chính sách giá vé tốt nhất.
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "14px"
          }}
        >
          <input type="checkbox" style={{ width: "16px", height: "16px", marginRight: "8px" }} />
          <span>
            <a
              href="#"
              style={{
                textDecoration: "underline",
                color: "#f25c2a",
                fontWeight: 500,
                marginRight: "4px"
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
            display: "flex"
          }}
        >
          <p style={{ fontSize: "20px", fontWeight: 700, marginbottom: 0 }}>Thông tin đón trả</p>
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
              marginTop: "5px"
            }}
          >
            i
          </div>
        </div>

        <div className="HomeLeftCustomerCenterTimeCenter">
          {showList && (
            <div className="HomeLeftCustomerCenterTimeCover">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" className="search-input" placeholder="Nhập tên bến xe, văn phòng" />
              </div>
              {dsroute.length > 0 ? (
                dsroute
                  .filter((ar) => ar.tinhtrang === 0)
                  .map((ar, index) => (
                    <React.Fragment key={index}>
                      <div className="HomeLeftCustomerCenterTimeItem" onClick={(e) => givearrive(e)}>
                        <div className="HomeLeftCustomerCenterTimeItemLeft">
                          <input type="radio" name="pickup" value="benxe" />
                        </div>
                        <div className="HomeLeftCustomerCenterTimeItemCenter">
                          <span>
                            {ar.gio} - {ar.ten}
                          </span>
                          <span>{ar.mota}</span>
                        </div>
                        <a href={ar.link} className="link-xemvitri" target="_blank" rel="noopener noreferrer">
                          Xem vị trí
                        </a>
                      </div>
                      <div className="custom-divider"></div>
                    </React.Fragment>
                  ))
              ) : (
                <div className="text-center">Không có dữ liệu nhân viên</div>
              )}
            </div>
          )}

          {showListBack && (
            <div className="HomeLeftCustomerCenterTimeCover1">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input type="text" className="search-input" placeholder="Nhập tên bến xe, văn phòng" />
              </div>
              {dsroute.length > 0 ? (
                dsroute
                  .filter((ar) => ar.tinhtrang === 1)
                  .map((ar, index) => (
                    <React.Fragment key={index}>
                      <div className="HomeLeftCustomerCenterTimeItem1" onClick={(e) => giveback(e)}>
                        <div className="HomeLeftCustomerCenterTimeItemLeft1">
                          <input type="radio" name="pickup" value="benxe" />
                        </div>
                        <div className="HomeLeftCustomerCenterTimeItemCenter1">
                          <span>
                            {ar.gio} - {ar.ten}
                          </span>
                          <span>{ar.mota}</span>
                        </div>
                        <a href={ar.link} className="link-xemvitri1" target="_blank" rel="noopener noreferrer">
                          Xem vị trí
                        </a>
                      </div>
                      <div className="custom-divider"></div>
                    </React.Fragment>
                  ))
              ) : (
                <div className="text-center">Không có dữ liệu nhân viên</div>
              )}
            </div>
          )}

          <div className="HomeLeftCustomerCenterTimeCenterFrom">
            <p>ĐIỂM ĐÓN</p>
            <div className="HomeLeftCustomerCenterTimeCenterFromvp">
              <div className="HomeLeftCustomerCenterTimeCenterFromvpchose">
                <span className="label-text active">Bến xe/VP</span>
                <div className="input-arrow-wrapper">
                  <input
                    type="text"
                    placeholder="Đồng Đen"
                    className="input-with-arrow"
                    onClick={() => {
                      setShowList((prev) => !prev);
                      setShowListBack(false);
                    }}
                    value={SelectedValueected ?? ""}
                    readOnly
                  />
                </div>
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
                <span>để được trung chuyển hoặc kiểm tra thông tin trước khi lên xe.</span>
              </div>
            </div>
          </div>

          <div
            style={{
              width: "1px",
              height: "235px",
              backgroundColor: "#e5e5e5",
              margin: "0 8px"
            }}
          ></div>

          <div className="HomeLeftCustomerCenterTimeCenterTo">
            <p>ĐIỂM TRẢ</p>
            <div className="HomeLeftCustomerCenterTimeCenterFromvp">
              <div className="HomeLeftCustomerCenterTimeCenterFromvpchose">
                <span className="label-text active">Bến xe/VP</span>
                <div className="input-arrow-wrapper">
                  <input
                    type="text"
                    placeholder="Đồng Đen"
                    className="input-with-arrow"
                    onClick={() => {
                      setShowListBack((prev) => !prev);
                      setShowList(false);
                    }}
                    value={SelectedValueectedBack ?? ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="HomeLeftCustomerCenterBottom">
        <div className="flex flex-col gap-1">
          <div className="w-20 rounded-full bg-[#00613D] text-center text-xs text-white py-1">
            FUTAPAY
          </div>

          <div className="text-2xl font-medium text-black">
            {pricetmp * selectedSeats.length} đồng
          </div>
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
    </>
  );

  const rightContent = (
    <>
      <div className="HomeRightDepartureInformation">
        <p style={{ marginBottom: "0", fontWeight: "700" }}>Thông tin lượt đi</p>
        <div className="mt-2 flex justify-between">
          <span className="mr-2 text-gray w-20" style={{ marginRight: "10px" }}>
            Tuyến xe:
          </span>
          <span className="text-right text-black">
            BX {SelectedValueected} tới BX {SelectedValueectedBack}
          </span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="mr-2 text-gray w-20" style={{ marginRight: "10px" }}>
            Thời gian xuất bến:
          </span>
          <span className="text-right text-black">23:40 19/11/2025</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="mr-2 text-gray w-20" style={{ marginRight: "10px" }}>
            Số lượng:
          </span>
          <span className="text-right text-black">{selectedSeats.length} Ghế</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="mr-2 text-gray w-20" style={{ marginRight: "10px" }}>
            Số ghế:
          </span>
          <span className="text-right text-black">
            {selectedSeats.length > 0
              ? selectedSeats.map((seat) => seat.slice(-2)).join(", ")
              : "Chưa chọn"}
          </span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="mr-2 text-gray w-20" style={{ marginRight: "10px" }}>
            Tổng tiền lượt đi:
          </span>
          <span className="text-right text-black">
            {pricetmp * selectedSeats.length} đồng
          </span>
        </div>
      </div>

      <div className="HomeRightDeparturePrice">
        <div className="price-detail">
          <span className="title">Chi tiết giá</span>
          <span className="icon">i</span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="mr-2 text-gray w-20" style={{ marginRight: "10px" }}>
            Giá vé lượt đi:
          </span>
          <span className="text-right text-black">
            {pricetmp * selectedSeats.length} đồng
          </span>
        </div>
        <div className="mt-2 flex justify-between">
          <span className="mr-2 text-gray w-20" style={{ marginRight: "10px" }}>
            Phí thanh toán:
          </span>
          <span className="text-right text-black">0đ</span>
        </div>

        <div className="customerline"></div>

        <div className="mt-2 flex justify-between">
          <span className="mr-2 text-gray w-20" style={{ marginRight: "10px" }}>
            Tổng tiền:
          </span>
          <span className="text-right text-black">
            {pricetmp * selectedSeats.length} đồng
          </span>
        </div>
      </div>
    </>
  );

  const footerContent = (
    <footer className="w3l-footer-29-main" style={{ background: "#FFEEEB" }}>
      <div className="footer-29 pt-5 pb-4">
        <div className="container pt-md-4">
          <div className="row footer-top-29">
            <div className="col-lg-4 col-md-6 footer-list-29">
              <h6 className="footer-title-29">Thông tin liên lạc</h6>
              <p className="mb-2 pe-xl-5">Địa chỉ: 130 Cô Bắc Q1 TPHCM</p>
              <p className="mb-2">Số điện thoại : (028)45.735.921</p>
              <p className="mb-2">Email : KonohaMarket@gmail.com</p>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-8 footer-list-29 mt-lg-0 mt-4 ps-lg-5">
              <h6 className="footer-title-29">Lời nhắn</h6>
              <p className="mt-3">
                Nếu cửa hàng chúng tôi làm gì sai thì mong quý khách thông cảm
              </p>
            </div>

            <div
              className="col-lg-2 col-md-3 col-6 ps-lg-5 ps-lg-4 footer-list-29 mt-md-0 mt-4"
              style={{ display: "flex", marginLeft: "80px" }}
            >
              <img src="" alt="" style={{ width: "200px", height: "150px" }} />
              <img
                src=""
                alt=""
                style={{ width: "95px", height: "79px", marginTop: "-28px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );

  return (
    <HomeContainerLayout
      leftContent={leftContent}
      rightContent={rightContent}
      footerContent={footerContent}
    />
  );
}

export default FindRide;

