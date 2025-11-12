import { http } from '../lib/http';

export async function fetchTripDetail(id) {
  const res = await http.get(`/api/trips/${id}`);
  return res.data;
}

