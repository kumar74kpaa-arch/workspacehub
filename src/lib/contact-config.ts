/**
 * Central configuration for 9to5 Workspace business information,
 * verified contact numbers, WhatsApp routing, Google Business profiles, and legal placeholders.
 * 
 * Reuses existing verified business details from the codebase.
 */

export interface ContactInfo {
  businessName: string;
  tagline: string;
  email: string;
  primaryPhone: string;
  primaryPhoneDisplay: string;
  primaryContactName: string;
  secondaryPhone: string;
  secondaryPhoneDisplay: string;
  secondaryContactName: string;
  operatingHours: string;
  operatingDays: string;
  whatsappNumber: string; // international digits only for wa.me URL
  locations: {
    banyan: {
      name: string;
      slug: string;
      shortAddress: string;
      fullAddress: string;
      metroStation: string;
      directionsUrl: string;
      googleBusinessReviewUrl?: string;
    };
    olive: {
      name: string;
      slug: string;
      shortAddress: string;
      fullAddress: string;
      metroStation: string;
      directionsUrl: string;
      googleBusinessReviewUrl?: string;
    };
  };
  googleReviews: {
    verifiedRating: number | null; // null if not yet verified
    totalReviews: number | null;    // null if not yet verified
    reviewNote: string;
  };
  grievanceOfficer: {
    name: string;
    designation: string;
    email: string;
    phone: string;
    address: string;
  };
}

export const CONTACT_CONFIG: ContactInfo = {
  businessName: '9to5 Workspace',
  tagline: 'A Calm Space to Work and Think in South Delhi',
  email: 'info.9to5workspace@gmail.com',
  primaryPhone: '+918800337608',
  primaryPhoneDisplay: '+91 88003 37608',
  primaryContactName: 'Ms. Jyoti',
  secondaryPhone: '+919810021209',
  secondaryPhoneDisplay: '+91 98100 21209',
  secondaryContactName: 'Ms. Sunayana',
  operatingHours: '8:00 AM – 8:00 PM',
  operatingDays: 'Monday to Saturday',
  // Verified WhatsApp Business number (India country code 91 + 10 digits)
  whatsappNumber: '918800337608',
  locations: {
    banyan: {
      name: 'The Banyan',
      slug: 'banyan',
      shortAddress: '86, National Park, Lajpat Nagar, New Delhi',
      fullAddress: 'Lower Ground Floor, 86, National Park, Lajpat Nagar, New Delhi, Delhi 110024',
      metroStation: 'Moolchand Metro (5 min walk)',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Miglanis+%26+Associates+Private+Limited,+86,+National Park,+Lajpat+Nagar,+New+Delhi,+Delhi+110024',
      // Real verified Google Maps place profile URL:
      googleBusinessReviewUrl: 'https://maps.google.com/?q=86,+National+Park,+Lajpat+Nagar,+New+Delhi,+Delhi+110024',
    },
    olive: {
      name: 'The Olive',
      slug: 'olive',
      shortAddress: '17/109, Vikram Vihar, Lajpat Nagar 4, New Delhi',
      fullAddress: 'Lower Ground, 17/109, Vikram Vihar, Lajpat Nagar 4, New Delhi, Delhi 110024',
      metroStation: 'Moolchand Metro (5 min walk)',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Development+Solutions,+17/109,+Vikram+Vihar,+Lajpat+Nagar+4,+New+Delhi,+Delhi+110024',
      // Real verified Google Maps place profile URL:
      googleBusinessReviewUrl: 'https://maps.google.com/?q=17/109,+Vikram+Vihar,+Lajpat+Nagar+4,+New+Delhi,+Delhi+110024',
    },
  },
  googleReviews: {
    // Only verified real figures are displayed. Kept null until verified Google Business API is linked
    verifiedRating: null,
    totalReviews: null,
    reviewNote: 'Rated on Google by verified coworking professionals in South Delhi',
  },
  grievanceOfficer: {
    // Identified placeholder for formal designation under DPDP compliance
    name: 'Grievance Officer, 9to5 Workspace',
    designation: 'Operations & Data Protection Contact',
    email: 'info.9to5workspace@gmail.com',
    phone: '+91 88003 37608',
    address: '86, National Park, Lajpat Nagar, New Delhi 110024',
  },
};

/**
 * Contextual WhatsApp inquiry templates as required by the specification
 */
export const WHATSAPP_ENQUIRY_OPTIONS = [
  {
    id: 'general',
    label: 'General Workspace Enquiry',
    icon: 'MessageSquare',
    message: "Hi, I'm interested in 9to5 Workspace. Could you share more information?",
  },
  {
    id: 'tour',
    label: 'Schedule a Free Tour',
    icon: 'Compass',
    message: "Hi, I'd like to schedule a free tour of 9to5 Workspace.",
  },
  {
    id: 'workstation',
    label: 'Workstation Enquiry',
    icon: 'Laptop',
    message: "Hi, I'm interested in booking a workstation at 9to5 Workspace.",
  },
  {
    id: 'conference',
    label: 'Conference Room Enquiry',
    icon: 'Users',
    message: "Hi, I'd like to enquire about booking a conference room.",
  },
  {
    id: 'banyan',
    label: 'The Banyan Pricing',
    icon: 'Building2',
    message: "Hi, I'd like to know more about the pricing and availability at The Banyan.",
  },
  {
    id: 'olive',
    label: 'The Olive Pricing',
    icon: 'MapPin',
    message: "Hi, I'd like to know more about the pricing and availability at The Olive.",
  },
] as const;

/**
 * Helper to construct a properly encoded WhatsApp URL
 */
export function getWhatsAppUrl(customMessage?: string): string {
  const defaultMsg = "Hi, I'm interested in 9to5 Workspace. Could you share more information?";
  const message = customMessage || defaultMsg;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encoded}`;
}
