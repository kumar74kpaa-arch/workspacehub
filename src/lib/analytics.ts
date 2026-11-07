/**
 * Privacy-safe website event tracking for 9to5 Workspace.
 * 
 * Safely integrates with Google Analytics 4 (gtag) if NEXT_PUBLIC_GA_MEASUREMENT_ID is present.
 * Does NOT send names, phone numbers, email addresses or other PII to analytics.
 */

declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, any>) => void;
    dataLayer?: any[];
  }
}

export type AnalyticsEventName =
  | 'whatsapp_click'
  | 'phone_click'
  | 'free_tour_submit'
  | 'corporate_enquiry_submit'
  | 'grievance_submit'
  | 'pricing_view'
  | 'booking_start'
  | 'booking_complete'
  | 'directions_click';

export interface AnalyticsEventParams {
  category?: string;
  label?: string;
  value?: number;
  location?: 'banyan' | 'olive' | 'all';
  channel?: string;
  source?: string;
  [key: string]: any;
}

export function trackEvent(name: AnalyticsEventName, params?: AnalyticsEventParams): void {
  try {
    // Only fire in browser environment
    if (typeof window === 'undefined') return;

    // Filter out any accidental PII properties
    const safeParams: Record<string, any> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey.includes('name') ||
          lowerKey.includes('phone') ||
          lowerKey.includes('email') ||
          lowerKey.includes('message') ||
          lowerKey.includes('address')
        ) {
          continue; // Discard potential PII
        }
        safeParams[key] = value;
      }
    }

    // Call window.gtag if initialized
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, safeParams);
    }

    // Optional console log during local development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics Event: ${name}]`, safeParams);
    }
  } catch (err) {
    // Fail silently without disrupting user experience
  }
}
