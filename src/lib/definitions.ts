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
  name: string;
  type: 'desk' | 'room';
  capacity: number;
  imageUrl: string;
  imageHint: string;
  isActive?: boolean;
};

export type Booking = {
  id: string;
  userId: string;
  userName: string;
  workspaceId: string;
  workspaceName: string;
  workspaceType: 'desk' | 'room';
  date: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  isExtendedHours?: boolean;
  pricingType?: 'standard' | 'extended';
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
