import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      contactInfo,
      bookingRef,
      natureOfComplaint,
      description,
      preferredChannel,
    } = body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Please provide your full name.' }, { status: 400 });
    }

    if (!contactInfo || typeof contactInfo !== 'string' || contactInfo.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a valid phone number or email address for response.' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please describe the nature and details of your grievance (minimum 10 characters).' },
        { status: 400 }
      );
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const referenceId = `GRV-${dateStr}-${randomHex}`;

    const newGrievance = {
      referenceId,
      fullName: fullName.trim(),
      contactInfo: contactInfo.trim(),
      bookingRef: bookingRef ? String(bookingRef).trim() : '',
      natureOfComplaint: natureOfComplaint || 'Data Privacy Request',
      description: description.trim(),
      preferredChannel: preferredChannel || 'Email / WhatsApp',
      status: 'Received', // Received | Under Review | Response Sent | Resolved | Closed
      createdAt: new Date().toISOString(),
      notes: [],
    };

    try {
      await adminDb.collection('grievances').doc(referenceId).set(newGrievance);
    } catch (dbErr) {
      console.warn('[GRIEVANCE_DB_WARN]', dbErr);
    }

    return NextResponse.json({
      success: true,
      referenceId,
      grievance: newGrievance,
    });
  } catch (err: any) {
    console.error('[GRIEVANCE_API_ERROR]', err);
    return NextResponse.json({ error: 'Failed to record grievance.' }, { status: 500 });
  }
}
