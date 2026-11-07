import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    let enquiries: any[] = [];
    try {
      const snapshot = await adminDb.collection('tour_enquiries').orderBy('createdAt', 'desc').get();
      if (snapshot && !snapshot.empty) {
        enquiries = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
    } catch (dbErr) {
      console.warn('[ADMIN_TOUR_ENQUIRIES_GET_WARN]', dbErr);
    }

    return NextResponse.json({ enquiries });
  } catch (err: any) {
    console.error('[ADMIN_TOUR_ENQUIRIES_GET_ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch tour enquiries.' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { referenceId, status, note } = await req.json();

    if (!referenceId) {
      return NextResponse.json({ error: 'Missing referenceId' }, { status: 400 });
    }

    const docRef = adminDb.collection('tour_enquiries').doc(referenceId);
    const existing = await docRef.get();

    const updateData: any = {};
    if (status) {
      updateData.status = status;
    }

    if (note && typeof note === 'string' && note.trim().length > 0) {
      const existingNotes = existing.exists ? (existing.data().notes || []) : [];
      updateData.notes = [
        ...existingNotes,
        {
          text: note.trim(),
          addedAt: new Date().toISOString(),
        },
      ];
    }

    await docRef.update(updateData);

    return NextResponse.json({ success: true, updated: updateData });
  } catch (err: any) {
    console.error('[ADMIN_TOUR_ENQUIRIES_PATCH_ERROR]', err);
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
  }
}
