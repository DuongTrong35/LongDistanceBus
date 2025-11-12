import { http } from "../lib/http";
import type { Operator, SeatType, Bus, Fare, Review, Route } from "../types/admin";

export type OperatorPayload = {
  name: string;
  hotline?: string;
  address?: string;
  city?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
};

export type SeatTypePayload = {
  code: string;
  name: string;
  description?: string;
  basePrice?: number | null;
};

export type BusSeatInput = {
  id?: number;
  seatTypeId: number;
  code: string;
  deckNumber?: number | null;
  rowIndex?: number | null;
  columnIndex?: number | null;
  available?: boolean;
};

export type BusPayload = {
  operatorId: number;
  name: string;
  plate: string;
  model?: string;
  manufacturedYear?: number;
  floorCount?: number;
  layoutName?: string;
  amenities?: string;
  imageUrl?: string;
  seats?: BusSeatInput[];
};

export type FarePayload = {
  routeId: number;
  seatTypeId: number;
  operatorId?: number | null;
  price: number;
  currency?: string;
  active?: boolean;
  note?: string;
};

export type ReviewPayload = {
  rating: number;
  title?: string;
  content: string;
  customerName?: string;
  operatorId?: number;
  busId?: number;
  tripId?: number;
  source?: string;
};

// Operators
export async function listOperators(): Promise<Operator[]> {
  const res = await http.get("/api/operators");
  return res.data;
}

export async function createOperator(payload: OperatorPayload): Promise<Operator> {
  const res = await http.post("/api/operators", payload);
  return res.data;
}

export async function updateOperator(id: number, payload: OperatorPayload): Promise<Operator> {
  const res = await http.put(`/api/operators/${id}`, payload);
  return res.data;
}

export async function deleteOperator(id: number): Promise<void> {
  await http.delete(`/api/operators/${id}`);
}

// Seat types
export async function listSeatTypes(): Promise<SeatType[]> {
  const res = await http.get("/api/seat-types");
  return res.data;
}

export async function createSeatType(payload: SeatTypePayload): Promise<SeatType> {
  const res = await http.post("/api/seat-types", payload);
  return res.data;
}

export async function updateSeatType(id: number, payload: SeatTypePayload): Promise<SeatType> {
  const res = await http.put(`/api/seat-types/${id}`, payload);
  return res.data;
}

export async function deleteSeatType(id: number): Promise<void> {
  await http.delete(`/api/seat-types/${id}`);
}

// Buses
export async function listBuses(operatorId?: number): Promise<Bus[]> {
  const res = await http.get("/api/buses", { params: operatorId ? { operatorId } : undefined });
  return res.data;
}

export async function getBus(id: number): Promise<Bus> {
  const res = await http.get(`/api/buses/${id}`);
  return res.data;
}

export async function createBus(payload: BusPayload): Promise<Bus> {
  const res = await http.post("/api/buses", payload);
  return res.data;
}

export async function updateBus(id: number, payload: BusPayload): Promise<Bus> {
  const res = await http.put(`/api/buses/${id}`, payload);
  return res.data;
}

export async function deleteBus(id: number): Promise<void> {
  await http.delete(`/api/buses/${id}`);
}

// Fares
export async function listRoutes(): Promise<Route[]> {
  const res = await http.get("/api/routes");
  return res.data;
}

export async function listFares(routeId?: number, operatorId?: number): Promise<Fare[]> {
  const params: Record<string, number> = {};
  if (routeId) params.routeId = routeId;
  if (operatorId) params.operatorId = operatorId;
  const res = await http.get("/api/fares", { params: Object.keys(params).length ? params : undefined });
  return res.data;
}

export async function createFare(payload: FarePayload): Promise<Fare> {
  const res = await http.post("/api/fares", payload);
  return res.data;
}

export async function updateFare(id: number, payload: FarePayload): Promise<Fare> {
  const res = await http.put(`/api/fares/${id}`, payload);
  return res.data;
}

export async function deleteFare(id: number): Promise<void> {
  await http.delete(`/api/fares/${id}`);
}

// Reviews
export async function listReviews(params?: { operatorId?: number; busId?: number; tripId?: number }): Promise<Review[]> {
  const res = await http.get("/api/reviews", { params });
  return res.data;
}

export async function createReview(payload: ReviewPayload): Promise<Review> {
  const res = await http.post("/api/reviews", payload);
  return res.data;
}

export async function deleteReview(id: number): Promise<void> {
  await http.delete(`/api/reviews/${id}`);
}

