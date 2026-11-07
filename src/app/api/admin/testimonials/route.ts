import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let testimonials: any[] = [];
    try {
      const snapshot = await adminDb.collection('testimonials').get();
      if (snapshot && !snapshot.empty) {
        testimonials = snapshot.docs.map((d: any) => ({
          id: d.id,
          ...d.data(),
        }));
      }
    } catch (err) {
      console.warn('[ADMIN_TESTIMONIALS_GET_WARN]', err);
    }
    return NextResponse.json({ testimonials });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorName, authorRole, companyName, location, rating, quote, published } = body;

    if (!authorName || !quote) {
      return NextResponse.json({ error: 'Author name and review quote are required.' }, { status: 400 });
    }

    const id = `testim-${Date.now()}`;
    const newDoc = {
      id,
      authorName: authorName.trim(),
      authorRole: authorRole ? authorRole.trim() : '',
      companyName: companyName ? companyName.trim() : '',
      location: location || 'all',
      rating: Number(rating) || 5,
      quote: quote.trim(),
      published: Boolean(published),
      verifiedMember: true,
      dateAdded: new Date().toISOString(),
    };

    await adminDb.collection('testimonials').doc(id).set(newDoc);
    return NextResponse.json({ success: true, testimonial: newDoc });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to save testimonial' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, published, quote, authorName, authorRole, companyName, location, rating } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing testimonial id' }, { status: 400 });
    }

    const updates: any = {};
    if (typeof published === 'boolean') updates.published = published;
    if (quote) updates.quote = quote;
    if (authorName) updates.authorName = authorName;
    if (authorRole !== undefined) updates.authorRole = authorRole;
    if (companyName !== undefined) updates.companyName = companyName;
    if (location) updates.location = location;
    if (rating !== undefined) updates.rating = Number(rating);

    await adminDb.collection('testimonials').doc(id).update(updates);
    return NextResponse.json({ success: true, updates });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id param' }, { status: 400 });
    }

    await adminDb.collection('testimonials').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
