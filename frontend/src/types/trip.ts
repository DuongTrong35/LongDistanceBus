export type Station = { id: number; name: string; city?: string };

export type TripItem = {
  id: number;
  route?: {
    fromStation?: { id?: number; name?: string };
    toStation?: { id?: number; name?: string };
  };
  bus?: {
    id: number;
    name: string;
    plate: string;
    operator?: { id: number; name: string };
  };
  departureTime: string;
  arrivalTime?: string;
  price?: number;
  seatsTotal?: number;
  seatsBooked?: number;
  operatorName?: string;
  busName?: string;
};

export type SeatTypeInfo = {
  id: number;
  code: string;
  name: string;
};

export type Seat = {
  id: number;
  code: string;
  seatType: SeatTypeInfo;
  price?: number;
  booked: boolean;
  deck?: number | null;
  row?: number | null;
  column?: number | null;
};

export type TripDetail = {
  id: number;
  fromName: string;
  toName: string;
  departureTime: string;
  arrivalTime?: string;
  operatorName?: string;
  busName?: string;
  busPlate?: string;
  seats: Seat[];
};
