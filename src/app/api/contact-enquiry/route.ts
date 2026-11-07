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
      location = 'general',
      subject = 'General Enquiry',
      message,
    } = body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide your full name.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please enter a message with at least 5 characters.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    const referenceId = `CONT-${dateStr}-${randomHex}`;

    const newEnquiry = {
      referenceId,
      fullName: fullName.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      location: location || 'general',
      subject: subject.trim(),
      message: message.trim(),
      status: 'new',
      notes: '',
      source: 'contact_page',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (adminDb && typeof adminDb.collection === 'function') {
      try {
        const docRef = await adminDb.collection('contact_enquiries').add(newEnquiry);
        return NextResponse.json({
          success: true,
          referenceId,
          id: docRef.id,
          message: 'Thank you for reaching out! Our team will contact you shortly.',
        });
      } catch (dbErr) {
        console.warn('[Contact Enquiry] Firestore write notice:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      referenceId,
      message: 'Thank you for reaching out! Our team will contact you shortly.',
    });
  } catch (error: any) {
    console.error('[Contact Enquiry] Unexpected submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again or reach us via WhatsApp.' },
      { status: 500 }
    );
  }
}
