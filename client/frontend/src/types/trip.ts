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

export type Seat = {
  id: number;
  code: string;
  type?: string;   // ví dụ: NORMAL/VIP/TẦNG_1/TẦNG_2...
  booked: boolean; // true = đã bán/không chọn được
};

export type TripDetail = {
  id: number;
  fromName: string;
  toName: string;
  departureTime: string; // ISO
  arrivalTime?: string;  // ISO
  busName?: string;
  busPlate?: string;
  seats: Seat[];
};
