import { Router } from 'express';
import { flights } from '../utils/dataStore';
import { getPageParams, paginate } from '../utils/pagination';
import { badRequest, notFound } from '../middleware/errorHandler';
import { Flight } from '../types';

const router = Router();

type SortKey = 'price' | 'duration' | 'departureTime';

function sortFlights(list: Flight[], sort: SortKey): Flight[] {
  const sorted = [...list];
  switch (sort) {
    case 'duration':
      sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
      break;
    case 'departureTime':
      sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      break;
    case 'price':
    default:
      sorted.sort((a, b) => a.price - b.price);
      break;
  }
  return sorted;
}

// GET /flights?from=&to=&date=&travelers=&sort=
router.get('/', (req, res, next) => {
  const from = typeof req.query.from === 'string' ? req.query.from.toUpperCase() : undefined;
  const to = typeof req.query.to === 'string' ? req.query.to.toUpperCase() : undefined;

  if (!from || !to) {
    return next(badRequest("Both 'from' and 'to' query parameters are required"));
  }

  const date = typeof req.query.date === 'string' ? req.query.date : undefined;
  const travelers = req.query.travelers !== undefined ? Number(req.query.travelers) : 1;
  const sort: SortKey = ['price', 'duration', 'departureTime'].includes(String(req.query.sort))
    ? (req.query.sort as SortKey)
    : 'price';

  let results = flights.filter((f) => f.fromAirport === from && f.toAirport === to);

  if (date) {
    results = results.filter((f) => f.departureTime.startsWith(date));
  }
  if (Number.isFinite(travelers) && travelers > 0) {
    results = results.filter((f) => f.seatsAvailable >= travelers);
  }

  results = sortFlights(results, sort);

  res.json(paginate(results, getPageParams(req)));
});

// GET /flights/:flightId
router.get('/:flightId', (req, res, next) => {
  const flight = flights.find((f) => f.id === req.params.flightId);
  if (!flight) return next(notFound(`Flight '${req.params.flightId}' not found`));
  res.json(flight);
});

export default router;
