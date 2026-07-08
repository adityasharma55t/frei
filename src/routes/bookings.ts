import { Router } from 'express';
import { randomUUID } from 'crypto';
import { getBookings, saveBookings, flights, hotels } from '../utils/dataStore';
import { getPageParams, paginate } from '../utils/pagination';
import { badRequest, notFound } from '../middleware/errorHandler';
import { Booking, BookingStatus, BookingType, NewBookingInput } from '../types';

const router = Router();

// GET /bookings?userId=&tripId=&status=
router.get('/', (req, res) => {
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
  const tripId = typeof req.query.tripId === 'string' ? req.query.tripId : undefined;
  const status = typeof req.query.status === 'string' ? (req.query.status as BookingStatus) : undefined;

  let results = getBookings();
  if (userId) results = results.filter((b) => b.userId === userId);
  if (tripId) results = results.filter((b) => b.tripId === tripId);
  if (status) results = results.filter((b) => b.status === status);

  res.json(paginate(results, getPageParams(req)));
});

// POST /bookings
router.post('/', (req, res, next) => {
  const input = req.body as NewBookingInput;

  if (!input || typeof input !== 'object') {
    return next(badRequest('Request body must be a JSON object'));
  }
  const type = input.type as BookingType;
  if (type !== 'flight' && type !== 'hotel') {
    return next(badRequest("'type' must be either 'flight' or 'hotel'"));
  }
  if (!input.referenceId || typeof input.referenceId !== 'string') {
    return next(badRequest("'referenceId' is required"));
  }
  if (!Number.isInteger(input.travelers) || input.travelers < 1) {
    return next(badRequest("'travelers' must be a positive integer"));
  }

  let referencedPrice: number | undefined;
  let referencedCurrency = 'INR';

  if (type === 'flight') {
    const flight = flights.find((f) => f.id === input.referenceId);
    if (!flight) return next(badRequest(`No flight found with id '${input.referenceId}'`));
    referencedPrice = flight.price * input.travelers;
    referencedCurrency = flight.currency;
  } else {
    const hotel = hotels.find((h) => h.id === input.referenceId);
    if (!hotel) return next(badRequest(`No hotel found with id '${input.referenceId}'`));
    referencedPrice = hotel.pricePerNight;
    referencedCurrency = hotel.currency;
  }

  const booking: Booking = {
    id: `bkg_${randomUUID().slice(0, 8)}`,
    userId: input.userId ?? null,
    tripId: input.tripId ?? null,
    type,
    referenceId: input.referenceId,
    travelers: input.travelers,
    checkIn: input.checkIn ?? null,
    checkOut: input.checkOut ?? null,
    totalPrice: typeof input.totalPrice === 'number' ? input.totalPrice : referencedPrice,
    currency: input.currency ?? referencedCurrency,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  const all = getBookings();
  all.push(booking);
  saveBookings(all);

  res.status(201).json(booking);
});

// GET /bookings/:bookingId
router.get('/:bookingId', (req, res, next) => {
  const booking = getBookings().find((b) => b.id === req.params.bookingId);
  if (!booking) return next(notFound(`Booking '${req.params.bookingId}' not found`));
  res.json(booking);
});

// DELETE /bookings/:bookingId  (cancel)
router.delete('/:bookingId', (req, res, next) => {
  const all = getBookings();
  const idx = all.findIndex((b) => b.id === req.params.bookingId);
  if (idx === -1) return next(notFound(`Booking '${req.params.bookingId}' not found`));

  const cancelled: Booking = { ...all[idx], status: 'cancelled' };
  all[idx] = cancelled;
  saveBookings(all);

  res.json(cancelled);
});

export default router;
