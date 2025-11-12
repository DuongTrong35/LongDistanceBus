import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getTripDetail } from "../lib/api";
import type { Seat, TripDetail } from "../types/trip";

function fmtTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const tripId = Number(id);
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<TripDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        setLoading(true); setError(null);
        const data = await getTripDetail(tripId);
        if (!on) return;
        setTrip(data);
      } catch (e: any) {
        setError(e?.message ?? "Không tải được dữ liệu");
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, [tripId]);

  const seatCount = selected.length;
  const totalAmount = useMemo(() => {
    if (!trip) return 0;
    return selected.reduce((sum, seatId) => {
      const seat = trip.seats.find(s => s.id === seatId);
      return sum + (seat?.price ?? 0);
    }, 0);
  }, [trip, selected]);

  const title = useMemo(() => {
    if (!trip) return "Chi tiết chuyến";
    return `Chọn ghế – ${trip.fromName} → ${trip.toName}`;
  }, [trip]);

  const toggleSeat = (s: Seat) => {
    if (s.booked) return; // ghế bị khóa
    setSelected(prev =>
      prev.includes(s.id) ? prev.filter(x => x !== s.id) : [...prev, s.id]
    );
  };

  const goCheckout = () => {
    if (!trip) return;
    const qs = new URLSearchParams({
      tripId: String(trip.id),
      seats: selected.join(","),
    });
    nav(`/checkout?${qs.toString()}`);
  };

  return (
    <div style={{maxWidth: 960, margin:"0 auto", padding:16, fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, sans-serif"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
        <h2 style={{margin:0}}>{title}</h2>
        <Link to="/trips" style={{textDecoration:"none", padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:10}}>
          ← Quay lại danh sách
        </Link>
      </div>

      {loading && <div style={{padding:12, border:"1px dashed #ddd", borderRadius:10}}>Đang tải…</div>}
      {!loading && error && (
        <div style={{padding:12, border:"1px solid #fecaca", background:"#fff1f2", borderRadius:10, color:"#b91c1c"}}>
          {error}
        </div>
      )}
      {!loading && trip && (
        <>
          <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:14, background:"#fff", marginBottom:14}}>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
              <div>
                <div style={{fontWeight:700, marginBottom:4}}>
                  {trip.fromName} → {trip.toName}
                </div>
                <div>Khởi hành: <strong>{fmtTime(trip.departureTime)}</strong></div>
                {trip.arrivalTime && <div>Đến nơi: <strong>{fmtTime(trip.arrivalTime)}</strong></div>}
              </div>
              <div>
                <div>Nhà xe: <strong>{trip.operatorName ?? "—"}</strong></div>
                <div>Loại xe: <strong>{trip.busName ?? "—"}</strong></div>
                <div>Biển số: <strong>{trip.busPlate ?? "—"}</strong></div>
                <div>Ghế đã chọn: <strong>{seatCount}</strong></div>
                <div>Tạm tính: <strong>{totalAmount.toLocaleString("vi-VN")} đ</strong></div>
              </div>
            </div>
          </div>

          {/* Sơ đồ ghế */}
          <div>
            <h3 style={{margin:"8px 0"}}>Sơ đồ ghế</h3>
            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(64px,1fr))", gap:10}}>
              {trip.seats.map(s => {
                const isSelected = selected.includes(s.id);
                const bg = s.booked ? "#f3f4f6" : isSelected ? "#2563eb" : "#fff";
                const color = s.booked ? "#9ca3af" : isSelected ? "#fff" : "#111827";
                const border = s.booked ? "#e5e7eb" : isSelected ? "#2563eb" : "#e5e7eb";
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSeat(s)}
                    disabled={s.booked}
                    title={[s.seatType?.name, s.price ? `${s.price.toLocaleString("vi-VN")} đ` : null].filter(Boolean).join(" • ")}
                    style={{
                      height:64, border:`1px solid ${border}`, borderRadius:10,
                      background:bg, color, cursor: s.booked ? "not-allowed" : "pointer",
                      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                      boxShadow: isSelected ? "0 0 0 3px rgba(37,99,235,.2)" : "none"
                    }}
                  >
                    <div style={{fontWeight:700}}>{s.code}</div>
                    <div style={{fontSize:12, opacity:.7}}>
                      {s.booked ? "ĐÃ BÁN" : s.seatType?.name ?? "Ghế"}
                    </div>
                    {s.price != null && (
                      <div style={{fontSize:12, color:"#16a34a", fontWeight:600}}>
                        {s.price.toLocaleString("vi-VN")} đ
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16}}>
            <div style={{fontSize:14, color:"#6b7280"}}>
              Chọn ghế rồi bấm <strong>Tiếp tục</strong>. Tổng tiền dự kiến:{" "}
              <strong>{totalAmount.toLocaleString("vi-VN")} đ</strong>
            </div>
            <button
              onClick={goCheckout}
              disabled={selected.length === 0}
              style={{
                padding:"10px 16px",
                background: selected.length ? "#16a34a" : "#9ca3af",
                color:"#fff",
                border:"none", borderRadius:10, cursor: selected.length ? "pointer" : "not-allowed"
              }}
            >
              Tiếp tục ({selected.length})
            </button>
          </div>
        </>
      )}
    </div>
  );
}
