'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { initializeFirebase } from './index';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<FirebaseContextValue>({
    app: null,
    auth: null,
    firestore: null,
  });

  useEffect(() => {
    const { app, auth, firestore } = initializeFirebase();
    setValue({ app, auth, firestore });
  }, []);

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebaseApp = () => useContext(FirebaseContext).app;
export const useAuth = () => useContext(FirebaseContext).auth;
export const useFirestore = () => useContext(FirebaseContext).firestore;
