import { Router } from 'express';
import { cities, hotels, attractions } from '../utils/dataStore';
import { getPageParams, paginate } from '../utils/pagination';
import { notFound } from '../middleware/errorHandler';

const router = Router();

// GET /cities
router.get('/', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : undefined;
  const countryCode = typeof req.query.countryCode === 'string' ? req.query.countryCode.toUpperCase() : undefined;

  let results = cities;
  if (q) {
    results = results.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }
  if (countryCode) {
    results = results.filter((c) => c.countryCode.toUpperCase() === countryCode);
  }

  res.json(paginate(results, getPageParams(req)));
});

// GET /cities/:cityId
router.get('/:cityId', (req, res, next) => {
  const city = cities.find((c) => c.id === req.params.cityId);
  if (!city) return next(notFound(`City '${req.params.cityId}' not found`));
  res.json(city);
});

// GET /cities/:cityId/hotels
router.get('/:cityId/hotels', (req, res, next) => {
  const city = cities.find((c) => c.id === req.params.cityId);
  if (!city) return next(notFound(`City '${req.params.cityId}' not found`));

  const minStars = req.query.minStars !== undefined ? Number(req.query.minStars) : undefined;
  let results = hotels.filter((h) => h.cityId === city.id);
  if (minStars !== undefined && Number.isFinite(minStars)) {
    results = results.filter((h) => h.starRating >= minStars);
  }

  res.json(paginate(results, getPageParams(req)));
});

// GET /cities/:cityId/attractions
router.get('/:cityId/attractions', (req, res, next) => {
  const city = cities.find((c) => c.id === req.params.cityId);
  if (!city) return next(notFound(`City '${req.params.cityId}' not found`));

  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  let results = attractions.filter((a) => a.cityId === city.id);
  if (category) {
    results = results.filter((a) => a.category === category);
  }

  res.json(paginate(results, getPageParams(req)));
});

export default router;
