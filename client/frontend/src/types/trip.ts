export type Station = { id: number; name: string };
export type TripItem = {
  id: number;
  route?: {
    fromStation?: { name: string };
    toStation?: { name: string };
  };
  departureTime: string;     // ISO
  arrivalTime?: string;      // ISO
  operatorName?: string;     // nhà xe
  busName?: string;
  price?: number;            // có thể chưa có, tạm để optional
};
