export type Station = {
  id: number;
  name: string;
  province?: string;
};

export type Trip = {
  id: number;
  fromName: string;
  toName: string;
  departureTime: string; // ISO
  arrivalTime: string;   // ISO
  price: number | null;
  seatsLeft: number | null;
  busName?: string | null;
  plate?: string | null;
};
