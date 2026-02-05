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
  firestore: Firestore,
  values: { name: string; email: string; password: string }
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    values.email,
    values.password
  );
  const user = userCredential.user;

  await updateProfile(user, {
    displayName: values.name,
  });

  const userDocRef = doc(firestore, 'users', user.uid);
  await setDoc(userDocRef, {
    displayName: values.name,
    email: user.email,
    role: 'user',
    provider: 'password',
    createdAt: serverTimestamp(),
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
  const snap = await getDoc(userRef);

  let userRole = 'user';

  if (snap.exists()) {
    userRole = snap.data().role;
  } else {
    // The user document doesn't exist, so we create it.
    // This handles cases for first-time social/phone logins gracefully.
    await setDoc(userRef, {
      displayName: user.displayName || `User ${user.uid.substring(0,5)}`,
      email: user.email,
      photoURL: user.photoURL,
      role: 'user', // Default role for new users
      provider: user.providerData?.[0]?.providerId?.replace('.com', '') || 'password',
      createdAt: serverTimestamp(),
    });
    // The role is 'user' for the subsequent redirection logic.
    userRole = 'user';
  }

  if (userRole === 'admin') {
    router.push('/admin');
  } else {
    router.push('/dashboard');
  }
};
