import { http } from '../lib/http';

export async function fetchStations() {
  const res = await http.get('/api/stations');
  return res.data;
}

export async function searchTrips(params) {
  const q = new URLSearchParams(params).toString();
  const res = await http.get(`/api/trips/search?${q}`);
  return res.data;
}

