import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getStations, searchTrips } from "../lib/api";
import type { Station, TripItem } from "../types/trip";

function fmtTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString();
}

export default function Trips() {
  const [sp] = useSearchParams();
  const fromName = sp.get("from") ?? "";
  const toName = sp.get("to") ?? "";
  const date = sp.get("date") ?? ""; // YYYY-MM-DD

  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState<Station[]>([]);
  const [items, setItems] = useState<TripItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Tối giản: map tên -> id (so khớp không phân biệt hoa thường, trim)
  const resolveStationId = (name: string) => {
    const norm = name.trim().toLowerCase();
    const found = stations.find(s => s.name.trim().toLowerCase() === norm);
    return found?.id;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) lấy danh sách bến
        const ss = await getStations();
        if (!mounted) return;
        setStations(ss);

        // 2) map tên -> id
        const fromId = resolveStationId(fromName) ?? (() => {
          const guess = ss.find(s => s.name.toLowerCase().includes(fromName.toLowerCase()));
          return guess?.id;
        })();
        const toId = resolveStationId(toName) ?? (() => {
          const guess = ss.find(s => s.name.toLowerCase().includes(toName.toLowerCase()));
          return guess?.id;
        })();

        if (!fromId || !toId || !date) {
          setItems([]);
          setError("Thiếu thông tin tìm kiếm (điểm đi/điểm đến/ngày).");
          return;
        }

        // 3) gọi API search
        const trips: TripItem[] = await searchTrips({ fromId, toId, date });
        if (!mounted) return;
        setItems(trips);
      } catch (e: any) {
        setError(e?.message ?? "Lỗi không xác định");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromName, toName, date]);

  const title = useMemo(() => {
    if (!fromName || !toName || !date) return "Tìm chuyến";
    return `Chuyến từ "${fromName}" → "${toName}" | ${date}`;
  }, [fromName, toName, date]);

  return (
    <div style={{maxWidth: 960, margin: "0 auto", padding: 16, fontFamily:"system-ui, -apple-system, Segoe UI, Roboto, sans-serif"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 12}}>
        <h2 style={{margin:0}}>{title}</h2>
        <Link to="/" style={{textDecoration:"none", padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:10}}>← Về Trang chủ</Link>
      </div>

      {loading && <div style={{padding:12, border:"1px dashed #ddd", borderRadius:10}}>Đang tải dữ liệu…</div>}
      {!loading && error && (
        <div style={{padding:12, border:"1px solid #fecaca", background:"#fff1f2", borderRadius:10, color:"#b91c1c"}}>
          {error}
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <div style={{padding:12, border:"1px solid #e5e7eb", borderRadius:10}}>Không tìm thấy chuyến phù hợp.</div>
      )}

      <div style={{display:"grid", gridTemplateColumns:"1fr", gap:12, marginTop:12}}>
        {items.map(t => (
          <div key={t.id} style={{border:"1px solid #e5e7eb", borderRadius:12, padding:14, background:"#fff"}}>
            <div style={{display:"flex", justifyContent:"space-between", gap:8, flexWrap:"wrap"}}>
              <div>
                <div style={{fontWeight:700}}>
                  {t.route?.fromStation?.name} → {t.route?.toStation?.name}
                </div>
                <div style={{fontSize:14, color:"#6b7280"}}>Nhà xe: {t.operatorName ?? "—"} • Xe: {t.busName ?? "—"}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div><strong>Khởi hành:</strong> {fmtTime(t.departureTime)}</div>
                {t.arrivalTime && <div><strong>Đến nơi:</strong> {fmtTime(t.arrivalTime)}</div>}
              </div>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10}}>
              <div style={{fontSize:18, fontWeight:700, color:"#16a34a"}}>
                {t.price != null ? t.price.toLocaleString("vi-VN") + " đ" : "Giá cập nhật"}
              </div>
              <Link
                to={`/trips/${t.id}`}
                style={{background:"#2563eb", color:"#fff", padding:"8px 14px", borderRadius:10, textDecoration:"none"}}
              >
                Chọn chuyến
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
