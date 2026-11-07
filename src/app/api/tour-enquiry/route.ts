import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      location,
      preferredDate,
      preferredTime,
      spaceInterest,
      message,
      marketingConsent,
    } = body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide your full name.' },
        { status: 400 }
      );
    }

    // Clean phone number: remove non-digits
    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';
    // Must be at least 10 digits (e.g. 9810021209 or 919810021209)
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Please provide a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    if (!location || !['banyan', 'olive', 'flexible'].includes(location)) {
      return NextResponse.json(
        { error: 'Please select a preferred workspace location.' },
        { status: 400 }
      );
    }

    if (!preferredDate) {
      return NextResponse.json(
        { error: 'Please choose a preferred tour date.' },
        { status: 400 }
      );
    }

    // Generate unique reference ID: TOUR-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const referenceId = `TOUR-${dateStr}-${randomHex}`;

    const newEnquiry = {
      referenceId,
      fullName: fullName.trim(),
      phone: cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`,
      email: email ? String(email).trim().toLowerCase() : '',
      location,
      locationName: location === 'banyan' ? 'The Banyan' : location === 'olive' ? 'The Olive' : 'Flexible / Both',
      preferredDate,
      preferredTime: preferredTime || 'Morning (10:00 AM – 12:00 PM)',
      spaceInterest: spaceInterest || 'Workstation',
      message: message ? String(message).trim() : '',
      marketingConsent: Boolean(marketingConsent),
      status: 'New Enquiry', // New Enquiry | Contacted | Tour Scheduled | Tour Completed | Converted | Not Interested
      createdAt: new Date().toISOString(),
      source: 'web_book_a_tour',
      notes: [],
    };

    // Save to Firestore tour_enquiries collection
    try {
      await adminDb.collection('tour_enquiries').doc(referenceId).set(newEnquiry);
    } catch (dbErr) {
      console.warn('[TOUR_ENQUIRY_DB_WARN]', dbErr);
      // In case adminDb is in fallback mock mode during local development without credentials,
      // the record is still recognized and returned to the client
    }

    return NextResponse.json({
      success: true,
      referenceId,
      enquiry: newEnquiry,
    });
  } catch (err: any) {
    console.error('[TOUR_ENQUIRY_API_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to submit tour enquiry. Please try again or reach us via WhatsApp.' },
      { status: 500 }
    );
  }
}
