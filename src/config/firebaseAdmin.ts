import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

const app = getApps().length ? getApp() : initializeApp({
  credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
});

export const firestore: Firestore = getFirestore(app);
export const messaging: Messaging = getMessaging(app);
