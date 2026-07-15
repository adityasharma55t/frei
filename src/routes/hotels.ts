import { Router } from 'express';
import { hotels } from '../utils/dataStore';
import { notFound } from '../middleware/errorHandler';

const router = Router();

// GET /hotels/recommended
router.get('/recommended', (req, res) => {
  const cityId = typeof req.query.cityId === 'string' ? req.query.cityId : undefined;
  const limit = req.query.limit !== undefined ? Number(req.query.limit) : 10;

  let results = [...hotels].sort((a, b) => b.userRating - a.userRating);
  if (cityId) {
    results = results.filter((h) => h.cityId === cityId);
  }

  res.json({ total: results.length, items: results.slice(0, limit) });
});

// GET /hotels/:hotelId
router.get('/:hotelId', (req, res, next) => {
  const hotel = hotels.find((h) => h.id === req.params.hotelId);
  if (!hotel) return next(notFound(`Hotel '${req.params.hotelId}' not found`));
  res.json(hotel);
});

export default router;
