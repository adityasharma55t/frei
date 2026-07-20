import { firestore } from '../config/firebaseAdmin';
import { sendReminder } from './pushService';

const HOUR = 60 * 60 * 1000;

export async function checkFlightReminders(): Promise<void> {
  const now = Date.now();
  const windowStart = new Date(now + 3 * HOUR - 15 * 60 * 1000).toISOString();
  const windowEnd = new Date(now + 3 * HOUR).toISOString();

  const snapshot = await firestore
    .collection('flightDetails')
    .where('departureTime', '>=', windowStart)
    .where('departureTime', '<=', windowEnd)
    .get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.reminderSent) continue;

    await sendReminder(
      data.uid,
      data.tripId ?? null,
      'FLIGHT_REMINDER',
      `Flight ${data.flightNumber ?? ''} soon`,
      `Departs ${data.departureTime} from ${data.fromAirport ?? ''}`
    );
    await doc.ref.update({ reminderSent: true });
  }
}

export async function checkHotelCheckinReminders(): Promise<void> {
  const tomorrow = new Date(Date.now() + 24 * HOUR).toISOString().slice(0, 10);

  const snapshot = await firestore
    .collection('hotelDetails')
    .where('checkInDate', '==', tomorrow)
    .get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.checkinReminderSent) continue;

    await sendReminder(
      data.uid,
      data.tripId ?? null,
      'HOTEL_CHECKIN',
      'Hotel check-in reminder',
      `${data.hotelName ?? 'Your hotel'} · check-in from tomorrow`
    );
    await doc.ref.update({ checkinReminderSent: true });
  }
}

export async function checkHotelCheckoutReminders(): Promise<void> {
  const tomorrow = new Date(Date.now() + 24 * HOUR).toISOString().slice(0, 10);

  const snapshot = await firestore
    .collection('hotelDetails')
    .where('checkOutDate', '==', tomorrow)
    .get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.checkoutReminderSent) continue;

    await sendReminder(
      data.uid,
      data.tripId ?? null,
      'HOTEL_CHECKOUT',
      'Hotel check-out reminder',
      `Check-out tomorrow at ${data.hotelName ?? 'your hotel'}`
    );
    await doc.ref.update({ checkoutReminderSent: true });
  }
}

export async function checkTripStartReminders(): Promise<void> {
  const tomorrow = new Date(Date.now() + 24 * HOUR).toISOString().slice(0, 10);

  const snapshot = await firestore
    .collection('trips')
    .where('startDate', '==', tomorrow)
    .get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.startReminderSent) continue;

    await sendReminder(
      data.userId,
      doc.id,
      'TRIP_START',
      `Trip to ${data.destination ?? 'your destination'} starts soon`,
      'Your trip begins tomorrow. Time to pack!'
    );
    await doc.ref.update({ startReminderSent: true });
  }
}
