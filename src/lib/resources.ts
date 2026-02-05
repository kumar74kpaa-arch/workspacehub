import type { Workspace } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const workstationImage = PlaceHolderImages.find((img) => img.id === 'workstation-image');
const conferenceHallImage = PlaceHolderImages.find((img) => img.id === 'conference-hall-image');
const meetingRoomImage = PlaceHolderImages.find((img) => img.id === 'mini-meeting-room-image');

if (!workstationImage || !conferenceHallImage || !meetingRoomImage) {
  throw new Error('Required placeholder images for workspaces are missing.');
}

const office1Workstations: Workspace[] = Array.from({ length: 16 }, (_, i) => ({
    id: `WS-${String(i + 1).padStart(2, '0')}`,
    officeId: 'OFFICE-01',
    name: `Workstation ${String(i + 1).padStart(2, '0')}`,
    type: 'desk' as const,
    capacity: 1,
    imageUrl: workstationImage.imageUrl,
    imageHint: workstationImage.imageHint,
    isActive: true,
    isBookable: true,
}));

const office1Rooms: Workspace[] = [
    {
        id: 'MR-12',
        officeId: 'OFFICE-01',
        name: 'The Boardroom (12p)',
        type: 'room' as const,
        capacity: 12,
        imageUrl: conferenceHallImage.imageUrl,
        imageHint: conferenceHallImage.imageHint,
        isActive: true,
        isBookable: true,
    },
];

const office2Workstations: Workspace[] = Array.from({ length: 12 }, (_, i) => ({
    id: `WS2-${String(i + 1).padStart(2, '0')}`,
    officeId: 'OFFICE-02',
    name: `Workstation ${String(i + 1).padStart(2, '0')}`,
    type: 'desk' as const,
    capacity: 1,
    imageUrl: workstationImage.imageUrl,
    imageHint: workstationImage.imageHint,
    isActive: true,
    isBookable: true,
}));

const office2Rooms: Workspace[] = [
    {
        id: 'MR2-06',
        officeId: 'OFFICE-02',
        name: 'Focus Room (6p)',
        type: 'room' as const,
        capacity: 6,
        imageUrl: meetingRoomImage.imageUrl,
        imageHint: meetingRoomImage.imageHint,
        isActive: true,
        isBookable: true,
    },
    {
        id: 'MR2-12',
        officeId: 'OFFICE-02',
        name: 'Strategy Hall (12p)',
        type: 'room' as const,
        capacity: 12,
        imageUrl: conferenceHallImage.imageUrl,
        imageHint: conferenceHallImage.imageHint,
        isActive: true,
        isBookable: true,
    },
];

export const allResources: Workspace[] = [
    ...office1Workstations,
    ...office1Rooms,
    ...office2Workstations,
    ...office2Rooms,
];
