// client/frontend/src/lib/api.ts
import { http } from "./http";
import type { TripDetail, TripItem } from "../types/trip";

/** ===== Token helpers ===== */
export function setToken(token: string) {
  localStorage.setItem("accessToken", token);
}
export function getToken(): string | null {
  return localStorage.getItem("accessToken");
}
export function clearToken() {
  localStorage.removeItem("accessToken");
}

/** ===== Auth APIs ===== */
export async function loginApi(payload: { email: string; password: string }) {
  const res = await http.post("/api/auth/login", payload);
  if (res?.data?.accessToken) setToken(res.data.accessToken);
  return res.data; // { accessToken, expiresIn, ... }
}

/** ===== Booking/Search/Home APIs ===== */
export async function getStations() {
  const res = await http.get("/api/stations");
  return res.data;
}

export async function searchTrips(params: {
  fromId: number;
  toId: number;
  date: string;
}) {
  const res = await http.get("/api/trips/search", { params });
  const items = res.data as any[];
  return items.map((trip: any): TripItem => ({
    id: trip.id,
    route: trip.route,
    bus: trip.bus,
    departureTime: trip.departureTime,
    arrivalTime: trip.arrivalTime,
    price: trip.price,
    seatsTotal: trip.seatsTotal,
    seatsBooked: trip.seatsBooked,
    operatorName: trip.bus?.operator?.name ?? trip.operatorName,
    busName: trip.bus?.name ?? trip.busName ?? trip.bus?.model,
  }));
}

export async function getTripDetail(tripId: number) {
  const res = await http.get(`/api/trips/${tripId}`);
  return res.data as TripDetail;
}
