import type { User } from './definitions';
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
  email: 'maria.garcia@workspacehub.com',
  avatarUrl: PlaceHolderImages.find((img) => img.id === 'user-avatar-2')?.imageUrl,
  role: 'admin',
};
