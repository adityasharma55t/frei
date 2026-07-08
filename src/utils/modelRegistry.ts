export interface ModelDef {
  key: string;
  file: string;
  idField: string;
  schemaName: string;
  label: string;
}

export const MODEL_REGISTRY: ModelDef[] = [
  { key: 'cities', file: 'cities.json', idField: 'id', schemaName: 'City', label: 'Cities' },
  { key: 'airports', file: 'airports.json', idField: 'code', schemaName: 'Airport', label: 'Airports' },
  { key: 'hotels', file: 'hotels.json', idField: 'id', schemaName: 'Hotel', label: 'Hotels' },
  { key: 'attractions', file: 'attractions.json', idField: 'id', schemaName: 'Attraction', label: 'Attractions' },
  { key: 'flights', file: 'flights.json', idField: 'id', schemaName: 'Flight', label: 'Flights' },
  { key: 'bookings', file: 'bookings.json', idField: 'id', schemaName: 'Booking', label: 'Bookings' },
];

export function getModelDef(key: string): ModelDef | undefined {
  return MODEL_REGISTRY.find((def) => def.key === key);
}
