import { useEffect, useMemo, useState } from "react";
import {
  listOperators,
  createOperator,
  updateOperator,
  deleteOperator,
  listSeatTypes,
  createSeatType,
  updateSeatType,
  deleteSeatType,
  listBuses,
  getBus,
  createBus,
  updateBus,
  deleteBus,
  listRoutes,
  listFares,
  createFare,
  updateFare,
  deleteFare,
  listReviews,
  createReview,
  deleteReview,
} from "../../services/adminApi";
import type {
  Operator,
  SeatType,
  Bus,
  BusSeat,
  Route,
  Fare,
  Review,
} from "../../types/admin";
import type {
  OperatorPayload,
  SeatTypePayload,
  BusPayload,
  BusSeatInput,
  FarePayload,
  ReviewPayload,
} from "../../services/adminApi";

const tabs = [
  { key: "operators", label: "Nhà xe" },
  { key: "seatTypes", label: "Loại ghế" },
  { key: "buses", label: "Xe & sơ đồ ghế" },
  { key: "fares", label: "Giá vé" },
  { key: "reviews", label: "Đánh giá khách hàng" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("operators");

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginBottom: 16 }}>Trung tâm quản trị</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: activeTab === tab.key ? "#2563eb" : "#fff",
              color: activeTab === tab.key ? "#fff" : "#111827",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20 }}>
        {activeTab === "operators" && <OperatorManager />}
        {activeTab === "seatTypes" && <SeatTypeManager />}
        {activeTab === "buses" && <BusManager />}
        {activeTab === "fares" && <FareManager />}
        {activeTab === "reviews" && <ReviewManager />}
      </div>
    </div>
  );
}

function useFormState<T>(initial: T) {
  const [value, setValue] = useState<T>(initial);
  function update<K extends keyof T>(key: K, val: T[K]) {
    setValue((prev) => ({ ...prev, [key]: val }));
  }
  function reset(next?: T) {
    setValue(next ?? initial);
  }
  return { value, update, reset, setValue };
}

function OperatorManager() {
  const [items, setItems] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Operator | null>(null);
  const { value: form, update, reset, setValue } = useFormState<OperatorPayload>({
    name: "",
    hotline: "",
    address: "",
    city: "",
    email: "",
    website: "",
    logoUrl: "",
    description: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const data = await listOperators();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      if (editing) {
        await updateOperator(editing.id, form);
        setMessage("Đã cập nhật nhà xe.");
      } else {
        await createOperator(form);
        setMessage("Đã tạo nhà xe mới.");
      }
      await refresh();
      setEditing(null);
      reset();
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? "Lưu nhà xe thất bại.");
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Xóa nhà xe này?")) return;
    await deleteOperator(id);
    await refresh();
  }

  return (
    <section>
      <h2>Quản lý nhà xe</h2>
      {message && <Alert message={message} />}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div>
          <h3>Danh sách ({items.length})</h3>
          {loading ? (
            <div>Đang tải…</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  <th style={th}>Tên</th>
                  <th style={th}>Hotline</th>
                  <th style={th}>Thành phố</th>
                  <th style={th}>Đánh giá</th>
                  <th style={th} />
                </tr>
              </thead>
              <tbody>
                {items.map((op) => (
                  <tr key={op.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={td}>{op.name}</td>
                    <td style={td}>{op.hotline ?? "—"}</td>
                    <td style={td}>{op.city ?? "—"}</td>
                    <td style={td}>
                      {op.averageRating != null ? `${op.averageRating} ⭐ (${op.reviewCount ?? 0})` : "—"}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <button
                        onClick={() => {
                          setEditing(op);
                          setValue({
                            name: op.name,
                            hotline: op.hotline ?? "",
                            address: op.address ?? "",
                            city: op.city ?? "",
                            email: op.email ?? "",
                            website: op.website ?? "",
                            logoUrl: op.logoUrl ?? "",
                            description: op.description ?? "",
                          });
                        }}
                        style={btnSecondary}
                      >
                        Sửa
                      </button>
                      <button onClick={() => remove(op.id)} style={btnDanger}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <h3>{editing ? `Cập nhật "${editing.name}"` : "Thêm nhà xe mới"}</h3>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <label style={labelStyle}>
              Tên nhà xe *
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Hotline
              <input value={form.hotline ?? ""} onChange={(e) => update("hotline", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Thành phố
              <input value={form.city ?? ""} onChange={(e) => update("city", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Địa chỉ
              <input value={form.address ?? ""} onChange={(e) => update("address", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Email
              <input value={form.email ?? ""} onChange={(e) => update("email", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Website
              <input value={form.website ?? ""} onChange={(e) => update("website", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Logo URL
              <input value={form.logoUrl ?? ""} onChange={(e) => update("logoUrl", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Mô tả
              <textarea
                value={form.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={btnPrimary}>
                {editing ? "Cập nhật" : "Thêm"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    reset();
                  }}
                  style={btnSecondary}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function SeatTypeManager() {
  const [items, setItems] = useState<SeatType[]>([]);
  const [editing, setEditing] = useState<SeatType | null>(null);
  const { value: form, update, reset, setValue } = useFormState<SeatTypePayload>({
    code: "",
    name: "",
    description: "",
    basePrice: undefined,
  });
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    const data = await listSeatTypes();
    setItems(data);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    try {
      if (editing) {
        await updateSeatType(editing.id, form);
        setMessage("Đã cập nhật loại ghế.");
      } else {
        await createSeatType(form);
        setMessage("Đã thêm loại ghế mới.");
      }
      await refresh();
      setEditing(null);
      reset();
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? "Lưu loại ghế thất bại.");
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Xóa loại ghế này?")) return;
    await deleteSeatType(id);
    await refresh();
  }

  return (
    <section>
      <h2>Quản lý loại ghế</h2>
      {message && <Alert message={message} />}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Mã</th>
                <th style={th}>Tên</th>
                <th style={th}>Giá mặc định</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {items.map((st) => (
                <tr key={st.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}>{st.code}</td>
                  <td style={td}>{st.name}</td>
                  <td style={td}>{st.basePrice != null ? st.basePrice.toLocaleString("vi-VN") : "—"}</td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <button
                      onClick={() => {
                        setEditing(st);
                        setValue({
                          code: st.code,
                          name: st.name,
                          description: st.description ?? "",
                          basePrice: st.basePrice ?? undefined,
                        });
                      }}
                      style={btnSecondary}
                    >
                      Sửa
                    </button>
                    <button onClick={() => remove(st.id)} style={btnDanger}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>{editing ? `Cập nhật "${editing.name}"` : "Thêm loại ghế"}</h3>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <label style={labelStyle}>
              Mã *
              <input value={form.code} onChange={(e) => update("code", e.target.value)} required style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Tên *
              <input value={form.name} onChange={(e) => update("name", e.target.value)} required style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Giá cơ sở (VND)
              <input
                type="number"
                value={form.basePrice ?? ""}
                onChange={(e) => update("basePrice", e.target.value ? Number(e.target.value) : undefined)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Mô tả
              <textarea
                value={form.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={btnPrimary}>
                {editing ? "Cập nhật" : "Thêm"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    reset();
                  }}
                  style={btnSecondary}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function BusManager() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { value: form, update, reset, setValue } = useFormState<Omit<BusPayload, "operatorId"> & { operatorId?: number }>({
    operatorId: undefined,
    name: "",
    plate: "",
    model: "",
    manufacturedYear: undefined,
    floorCount: undefined,
    layoutName: "",
    amenities: "",
    imageUrl: "",
    seats: [],
  });
  const [seatInputs, setSeatInputs] = useState<BusSeatInput[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    const [op, st, bs] = await Promise.all([listOperators(), listSeatTypes(), listBuses()]);
    setOperators(op);
    setSeatTypes(st);
    setBuses(bs);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function selectBus(busId: number) {
    const detail = await getBus(busId);
    setSelectedBus(detail);
  }

  function addSeatRow() {
    if (!seatTypes.length) {
      alert("Hãy thêm loại ghế trước.");
      return;
    }
    setSeatInputs((prev) => [
      ...prev,
      {
        code: "",
        seatTypeId: seatTypes[0].id,
        deckNumber: 1,
        rowIndex: prev.length + 1,
        columnIndex: 1,
        available: true,
      },
    ]);
  }

  function updateSeat(index: number, patch: Partial<BusSeatInput>) {
    setSeatInputs((prev) =>
      prev.map((seat, idx) => (idx === index ? { ...seat, ...patch } : seat))
    );
  }

  function removeSeat(index: number) {
    setSeatInputs((prev) => prev.filter((_, idx) => idx !== index));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.operatorId) {
      alert("Vui lòng chọn nhà xe.");
      return;
    }
    const payload: BusPayload = {
      operatorId: form.operatorId,
      name: form.name,
      plate: form.plate,
      model: form.model,
      manufacturedYear: form.manufacturedYear,
      floorCount: form.floorCount,
      layoutName: form.layoutName,
      amenities: form.amenities,
      imageUrl: form.imageUrl,
      seats: seatInputs.length ? seatInputs : undefined,
    };
    try {
      if (editingId) {
        await updateBus(editingId, payload);
        setMessage("Đã cập nhật xe.");
      } else {
        await createBus(payload);
        setMessage("Đã thêm xe mới.");
      }
      await refresh();
      setEditingId(null);
      reset({ operatorId: undefined, name: "", plate: "", model: "", manufacturedYear: undefined, floorCount: undefined, layoutName: "", amenities: "", imageUrl: "", seats: [] });
      setSeatInputs([]);
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? "Lưu xe thất bại.");
    }
  }

  async function editBus(bus: Bus) {
    const detail = await getBus(bus.id);
    setEditingId(detail.id);
    setValue({
      operatorId: detail.operatorId,
      name: detail.name,
      plate: detail.plate,
      model: detail.model ?? "",
      manufacturedYear: detail.manufacturedYear ?? undefined,
      floorCount: detail.floorCount ?? undefined,
      layoutName: detail.layoutName ?? "",
      amenities: detail.amenities ?? "",
      imageUrl: detail.imageUrl ?? "",
      seats: detail.seats?.map((seat) => ({
        id: seat.id,
        code: seat.code,
        seatTypeId: seat.seatTypeId,
        deckNumber: seat.deckNumber ?? undefined,
        rowIndex: seat.rowIndex ?? undefined,
        columnIndex: seat.columnIndex ?? undefined,
        available: seat.available,
      })) ?? [],
    });
    setSeatInputs(
      detail.seats?.map((seat) => ({
        id: seat.id,
        code: seat.code,
        seatTypeId: seat.seatTypeId,
        deckNumber: seat.deckNumber ?? undefined,
        rowIndex: seat.rowIndex ?? undefined,
        columnIndex: seat.columnIndex ?? undefined,
        available: seat.available,
      })) ?? []
    );
  }

  async function removeBus(id: number) {
    if (!window.confirm("Xóa xe này?")) return;
    await deleteBus(id);
    await refresh();
    if (selectedBus?.id === id) setSelectedBus(null);
  }

  return (
    <section>
      <h2>Quản lý xe & sơ đồ ghế</h2>
      {message && <Alert message={message} />}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 24, alignItems: "start" }}>
        <div>
          <h3>Danh sách xe ({buses.length})</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Nhà xe</th>
                <th style={th}>Tên xe</th>
                <th style={th}>Biển số</th>
                <th style={th}>Ghế</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}>{bus.operatorName}</td>
                  <td style={td}>{bus.name}</td>
                  <td style={td}>{bus.plate}</td>
                  <td style={td}>{bus.seatCount ?? "—"}</td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <button onClick={() => selectBus(bus.id)} style={btnSecondary}>
                      Xem ghế
                    </button>
                    <button onClick={() => editBus(bus)} style={btnSecondary}>
                      Sửa
                    </button>
                    <button onClick={() => removeBus(bus.id)} style={btnDanger}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedBus && (
            <div style={{ marginTop: 16 }}>
              <h4>Sơ đồ ghế - {selectedBus.name}</h4>
              {selectedBus.seats && selectedBus.seats.length ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                      <th style={th}>Mã ghế</th>
                      <th style={th}>Loại ghế</th>
                      <th style={th}>Tầng</th>
                      <th style={th}>Hàng/Cột</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBus.seats.map((seat: BusSeat) => (
                      <tr key={seat.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <td style={td}>{seat.code}</td>
                        <td style={td}>{seat.seatTypeName}</td>
                        <td style={td}>{seat.deckNumber ?? "—"}</td>
                        <td style={td}>
                          {seat.rowIndex ?? "—"} / {seat.columnIndex ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>Chưa cấu hình ghế.</div>
              )}
            </div>
          )}
        </div>
        <div>
          <h3>{editingId ? "Cập nhật xe" : "Thêm xe"}</h3>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <label style={labelStyle}>
              Nhà xe *
              <select
                value={form.operatorId ?? ""}
                onChange={(e) => update("operatorId", e.target.value ? Number(e.target.value) : undefined)}
                required
                style={inputStyle}
              >
                <option value="">-- Chọn --</option>
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </select>
            </label>
            <label style={labelStyle}>
              Tên xe *
              <input value={form.name} onChange={(e) => update("name", e.target.value)} required style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Biển số *
              <input value={form.plate} onChange={(e) => update("plate", e.target.value)} required style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Model
              <input value={form.model ?? ""} onChange={(e) => update("model", e.target.value)} style={inputStyle} />
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              <label style={{ ...labelStyle, flex: 1 }}>
                Năm SX
                <input
                  type="number"
                  value={form.manufacturedYear ?? ""}
                  onChange={(e) => update("manufacturedYear", e.target.value ? Number(e.target.value) : undefined)}
                  style={inputStyle}
                />
              </label>
              <label style={{ ...labelStyle, flex: 1 }}>
                Số tầng
                <input
                  type="number"
                  value={form.floorCount ?? ""}
                  onChange={(e) => update("floorCount", e.target.value ? Number(e.target.value) : undefined)}
                  style={inputStyle}
                />
              </label>
            </div>
            <label style={labelStyle}>
              Tên sơ đồ ghế
              <input value={form.layoutName ?? ""} onChange={(e) => update("layoutName", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Tiện ích
              <input value={form.amenities ?? ""} onChange={(e) => update("amenities", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Ảnh
              <input value={form.imageUrl ?? ""} onChange={(e) => update("imageUrl", e.target.value)} style={inputStyle} />
            </label>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4>Sơ đồ ghế ({seatInputs.length})</h4>
                <button type="button" onClick={addSeatRow} style={btnSecondary}>
                  + Thêm ghế
                </button>
              </div>
              {seatInputs.length === 0 && <div style={{ color: "#6b7280" }}>Chưa thêm ghế nào.</div>}
              {seatInputs.map((seat, idx) => (
                <div
                  key={idx}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 8,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <div style={{ display: "flex", gap: 12 }}>
                    <label style={{ ...labelStyle, flex: 1 }}>
                      Mã ghế
                      <input
                        value={seat.code}
                        onChange={(e) => updateSeat(idx, { code: e.target.value })}
                        required
                        style={inputStyle}
                      />
                    </label>
                    <label style={{ ...labelStyle, flex: 1 }}>
                      Loại ghế
                      <select
                        value={seat.seatTypeId}
                        onChange={(e) => updateSeat(idx, { seatTypeId: Number(e.target.value) })}
                        style={inputStyle}
                      >
                        {seatTypes.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <label style={{ ...labelStyle, flex: 1 }}>
                      Tầng
                      <input
                        type="number"
                        value={seat.deckNumber ?? ""}
                        onChange={(e) => updateSeat(idx, { deckNumber: e.target.value ? Number(e.target.value) : undefined })}
                        style={inputStyle}
                      />
                    </label>
                    <label style={{ ...labelStyle, flex: 1 }}>
                      Hàng
                      <input
                        type="number"
                        value={seat.rowIndex ?? ""}
                        onChange={(e) => updateSeat(idx, { rowIndex: e.target.value ? Number(e.target.value) : undefined })}
                        style={inputStyle}
                      />
                    </label>
                    <label style={{ ...labelStyle, flex: 1 }}>
                      Cột
                      <input
                        type="number"
                        value={seat.columnIndex ?? ""}
                        onChange={(e) => updateSeat(idx, { columnIndex: e.target.value ? Number(e.target.value) : undefined })}
                        style={inputStyle}
                      />
                    </label>
                  </div>
                  <button type="button" onClick={() => removeSeat(idx)} style={btnDanger}>
                    Xóa ghế
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={btnPrimary}>
                {editingId ? "Cập nhật" : "Thêm xe"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    reset({ operatorId: undefined, name: "", plate: "", model: "", manufacturedYear: undefined, floorCount: undefined, layoutName: "", amenities: "", imageUrl: "", seats: [] });
                    setSeatInputs([]);
                  }}
                  style={btnSecondary}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function FareManager() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
  const [fares, setFares] = useState<Fare[]>([]);
  const [editing, setEditing] = useState<Fare | null>(null);
  const { value: form, update, reset, setValue } = useFormState<FarePayload>({
    routeId: 0,
    seatTypeId: 0,
    operatorId: null,
    price: 0,
    currency: "VND",
    active: true,
    note: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    const [rs, ops, sts, fs] = await Promise.all([
      listRoutes(),
      listOperators(),
      listSeatTypes(),
      listFares(),
    ]);
    setRoutes(rs);
    setOperators(ops);
    setSeatTypes(sts);
    setFares(fs);
  }

  useEffect(() => {
    refresh();
  }, []);

  function routeLabel(routeId: number) {
    const route = routes.find((r) => r.id === routeId);
    if (!route) return `Tuyến #${routeId}`;
    return `${route.fromStation?.name ?? "?"} → ${route.toStation?.name ?? "?"}`;
  }

  function seatTypeLabel(seatTypeId: number) {
    return seatTypes.find((s) => s.id === seatTypeId)?.name ?? `Loại #${seatTypeId}`;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.routeId || !form.seatTypeId) {
      alert("Vui lòng chọn tuyến và loại ghế.");
      return;
    }
    try {
      if (editing) {
        await updateFare(editing.id, form);
        setMessage("Đã cập nhật giá vé.");
      } else {
        await createFare(form);
        setMessage("Đã thêm bảng giá mới.");
      }
      await refresh();
      setEditing(null);
      reset({
        routeId: 0,
        seatTypeId: 0,
        operatorId: null,
        price: 0,
        currency: "VND",
        active: true,
        note: "",
      });
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? "Lưu giá vé thất bại.");
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Xóa bảng giá này?")) return;
    await deleteFare(id);
    await refresh();
  }

  return (
    <section>
      <h2>Quản lý giá vé</h2>
      {message && <Alert message={message} />}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Tuyến</th>
                <th style={th}>Loại ghế</th>
                <th style={th}>Nhà xe</th>
                <th style={th}>Giá</th>
                <th style={th}>Ghi chú</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {fares.map((fare) => (
                <tr key={fare.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}>{routeLabel(fare.routeId)}</td>
                  <td style={td}>{seatTypeLabel(fare.seatTypeId)}</td>
                  <td style={td}>{fare.operatorName ?? "Áp dụng chung"}</td>
                  <td style={td}>{fare.price.toLocaleString("vi-VN")} đ</td>
                  <td style={td}>{fare.note ?? "—"}</td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <button
                      onClick={() => {
                        setEditing(fare);
                        setValue({
                          routeId: fare.routeId,
                          seatTypeId: fare.seatTypeId,
                          operatorId: fare.operatorId ?? null,
                          price: fare.price,
                          currency: fare.currency ?? "VND",
                          active: fare.active,
                          note: fare.note ?? "",
                        });
                      }}
                      style={btnSecondary}
                    >
                      Sửa
                    </button>
                    <button onClick={() => remove(fare.id)} style={btnDanger}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>{editing ? "Cập nhật giá vé" : "Thêm giá vé"}</h3>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <label style={labelStyle}>
              Tuyến *
              <select
                value={form.routeId || ""}
                onChange={(e) => update("routeId", e.target.value ? Number(e.target.value) : 0)}
                style={inputStyle}
                required
              >
                <option value="">-- Chọn tuyến --</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {routeLabel(route.id)}
                  </option>
                ))}
              </select>
            </label>
            <label style={labelStyle}>
              Loại ghế *
              <select
                value={form.seatTypeId || ""}
                onChange={(e) => update("seatTypeId", e.target.value ? Number(e.target.value) : 0)}
                style={inputStyle}
                required
              >
                <option value="">-- Chọn loại ghế --</option>
                {seatTypes.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </label>
            <label style={labelStyle}>
              Nhà xe (tùy chọn)
              <select
                value={form.operatorId ?? ""}
                onChange={(e) => update("operatorId", e.target.value ? Number(e.target.value) : null)}
                style={inputStyle}
              >
                <option value="">Áp dụng cho tất cả</option>
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </select>
            </label>
            <label style={labelStyle}>
              Giá (VND) *
              <input
                type="number"
                value={form.price}
                onChange={(e) => update("price", Number(e.target.value))}
                required
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Ghi chú
              <input value={form.note ?? ""} onChange={(e) => update("note", e.target.value)} style={inputStyle} />
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" style={btnPrimary}>
                {editing ? "Cập nhật" : "Thêm"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    reset({
                      routeId: 0,
                      seatTypeId: 0,
                      operatorId: null,
                      price: 0,
                      currency: "VND",
                      active: true,
                      note: "",
                    });
                  }}
                  style={btnSecondary}
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function ReviewManager() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterOperatorId, setFilterOperatorId] = useState<number | "">("");
  const { value: form, update, reset } = useFormState<ReviewPayload>({
    rating: 5,
    title: "",
    content: "",
    customerName: "",
    operatorId: undefined,
    busId: undefined,
    tripId: undefined,
    source: "Admin",
  });
  const [message, setMessage] = useState<string | null>(null);

  async function refresh(operatorId?: number) {
    const [ops, bs, rv] = await Promise.all([
      listOperators(),
      listBuses(operatorId),
      listReviews(operatorId ? { operatorId } : undefined),
    ]);
    setOperators(ops);
    setBuses(bs);
    setReviews(rv);
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const opId = filterOperatorId === "" ? undefined : Number(filterOperatorId);
    refresh(opId);
  }, [filterOperatorId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createReview(form);
      setMessage("Đã thêm đánh giá.");
      const opId = filterOperatorId === "" ? undefined : Number(filterOperatorId);
      await refresh(opId);
      reset({
        rating: 5,
        title: "",
        content: "",
        customerName: "",
        operatorId: form.operatorId,
        busId: undefined,
        tripId: undefined,
        source: "Admin",
      });
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? "Thêm đánh giá thất bại.");
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Xóa đánh giá này?")) return;
    await deleteReview(id);
    const opId = filterOperatorId === "" ? undefined : Number(filterOperatorId);
    await refresh(opId);
  }

  return (
    <section>
      <h2>Quản lý đánh giá khách hàng</h2>
      {message && <Alert message={message} />}
      <div style={{ marginBottom: 16 }}>
        <label style={{ ...labelStyle, display: "inline-flex", alignItems: "center", gap: 8 }}>
          Lọc theo nhà xe
          <select
            value={filterOperatorId}
            onChange={(e) => setFilterOperatorId(e.target.value ? Number(e.target.value) : "")}
            style={inputStyle}
          >
            <option value="">Tất cả</option>
            {operators.map((op) => (
              <option key={op.id} value={op.id}>
                {op.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 24 }}>
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                <th style={th}>Nhà xe</th>
                <th style={th}>Điểm</th>
                <th style={th}>Khách hàng</th>
                <th style={th}>Nội dung</th>
                <th style={th}>Ngày</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {reviews.map((rv) => (
                <tr key={rv.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={td}>{rv.operatorName ?? "—"}</td>
                  <td style={td}>{rv.rating} ⭐</td>
                  <td style={td}>{rv.customerName ?? "—"}</td>
                  <td style={{ ...td, maxWidth: 260 }}>{rv.content}</td>
                  <td style={td}>{new Date(rv.createdAt).toLocaleString("vi-VN")}</td>
                  <td style={{ ...td, textAlign: "right" }}>
                    <button onClick={() => remove(rv.id)} style={btnDanger}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Thêm đánh giá</h3>
          <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
            <label style={labelStyle}>
              Nhà xe *
              <select
                value={form.operatorId ?? ""}
                onChange={(e) => update("operatorId", e.target.value ? Number(e.target.value) : undefined)}
                required
                style={inputStyle}
              >
                <option value="">-- Chọn nhà xe --</option>
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.name}
                  </option>
                ))}
              </select>
            </label>
            <label style={labelStyle}>
              Xe (tùy chọn)
              <select
                value={form.busId ?? ""}
                onChange={(e) => update("busId", e.target.value ? Number(e.target.value) : undefined)}
                style={inputStyle}
              >
                <option value="">-- Không chọn --</option>
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.name} ({bus.plate})
                  </option>
                ))}
              </select>
            </label>
            <label style={labelStyle}>
              Điểm *
              <input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(e) => update("rating", Number(e.target.value))}
                required
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Khách hàng
              <input value={form.customerName ?? ""} onChange={(e) => update("customerName", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Tiêu đề
              <input value={form.title ?? ""} onChange={(e) => update("title", e.target.value)} style={inputStyle} />
            </label>
            <label style={labelStyle}>
              Nội dung *
              <textarea
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                required
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </label>
            <label style={labelStyle}>
              Trip ID (tùy chọn)
              <input
                type="number"
                value={form.tripId ?? ""}
                onChange={(e) => update("tripId", e.target.value ? Number(e.target.value) : undefined)}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Nguồn
              <input value={form.source ?? ""} onChange={(e) => update("source", e.target.value)} style={inputStyle} />
            </label>
            <button type="submit" style={btnPrimary}>
              Thêm đánh giá
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Alert({ message }: { message: string }) {
  return (
    <div
      style={{
        marginBottom: 16,
        padding: "10px 14px",
        borderRadius: 10,
        background: "#ecfeff",
        border: "1px solid #06b6d4",
        color: "#0f172a",
      }}
    >
      {message}
    </div>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  fontWeight: 600,
  padding: "10px 12px",
  borderBottom: "1px solid #e5e7eb",
};

const td: React.CSSProperties = {
  padding: "10px 12px",
  verticalAlign: "top",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 4,
  fontSize: 14,
  color: "#374151",
};

const btnPrimary: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  cursor: "pointer",
  marginRight: 6,
};

const btnDanger: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #fca5a5",
  background: "#fee2e2",
  color: "#b91c1c",
  cursor: "pointer",
  marginLeft: 6,
};

