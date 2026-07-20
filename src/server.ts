import 'dotenv/config';
import { createApp } from './app';
import { startReminderCron } from './jobs/reminderCron';

const PORT = Number(process.env.PORT) || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Frei Booking API listening on port ${PORT}`);
  startReminderCron();
});
