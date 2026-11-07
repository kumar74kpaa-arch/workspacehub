import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const apps = getApps();

if (!apps.length) { 
  const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/\r/g, '').replace(/"/g, '').trim() : undefined;

  if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    privateKey &&
    privateKey.includes('-----BEGIN PRIVATE KEY-----')
  ) {
    try {
      initializeApp({ 
        credential: cert({ 
          projectId: process.env.FIREBASE_PROJECT_ID, 
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL, 
          privateKey: privateKey, 
        }), 
        databaseURL: 'https://' + process.env.FIREBASE_PROJECT_ID + '.firebaseio.com', 
      }); 
    } catch (e) {
      console.warn('[AI Studio] Firebase Admin initialization error:', e);
    }
  }
}

import { getAuth } from 'firebase-admin/auth';

let adminDbInstance: any;
let adminAuthInstance: any;

try {
  if (getApps().length) {
    adminDbInstance = getFirestore();
    adminAuthInstance = getAuth();
  }
} catch (e) {
  console.warn('[AI Studio] Could not obtain Firestore/Auth admin instance:', e);
}

if (!adminDbInstance) {
  adminDbInstance = {
    collection: (_col: string) => ({
      doc: (_id: string) => ({
        get: async () => ({ exists: false, data: () => null }),
        set: async (_data: any) => {},
        update: async (_data: any) => {},
      }),
    }),
  };
}

export const adminDb = adminDbInstance;
export const adminAuth = adminAuthInstance;

