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

  // The user document is now created by the `useUser` hook's onAuthStateChanged listener.
  // We still update the profile displayName here as it's part of the Auth user object.
  await updateProfile(user, {
    displayName: values.displayName,
  });
  
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
  // The useUser hook guarantees the document will be created, so we just need to read it.
  const snap = await getDoc(userRef);

  let userRole = 'user';

  if (snap.exists()) {
    userRole = snap.data().role;
  }
  
  if (userRole === 'admin') {
    router.replace('/admin');
  } else {
    router.replace('/dashboard');
  }
};
