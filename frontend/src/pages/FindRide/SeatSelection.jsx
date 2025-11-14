import React, { useState } from "react";
import "./SeatSelection.css";

const SeatSelection = () => {
  const lowerSeats = ["A01","A02","A03","A04","A05","A06","A07","A08","A09","A10","A11","A12","A15","A16","A17"];
  const upperSeats = ["B02","B04","B05","B07","B08","B10","B11","B12","B14","B15","B16","B17"];

  const soldSeats = ["A01","A02","A03","A04","A05","A06","A07","A08","A09","A10","A11","A12","B02","B05","B08","B11"];

  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSelect = (seat) => {
    if (soldSeats.includes(seat)) return;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const renderSeats = (seats) =>
    seats.map((seat) => (
      <div
        key={seat}
        className={`seat ${
          soldSeats.includes(seat)
            ? "sold"
            : selectedSeats.includes(seat)
            ? "selected"
            : "available"
        }`}
        onClick={() => handleSelect(seat)}
      >
        {seat}
      </div>
    ));

  return (
    <div className="seat-container">
      <div className="header">
        <h4>Chọn ghế</h4>
        <a href="#">Thông tin xe</a>
      </div>

      <div className="seat-layout">
        <div className="floor">
          <h5>Tầng dưới</h5>
          <div className="seat-grid">{renderSeats(lowerSeats)}</div>
        </div>

        <div className="floor">
          <h5>Tầng trên</h5>
          <div className="seat-grid">{renderSeats(upperSeats)}</div>
        </div>
      </div>

      <div className="legend">
        <div><span className="legend-box sold"></span> Đã bán</div>
        <div><span className="legend-box available"></span> Còn trống</div>
        <div><span className="legend-box selected"></span> Đang chọn</div>
      </div>
    </div>
  );
};

export default SeatSelection;
