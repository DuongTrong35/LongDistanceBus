import { api } from '../lib/api'

export type Seat = { id: number; code: string; type: string; booked: boolean }
export type TripDetail = {
  id: number; fromName: string; toName: string;
  departureTime: string; arrivalTime: string;
  busName: string; plate: string;
  seats: Seat[];
}

export async function fetchTripDetail(id: number) {
  return api<TripDetail>(`/api/trips/${id}`)
}
