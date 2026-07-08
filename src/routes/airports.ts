import { Router } from 'express';
import { airports } from '../utils/dataStore';
import { getPageParams, paginate } from '../utils/pagination';
import { notFound } from '../middleware/errorHandler';

const router = Router();

// GET /airports
router.get('/', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : undefined;
  const cityId = typeof req.query.cityId === 'string' ? req.query.cityId : undefined;

  let results = airports;
  if (q) {
    results = results.filter(
      (a) => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    );
  }
  if (cityId) {
    results = results.filter((a) => a.cityId === cityId);
  }

  res.json(paginate(results, getPageParams(req)));
});

// GET /airports/:code
router.get('/:code', (req, res, next) => {
  const code = req.params.code.toUpperCase();
  const airport = airports.find((a) => a.code === code);
  if (!airport) return next(notFound(`Airport '${req.params.code}' not found`));
  res.json(airport);
});

export default router;
