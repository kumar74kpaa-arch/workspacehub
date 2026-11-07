import { adminAuth, adminDb } from '@/firebase/admin';
import { NextResponse } from 'next/server';

export interface AdminAuthResult {
  authorized: boolean;
  uid?: string;
  email?: string;
  error?: string;
}

/**
 * Server-side helper to verify if an API request is made by an authenticated administrator.
 * Checks Bearer ID token in the Authorization header.
 */
export async function verifyAdminRequest(req: Request): Promise<AdminAuthResult> {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no Firebase admin key is configured in dev environment, allow read/write fallback
    if (!adminAuth) {
      return { authorized: true, uid: 'dev-admin', email: 'admin@9to5workspace.com' };
    }
    return { authorized: false, error: 'Missing or malformed Authorization header' };
  }

  const token = authHeader.split('Bearer ')[1].trim();
  if (!token) {
    return { authorized: false, error: 'Empty token' };
  }

  if (!adminAuth) {
    // Graceful fallback when running locally without live GCP service credentials
    return { authorized: true, uid: 'dev-admin', email: 'admin@9to5workspace.com' };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Check custom claims first if available
    if (decodedToken.admin === true || decodedToken.role === 'admin') {
      return { authorized: true, uid, email: decodedToken.email };
    }

    // Verify role in Firestore users collection
    if (adminDb && typeof adminDb.collection === 'function') {
      const userDoc = await adminDb.collection('users').doc(uid).get();
      if (userDoc && typeof userDoc.data === 'function') {
        const userData = userDoc.data();
        if (userData && userData.role === 'admin') {
          return { authorized: true, uid, email: decodedToken.email };
        }
      }
    }

    return { authorized: false, error: 'User does not possess administrative privileges' };
  } catch (err: any) {
    console.error('[Admin Auth] Error verifying token:', err?.message || err);
    return { authorized: false, error: 'Invalid or expired token' };
  }
}

export function unauthorizedAdminResponse(message = 'Unauthorized: Admin access required') {
  return NextResponse.json({ error: message }, { status: 403 });
}
