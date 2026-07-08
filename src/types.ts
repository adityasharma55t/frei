export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  timezone: string;
  lat: number;
  lng: number;
  image: string;
}

export interface Airport {
  code: string;
  name: string;
  cityId: string;
  lat: number;
  lng: number;
}

export type CabinClass = 'economy' | 'premium_economy' | 'business';

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  stops: number;
  price: number;
  currency: string;
  cabinClass: CabinClass;
  seatsAvailable: number;
}

export interface Hotel {
  id: string;
  name: string;
  cityId: string;
  starRating: number;
  userRating: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  image: string;
  address: string;
}

export type AttractionCategory =
  | 'landmark'
  | 'museum'
  | 'nature'
  | 'nightlife'
  | 'food'
  | 'shopping'
  | 'adventure';

export interface Attraction {
  id: string;
  name: string;
  cityId: string;
  category: AttractionCategory;
  rating: number;
  description: string;
  image: string;
}

export type BookingType = 'flight' | 'hotel';
export type BookingStatus = 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string | null;
  tripId: string | null;
  type: BookingType;
  referenceId: string;
  travelers: number;
  checkIn: string | null;
  checkOut: string | null;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;
}

export interface NewBookingInput {
  userId?: string | null;
  tripId?: string | null;
  type: BookingType;
  referenceId: string;
  travelers: number;
  checkIn?: string | null;
  checkOut?: string | null;
  totalPrice?: number;
  currency?: string;
  status?: BookingStatus;
}

export interface ApiError {
  error: string;
  message: string;
}

export interface Paginated<T> {
  total: number;
  items: T[];
}
