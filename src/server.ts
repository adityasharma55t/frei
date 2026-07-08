import 'dotenv/config';
import { createApp } from './app';

const PORT = Number(process.env.PORT) || 4000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Frei Booking API listening on port ${PORT}`);
});
