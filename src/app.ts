import express, { Express } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as path from 'path';

import citiesRouter from './routes/cities';
import airportsRouter from './routes/airports';
import flightsRouter from './routes/flights';
import hotelsRouter from './routes/hotels';
import bookingsRouter from './routes/bookings';
import adminRouter from './routes/admin';
import { adminAuth } from './middleware/adminAuth';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { openapiDocument } from './utils/openapiLoader';
import paymentsRouter from './routes/payments';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ name: 'Frei Booking API', status: 'ok' });
  });
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

  app.use('/cities', citiesRouter);
  app.use('/airports', airportsRouter);
  app.use('/flights', flightsRouter);
  app.use('/hotels', hotelsRouter);
  app.use('/bookings', bookingsRouter);
  app.use('/payments', paymentsRouter);

  app.use('/admin/api', adminAuth, adminRouter);
  app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
