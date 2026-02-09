import admin from 'firebase-admin';
import { firebaseConfig } from './config';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            databaseURL: firebaseConfig.authDomain,
        });
    } catch (error) {
        // In a serverless environment (like Vercel functions), you might initialize
        // without explicit credentials if the service account is configured in the environment.
        if (process.env.VERCEL) {
             admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
            });
        } else {
            console.error('Firebase admin initialization error', error);
        }
    }
}

export const adminDb = admin.firestore();
