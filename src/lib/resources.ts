import type { Workspace } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const workstationImage = PlaceHolderImages.find((img) => img.id === 'workstation-image');
const conferenceHallImage = PlaceHolderImages.find((img) => img.id === 'conference-hall-image');
const meetingRoomImage = PlaceHolderImages.find((img) => img.id === 'mini-meeting-room-image');

if (!workstationImage || !conferenceHallImage || !meetingRoomImage) {
  throw new Error('Required placeholder images for workspaces are missing.');
}

// Resources for The Banyan (Premium)
const banyanWorkstations: Workspace[] = Array.from({ length: 12 }, (_, i) => ({
    id: `BANYAN-WS-${String(i + 1).padStart(2, '0')}`,
    officeId: 'banyan',
    name: `Workstation ${String(i + 1).padStart(2, '0')}`,
    type: 'desk' as const,
    capacity: 1,
    imageUrl: workstationImage.imageUrl,
    imageHint: workstationImage.imageHint,
    isActive: true,
    isBookable: true,
}));

const banyanRooms: Workspace[] = [
    {
        id: 'BANYAN-MR-12',
        officeId: 'banyan',
        name: 'The Banyan Conference Room',
        type: 'room' as const,
        capacity: 12,
        imageUrl: conferenceHallImage.imageUrl,
        imageHint: conferenceHallImage.imageHint,
        isActive: true,
        isBookable: true,
    },
    {
        id: 'BANYAN-MR-06',
        officeId: 'banyan',
        name: 'The Banyan Meeting Room',
        type: 'room' as const,
        capacity: 6,
        imageUrl: meetingRoomImage.imageUrl,
        imageHint: meetingRoomImage.imageHint,
        isActive: true,
        isBookable: true,
    },
];

// Resources for The Olive (Standard)
const oliveWorkstations: Workspace[] = Array.from({ length: 16 }, (_, i) => ({
    id: `OLIVE-WS-${String(i + 1).padStart(2, '0')}`,
    officeId: 'olive',
    name: `Workstation ${String(i + 1).padStart(2, '0')}`,
    type: 'desk' as const,
    capacity: 1,
    imageUrl: workstationImage.imageUrl,
    imageHint: workstationImage.imageHint,
    isActive: true,
    isBookable: true,
}));

const oliveRooms: Workspace[] = [
    {
        id: 'OLIVE-MR-12',
        officeId: 'olive',
        name: 'The Olive Conference Room',
        type: 'room' as const,
        capacity: 12,
        imageUrl: conferenceHallImage.imageUrl,
        imageHint: conferenceHallImage.imageHint,
        isActive: true,
        isBookable: true,
    },
];

export const allResources: Workspace[] = [
    ...banyanWorkstations,
    ...banyanRooms,
    ...oliveWorkstations,
    ...oliveRooms,
];
