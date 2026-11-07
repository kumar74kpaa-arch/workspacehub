import { NextResponse } from 'next/server';
import { adminDb } from '@/firebase/admin';
import { verifyAdminRequest, unauthorizedAdminResponse } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return unauthorizedAdminResponse(auth.error);
  }

  const { searchParams } = new URL(req.url);
  const typeFilter = searchParams.get('type') || 'all';
  const statusFilter = searchParams.get('status') || 'all';
  const locationFilter = searchParams.get('location') || 'all';
  const searchQuery = (searchParams.get('search') || '').toLowerCase().trim();

  try {
    const results: any[] = [];

    if (!adminDb || typeof adminDb.collection !== 'function') {
      return NextResponse.json({ enquiries: [], total: 0 });
    }

    // Helper to fetch collection
    const fetchColl = async (collName: string, category: string) => {
      try {
        const snap = await adminDb.collection(collName).get();
        if (snap && snap.docs) {
          snap.docs.forEach((doc: any) => {
            const data = doc.data();
            results.push({
              id: doc.id,
              collection: collName,
              formType: category,
              ...data,
              createdAt: data.createdAt || new Date().toISOString(),
              status: data.status || 'new',
            });
          });
        }
      } catch (err) {
        console.warn(`[Admin Enquiries] Notice fetching ${collName}:`, err);
      }
    };

    const fetchPromises: Promise<void>[] = [];

    if (typeFilter === 'all' || typeFilter === 'tour') {
      fetchPromises.push(fetchColl('tour_enquiries', 'tour'));
    }
    if (typeFilter === 'all' || typeFilter === 'corporate') {
      fetchPromises.push(fetchColl('corporate_enquiries', 'corporate'));
    }
    if (typeFilter === 'all' || typeFilter === 'contact') {
      fetchPromises.push(fetchColl('contact_enquiries', 'contact'));
    }
    if (typeFilter === 'all' || typeFilter === 'grievance') {
      fetchPromises.push(fetchColl('grievances', 'grievance'));
    }
    if (typeFilter === 'all' || typeFilter === 'testimonial') {
      fetchPromises.push(fetchColl('testimonials', 'testimonial'));
    }

    await Promise.all(fetchPromises);

    // Sort descending by creation date
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply filters
    let filtered = results;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => {
        const s = (item.status || 'new').toLowerCase();
        return s === statusFilter.toLowerCase();
      });
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter((item) => {
        const loc = (item.location || item.preferredLocation || '').toLowerCase();
        return loc.includes(locationFilter.toLowerCase());
      });
    }

    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const name = (item.fullName || item.name || '').toLowerCase();
        const email = (item.email || '').toLowerCase();
        const phone = (item.phone || '').toLowerCase();
        const company = (item.companyName || '').toLowerCase();
        const refId = (item.referenceId || item.ticketId || item.id || '').toLowerCase();
        const msg = (item.message || item.description || item.quote || '').toLowerCase();

        return (
          name.includes(searchQuery) ||
          email.includes(searchQuery) ||
          phone.includes(searchQuery) ||
          company.includes(searchQuery) ||
          refId.includes(searchQuery) ||
          msg.includes(searchQuery)
        );
      });
    }

    return NextResponse.json({
      enquiries: filtered,
      total: filtered.length,
      counts: {
        total: results.length,
        new: results.filter((r) => (r.status || 'new').toLowerCase() === 'new').length,
        contacted: results.filter((r) => (r.status || '').toLowerCase() === 'contacted').length,
        tours: results.filter((r) => r.formType === 'tour').length,
        corporate: results.filter((r) => r.formType === 'corporate').length,
        contact: results.filter((r) => r.formType === 'contact').length,
        grievances: results.filter((r) => r.formType === 'grievance').length,
        testimonials: results.filter((r) => r.formType === 'testimonial').length,
      },
    });
  } catch (error: any) {
    console.error('[Admin Enquiries] Fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return unauthorizedAdminResponse(auth.error);
  }

  try {
    const body = await req.json();
    const { id, collection, status, notes } = body;

    if (!id || !collection) {
      return NextResponse.json({ error: 'Missing submission ID or collection' }, { status: 400 });
    }

    const validCollections = [
      'tour_enquiries',
      'corporate_enquiries',
      'contact_enquiries',
      'grievances',
      'testimonials',
    ];

    if (!validCollections.includes(collection)) {
      return NextResponse.json({ error: 'Invalid collection specified' }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
      updatedBy: auth.email || auth.uid || 'admin',
    };

    if (status !== undefined) {
      updates.status = status;
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    if (adminDb && typeof adminDb.collection === 'function') {
      await adminDb.collection(collection).doc(id).set(updates, { merge: true });
    }

    return NextResponse.json({ success: true, message: 'Enquiry updated successfully' });
  } catch (error: any) {
    console.error('[Admin Enquiries] Update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update enquiry' }, { status: 500 });
  }
}
