'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useAuth, useFirestore } from '../provider';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface UserState {
  user: User | null;
  loading: boolean;
}

export function useUser(): UserState {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth && firestore) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(firestore, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            // New user, create the document.
            await setDoc(userRef, {
              displayName: user.displayName || user.email?.split('@')[0] || "User",
              email: user.email || "",
              phone: user.phoneNumber || "",
              role: 'user', // Default role
              credits: 0,
              createdAt: serverTimestamp(),
              photoURL: user.photoURL || null,
              provider: user.providerData?.[0]?.providerId?.replace('.com', '') || 'password',
            });
          }
          // For both new and existing users, set the user state
          setUser(user);
        } else {
          // User logged out
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else if (!auth || !firestore) {
      // If Firebase services are not available, stop loading.
      setLoading(false);
    }
  }, [auth, firestore]);

  return { user, loading };
}
