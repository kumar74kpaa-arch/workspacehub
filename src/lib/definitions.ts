import type { Timestamp } from "firebase/firestore";

export type Office = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  membershipPlanId?: string;
};

export type Workspace = {
  id: string;
  officeId: string;
  name: string;
  type: 'desk' | 'room';
  capacity: number;
  imageUrl: string;
  imageHint: string;
  isActive?: boolean;
  isBookable?: boolean;
};

export type Booking = {
  id: string;
  officeId: string;
  userId: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
  workspaceType: 'desk' | 'room';
  date: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  isExtendedHours?: boolean;
  pricingType?: 'standard' | 'extended';
  paymentId?: string;
  orderId?: string;
  createdAt: Date;
  paidAmount?: number;
};

export type MembershipPlan = {
  id: string;
  name: string;
  price: number;
  period: 'day' | 'month' | 'year';
  features: string[];
};

export type Payment = {
  id: string;
  userId: string;
  amount: number;
  date: Date;
  status: 'succeeded' | 'failed';
  invoiceUrl?: string;
};

export type Space = {
  slug: string;
  name: string;
  description: string;
  keyAmenities: string[];
  imageUrl: string;
  imageHint: string;
  status: 'available' | 'coming-soon';
  details: {
    overview: string;
    amenities: {
      category: string;
      items: { name: string; description: string }[];
    }[];
    rules: string[];
    gallery: {
        id: string;
        title: string;
        imageUrls: string[];
    }[];
  };
};
