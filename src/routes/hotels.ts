import { Router } from 'express';
import { hotels } from '../utils/dataStore';
import { notFound } from '../middleware/errorHandler';

const router = Router();

// GET /hotels/:hotelId
router.get('/:hotelId', (req, res, next) => {
  const hotel = hotels.find((h) => h.id === req.params.hotelId);
  if (!hotel) return next(notFound(`Hotel '${req.params.hotelId}' not found`));
  res.json(hotel);
});

export default router;
