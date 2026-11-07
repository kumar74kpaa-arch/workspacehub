import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let testimonials: any[] = [];
    try {
      const snapshot = await adminDb
        .collection('testimonials')
        .where('published', '==', true)
        .get();

      if (snapshot && !snapshot.empty) {
        testimonials = snapshot.docs.map((d: any) => ({
          id: d.id,
          ...d.data(),
        }));
      }
    } catch (err) {
      console.warn('[TESTIMONIALS_PUBLIC_GET_WARN]', err);
    }

    return NextResponse.json({ testimonials });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
