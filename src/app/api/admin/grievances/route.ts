import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let grievances: any[] = [];
    try {
      const snapshot = await adminDb
        .collection('grievances')
        .orderBy('createdAt', 'desc')
        .get();

      if (snapshot && !snapshot.empty) {
        grievances = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
    } catch (err) {
      console.warn('[ADMIN_GRIEVANCES_GET_WARN]', err);
    }
    return NextResponse.json({ grievances });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch grievances' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { referenceId, status, note } = await req.json();

    if (!referenceId) {
      return NextResponse.json({ error: 'Missing referenceId' }, { status: 400 });
    }

    const docRef = adminDb.collection('grievances').doc(referenceId);
    const existing = await docRef.get();

    const updates: any = {};
    if (status) updates.status = status;

    if (note && typeof note === 'string' && note.trim().length > 0) {
      const existingNotes = existing.exists ? (existing.data().notes || []) : [];
      updates.notes = [
        ...existingNotes,
        {
          text: note.trim(),
          addedAt: new Date().toISOString(),
        },
      ];
    }

    await docRef.update(updates);
    return NextResponse.json({ success: true, updates });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update grievance record' }, { status: 500 });
  }
}
