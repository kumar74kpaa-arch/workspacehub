import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName,
      contactPerson,
      phone,
      email,
      teamSize,
      location,
      requirementType,
      targetStartDate,
      message,
    } = body;

    // Validation
    if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
      return NextResponse.json({ error: 'Company or organization name is required.' }, { status: 400 });
    }

    if (!contactPerson || typeof contactPerson !== 'string' || contactPerson.trim().length < 2) {
      return NextResponse.json({ error: 'Contact person name is required.' }, { status: 400 });
    }

    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json({ error: 'Valid 10-digit mobile number is required.' }, { status: 400 });
    }

    if (!email || !String(email).includes('@')) {
      return NextResponse.json({ error: 'A valid work email address is required.' }, { status: 400 });
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const referenceId = `CORP-${dateStr}-${randomHex}`;

    const newEnquiry = {
      referenceId,
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      phone: cleanPhone.length === 10 ? `+91${cleanPhone}` : `+${cleanPhone}`,
      email: email.trim().toLowerCase(),
      teamSize: teamSize || '1-5 people',
      location: location || 'all',
      locationName: location === 'banyan' ? 'The Banyan' : location === 'olive' ? 'The Olive' : 'Flexible / Both',
      requirementType: requirementType || 'Dedicated workstations',
      targetStartDate: targetStartDate || '',
      message: message ? String(message).trim() : '',
      status: 'New Enquiry', // New Enquiry | Contacted | Proposal Sent | Site Visit Done | Closed Won | Closed Lost
      createdAt: new Date().toISOString(),
      source: 'web_corporate_enquiry',
      notes: [],
    };

    try {
      await adminDb.collection('corporate_enquiries').doc(referenceId).set(newEnquiry);
    } catch (dbErr) {
      console.warn('[CORP_ENQUIRY_DB_WARN]', dbErr);
    }

    return NextResponse.json({
      success: true,
      referenceId,
      enquiry: newEnquiry,
    });
  } catch (err: any) {
    console.error('[CORP_ENQUIRY_API_ERROR]', err);
    return NextResponse.json({ error: 'Failed to process corporate enquiry.' }, { status: 500 });
  }
}
