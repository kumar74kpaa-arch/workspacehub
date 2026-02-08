'use client';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const signupUserWithPassword = async (
  auth: Auth,
  values: { displayName: string; email: string; password: string }
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    values.email,
    values.password
  );
  const user = userCredential.user;

  await updateProfile(user, {
    displayName: values.displayName,
  });

  // The user document is now created by the `useUser` hook's onAuthStateChanged listener.
  return user;
};

export const loginUserWithPassword = async (
  auth: Auth,
  values: { email: string; password: string }
) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    values.email,
    values.password
  );
  return userCredential.user;
};

export const redirectUserBasedOnRole = async (
  firestore: Firestore,
  user: User,
  router: AppRouterInstance
) => {
  const userRef = doc(firestore, 'users', user.uid);
  const snap = await getDoc(userRef);

  let userRole = 'user';

  if (snap.exists()) {
    userRole = snap.data().role;
  }
  // The user document creation logic is now centralized in the `useUser` hook.
  // If the document doesn't exist, the role will default to 'user', which is correct for new sign-ups.

  if (userRole === 'admin') {
    router.push('/admin');
  } else {
    router.push('/dashboard');
  }
};
