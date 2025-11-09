import { api } from '../lib/api';
import type { Station, Trip } from '../types/bus';

export async function fetchStations() {
  return api<Station[]>('/api/stations');
}

export async function searchTrips(params: { from: number; to: number; date: string }) {
  const q = new URLSearchParams(params as any).toString();
  return api<Trip[]>(`/api/trips/search?${q}`);
}
