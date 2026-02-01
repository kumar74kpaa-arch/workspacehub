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
  email: 'maria.garcia@workspacehub.com',
  avatarUrl: PlaceHolderImages.find((img) => img.id === 'user-avatar-2')?.imageUrl,
  role: 'admin',
};

const workstationImage = PlaceHolderImages.find((img) => img.id === 'workstation-image');
const conferenceHallImage = PlaceHolderImages.find((img) => img.id === 'conference-hall-image');
const miniMeetingRoomImage = PlaceHolderImages.find((img) => img.id === 'mini-meeting-room-image');

if (!workstationImage || !conferenceHallImage || !miniMeetingRoomImage) {
  throw new Error('Required placeholder images for workspaces are missing.');
}

export const getMockWorkspaces = (): Workspace[] => [
    ...Array.from({ length: 16 }, (_, i) => ({
        id: `WS-${String(i + 1).padStart(2, '0')}`,
        name: `Workstation ${String(i + 1).padStart(2, '0')}`,
        type: 'desk' as const,
        capacity: 1,
        imageUrl: workstationImage.imageUrl,
        imageHint: workstationImage.imageHint,
        isActive: true,
    })),
    {
        id: 'conference-hall',
        name: 'Conference Hall',
        type: 'room' as const,
        capacity: 12,
        imageUrl: conferenceHallImage.imageUrl,
        imageHint: conferenceHallImage.imageHint,
        isActive: true,
    },
    {
        id: 'mini-meeting-room',
        name: 'Mini Meeting Room',
        type: 'room' as const,
        capacity: 4,
        imageUrl: miniMeetingRoomImage.imageUrl,
        imageHint: miniMeetingRoomImage.imageHint,
        isActive: false,
    },
];
