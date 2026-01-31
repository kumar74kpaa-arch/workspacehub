import type { User, Workspace, Booking } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar-1');

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: userAvatar?.imageUrl,
  role: 'user',
  membershipPlanId: 'monthly-1',
};

export const mockAdmin: User = {
  id: 'admin-1',
  name: 'Maria Garcia',
  email: 'maria.garcia@deskify.com',
  avatarUrl: PlaceHolderImages.find((img) => img.id === 'user-avatar-2')?.imageUrl,
  role: 'admin',
};

export const mockWorkspaces: Workspace[] = [
  {
    id: 'desk-1',
    name: 'Sunny Window Desk',
    type: 'desk',
    capacity: 1,
    ...PlaceHolderImages.find((img) => img.id === 'workspace-1')!,
  },
  {
    id: 'room-1',
    name: 'The Boardroom',
    type: 'room',
    capacity: 8,
    ...PlaceHolderImages.find((img) => img.id === 'workspace-2')!,
  },
  {
    id: 'desk-2',
    name: 'Quiet Corner Booth',
    type: 'desk',
    capacity: 1,
    ...PlaceHolderImages.find((img) => img.id === 'workspace-3')!,
  },
  {
    id: 'room-2',
    name: 'Creative Lounge',
    type: 'room',
    capacity: 4,
    ...PlaceHolderImages.find((img) => img.id === 'workspace-4')!,
  },
];

export const mockBookings: (Booking & { workspaceName: string, workspaceType: 'desk' | 'room' })[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    workspaceId: 'desk-1',
    workspaceName: 'Sunny Window Desk',
    workspaceType: 'desk',
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    endTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: 'confirmed',
  },
  {
    id: 'booking-2',
    userId: 'user-1',
    workspaceId: 'room-1',
    workspaceName: 'The Boardroom',
    workspaceType: 'room',
    startTime: new Date(new Date().setDate(new Date().getDate() + 3)),
    endTime: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: 'confirmed',
  },
  {
    id: 'booking-3',
    userId: 'user-1',
    workspaceId: 'desk-2',
    workspaceName: 'Quiet Corner Booth',
    workspaceType: 'desk',
    startTime: new Date(new Date().setDate(new Date().getDate() - 2)),
    endTime: new Date(new Date().setDate(new Date().getDate() - 2)),
    status: 'confirmed',
  },
];
