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

  // The user document is created by the redirect function or the `useUser` hook.
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
  const snap = await getDoc(userRef);

  let userRole = 'user';

  if (snap.exists()) {
    userRole = snap.data().role;
  } else {
    // If user document doesn't exist, create it.
    // This handles race conditions on first login/signup.
    const providerId = user.providerData?.[0]?.providerId?.replace('.com', '') || 'password';
    await setDoc(userRef, {
        displayName: user.displayName || user.email?.split('@')[0] || "User",
        email: user.email || "",
        phone: user.phoneNumber || "",
        role: 'user', // Default role on creation
        credits: 0,
        createdAt: serverTimestamp(),
        photoURL: user.photoURL || null,
        provider: providerId,
    });
    // The role is 'user' for a newly created document.
  }
  
  if (userRole === 'admin') {
    router.replace('/admin');
  } else {
    router.replace('/dashboard');
  }
};
