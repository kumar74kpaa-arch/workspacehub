'use client';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
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
  userId: string,
  router: AppRouterInstance
) => {
  const userRef = doc(firestore, 'users', userId);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const role = snap.data().role;
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } else {
    // This case would be for a new user, likely from a social provider,
    // who doesn't have a doc yet. Default to the user dashboard.
    router.push('/dashboard');
  }
};
