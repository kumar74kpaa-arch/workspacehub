export interface Testimonial {
  id: string;
  authorName: string;
  authorRole?: string;
  companyName?: string;
  location: 'banyan' | 'olive' | 'all';
  rating: number; // 1 to 5
  quote: string;
  published: boolean;
  verifiedMember: boolean;
  dateAdded: string;
}

// Initial template / verified schema
// Note: As per guidelines, no fake customer names or reviews are published by default.
export const INITIAL_TESTIMONIALS: Testimonial[] = [];
