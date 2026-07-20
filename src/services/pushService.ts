import { firestore, messaging } from '../config/firebaseAdmin';

export type NotificationType =
  | 'TRIP_START'
  | 'FLIGHT_REMINDER'
  | 'HOTEL_CHECKIN'
  | 'HOTEL_CHECKOUT'
  | 'GENERAL';

export async function sendReminder(
  uid: string,
  tripId: string | null,
  type: NotificationType,
  title: string,
  message: string
): Promise<void> {
  const userDoc = await firestore.collection('users').doc(uid).get();
  const token = userDoc.get('fcmToken') as string | undefined;

  // Always write the in-app notification doc, even if the push itself fails —
  // the Notifications screen should still show it.
  await firestore.collection('notifications').add({
    userId: uid,
    tripId,
    type,
    title,
    message,
    timestamp: new Date(),
    read: false,
  });

  if (!token) return;

  try {
    await messaging.send({
      token,
      notification: { title, body: message },
    });
  } catch (err) {
    console.error(`FCM send failed for uid=${uid}:`, err);
  }
}
