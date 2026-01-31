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

export const mockWorkspaces: Workspace[] = [
  ...Array.from({ length: 16 }, (_, i) => ({
    id: `workstation-${i + 1}`,
    name: `Workstation ${i + 1}`,
    type: 'desk' as const,
    capacity: 1,
    imageUrl: workstationImage.imageUrl,
    imageHint: workstationImage.imageHint,
  })),
  {
    id: 'conference-hall',
    name: 'Conference Hall',
    type: 'room',
    capacity: 12,
    imageUrl: conferenceHallImage.imageUrl,
    imageHint: conferenceHallImage.imageHint,
  },
  {
    id: 'mini-meeting-room',
    name: 'Mini Meeting Room',
    type: 'room',
    capacity: 4,
    imageUrl: miniMeetingRoomImage.imageUrl,
    imageHint: miniMeetingRoomImage.imageHint,
  },
];

export const getMockBookings = (): (Booking & { workspaceName: string, workspaceType: 'desk' | 'room' })[] => {
    const today = new Date();
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    threeDaysFromNow.setHours(14, 0, 0, 0);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    twoDaysAgo.setHours(13, 0, 0, 0);


    return [
      {
        id: 'booking-1',
        userId: 'user-1',
        workspaceId: 'workstation-5',
        workspaceName: 'Workstation 5',
        workspaceType: 'desk',
        startTime: tomorrow,
        endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        status: 'confirmed',
      },
      {
        id: 'booking-2',
        userId: 'user-1',
        workspaceId: 'conference-hall',
        workspaceName: 'Conference Hall',
        workspaceType: 'room',
        startTime: threeDaysFromNow,
        endTime: new Date(threeDaysFromNow.getTime() + 3 * 60 * 60 * 1000), // 3 hours later
        status: 'confirmed',
      },
      {
        id: 'booking-3',
        userId: 'user-1',
        workspaceId: 'workstation-1',
        workspaceName: 'Workstation 1',
        workspaceType: 'desk',
        startTime: twoDaysAgo,
        endTime: new Date(twoDaysAgo.getTime() + 4 * 60 * 60 * 1000), // 4 hours later
        status: 'confirmed',
      },
    ];
};
