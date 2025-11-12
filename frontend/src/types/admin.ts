export type Operator = {
  id: number;
  name: string;
  hotline?: string;
  address?: string;
  city?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  averageRating?: number | null;
  reviewCount?: number;
};

export type SeatType = {
  id: number;
  code: string;
  name: string;
  description?: string;
  basePrice?: number | null;
};

export type BusSeat = {
  id: number;
  code: string;
  seatTypeId: number;
  seatTypeName: string;
  seatTypeCode: string;
  deckNumber?: number | null;
  rowIndex?: number | null;
  columnIndex?: number | null;
  available?: boolean;
};

export type Bus = {
  id: number;
  operatorId: number;
  operatorName: string;
  name: string;
  plate: string;
  model?: string;
  manufacturedYear?: number;
  floorCount?: number;
  seatCount?: number;
  layoutName?: string;
  amenities?: string;
  imageUrl?: string;
  seats?: BusSeat[];
};

export type Fare = {
  id: number;
  routeId: number;
  fromStation: string;
  toStation: string;
  seatTypeId: number;
  seatTypeName: string;
  operatorId?: number | null;
  operatorName?: string | null;
  price: number;
  currency: string;
  active: boolean;
  note?: string;
};

export type Review = {
  id: number;
  rating: number;
  title?: string;
  content: string;
  customerName?: string;
  createdAt: string;
  operatorId?: number;
  operatorName?: string;
  busId?: number;
  busName?: string;
  tripId?: number;
  tripDeparture?: string;
  source?: string;
};

export type Route = {
  id: number;
  fromStation?: { id?: number; name?: string; city?: string };
  toStation?: { id?: number; name?: string; city?: string };
  distanceKm?: number | null;
};

