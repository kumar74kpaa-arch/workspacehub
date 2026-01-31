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
    {
        id: 'workstation',
        name: 'Workstation',
        type: 'desk' as const,
        capacity: 1,
        // The booking component will handle the visual representation
        imageUrl: '',
        imageHint: '',
    },
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
    
    const today_10am = new Date(today);
    today_10am.setHours(10, 0, 0, 0);
    const today_12pm = new Date(today);
    today_12pm.setHours(12, 0, 0, 0);

    const today_2pm = new Date(today);
    today_2pm.setHours(14, 0, 0, 0);
    const today_3pm = new Date(today);
    today_3pm.setHours(15, 0, 0, 0);

    const tomorrow_2pm = new Date(tomorrow);
    tomorrow_2pm.setHours(14, 0, 0, 0);
    const tomorrow_5pm = new Date(tomorrow);
    tomorrow_5pm.setHours(17, 0, 0, 0);

    return [
      // Desk bookings for today
      {
        id: 'booking-ws-1',
        userId: 'user-2',
        workspaceId: 'WS-05',
        workspaceName: 'Workstation 05',
        workspaceType: 'desk',
        startTime: today_10am,
        endTime: today_12pm,
        status: 'confirmed',
      },
       {
        id: 'booking-ws-2',
        userId: 'user-3',
        workspaceId: 'WS-12',
        workspaceName: 'Workstation 12',
        workspaceType: 'desk',
        startTime: today_2pm,
        endTime: today_3pm,
        status: 'confirmed',
      },
      // Room bookings
      {
        id: 'booking-room-1',
        userId: 'user-1',
        workspaceId: 'conference-hall',
        workspaceName: 'Conference Hall',
        workspaceType: 'room',
        startTime: tomorrow_2pm,
        endTime: tomorrow_5pm,
        status: 'confirmed',
      },
       {
        id: 'booking-room-2',
        userId: 'user-1',
        workspaceId: 'mini-meeting-room',
        workspaceName: 'Mini Meeting Room',
        workspaceType: 'room',
        startTime: today_10am,
        endTime: today_12pm,
        status: 'confirmed',
      },
    ];
};
