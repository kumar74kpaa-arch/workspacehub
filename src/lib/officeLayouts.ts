export interface SeatHotspot {
  id: string;
  type: 'workstation' | 'meeting-room' | 'breakout' | 'utility';
  top: string;
  left: string;
  width: string;
  height: string;
  disabled?: boolean;
  label?: string;
}

interface OfficeLayout {
    name: string;
    imageUrl: string;
    hotspots: SeatHotspot[];
}

export const officeLayouts: Record<string, OfficeLayout> = {
    'OFFICE-01': {
        name: 'Vikram Vihar Workspace',
        imageUrl: 'https://i.ibb.co/2k33n6x/layout-plan.png',
        hotspots: [
            // Meeting Room
            { id: 'MR-12', type: 'meeting-room', top: '15.5%', left: '14.5%', width: '20%', height: '35%', label: 'MR-12' },
            // Stairs (Utility)
            { id: 'Stairs', type: 'utility', top: '56%', left: '12%', width: '15%', height: '27%', disabled: true, label: 'Stairs' },
            // Workstations - Top Row
            { id: 'WS-01', type: 'workstation', top: '18%', left: '30.5%', width: '5%', height: '8%' },
            { id: 'WS-02', type: 'workstation', top: '28%', left: '30.5%', width: '5%', height: '8%' },
            { id: 'WS-03', type: 'workstation', top: '18%', left: '38.5%', width: '5%', height: '8%' },
            { id: 'WS-04', type: 'workstation', top: '28%', left: '38.5%', width: '5%', height: '8%' },
            { id: 'WS-05', type: 'workstation', top: '18%', left: '49.5%', width: '5%', height: '8%' },
            { id: 'WS-06', type: 'workstation', top: '28%', left: '49.5%', width: '5%', height: '8%' },
            { id: 'WS-07', type: 'workstation', top: '18%', left: '57.5%', width: '5%', height: '8%' },
            { id: 'WS-08', type: 'workstation', top: '28%', left: '57.5%', width: '5%', height: '8%' },
            { id: 'WS-09', type: 'workstation', top: '18%', left: '65.5%', width: '5%', height: '8%' },
            { id: 'WS-10', type: 'workstation', top: '28%', left: '65.5%', width: '5%', height: '8%' },
            // Workstations - Bottom Row
            { id: 'WS-11', type: 'workstation', top: '58%', left: '40.5%', width: '5%', height: '8%' },
            { id: 'WS-12', type: 'workstation', top: '68%', left: '40.5%', width: '5%', height: '8%' },
            { id: 'WS-13', type: 'workstation', top: '58%', left: '50.5%', width: '5%', height: '8%' },
            { id: 'WS-14', type: 'workstation', top: '68%', left: '50.5%', width: '5%', height: '8%' },
            { id: 'WS-15', type: 'workstation', top: '58%', left: '61.5%', width: '5%', height: '8%' },
            { id: 'WS-16', type: 'workstation', top: '68%', left: '61.5%', width: '5%', height: '8%' },
            // Right Side
            { id: 'Breakout', type: 'breakout', top: '18%', left: '83%', width: '14%', height: '18%', label: 'Breakout Area' },
            { id: 'Restroom', type: 'utility', top: '40%', left: '85%', width: '12%', height: '20%', disabled: true, label: 'Restroom' },
            { id: 'Pantry', type: 'utility', top: '68%', left: '81%', width: '10%', height: '15%', disabled: true, label: 'Pantry' },
        ]
    },
    'OFFICE-02': {
        name: 'National Park Workspace',
        imageUrl: 'https://i.ibb.co/2k33n6x/layout-plan.png', // Using same layout image for now
        hotspots: [
             // Meeting Rooms
            { id: 'MR2-06', type: 'meeting-room', top: '15.5%', left: '14.5%', width: '10%', height: '35%', label: 'MR-06' },
            { id: 'MR2-12', type: 'meeting-room', top: '15.5%', left: '25%', width: '10%', height: '35%', label: 'MR-12' },
            // Stairs (Utility)
            { id: 'Stairs2', type: 'utility', top: '56%', left: '12%', width: '15%', height: '27%', disabled: true, label: 'Stairs' },
            // Workstations - Top Row
            { id: 'WS2-01', type: 'workstation', top: '18%', left: '49.5%', width: '5%', height: '8%' },
            { id: 'WS2-02', type: 'workstation', top: '28%', left: '49.5%', width: '5%', height: '8%' },
            { id: 'WS2-03', type: 'workstation', top: '18%', left: '57.5%', width: '5%', height: '8%' },
            { id: 'WS2-04', type: 'workstation', top: '28%', left: '57.5%', width: '5%', height: '8%' },
            { id: 'WS2-05', type: 'workstation', top: '18%', left: '65.5%', width: '5%', height: '8%' },
            { id: 'WS2-06', type: 'workstation', top: '28%', left: '65.5%', width: '5%', height: '8%' },
            // Workstations - Bottom Row
            { id: 'WS2-07', type: 'workstation', top: '58%', left: '40.5%', width: '5%', height: '8%' },
            { id: 'WS2-08', type: 'workstation', top: '68%', left: '40.5%', width: '5%', height: '8%' },
            { id: 'WS2-09', type: 'workstation', top: '58%', left: '50.5%', width: '5%', height: '8%' },
            { id: 'WS2-10', type: 'workstation', top: '68%', left: '50.5%', width: '5%', height: '8%' },
            { id: 'WS2-11', type: 'workstation', top: '58%', left: '61.5%', width: '5%', height: '8%' },
            { id: 'WS2-12', type: 'workstation', top: '68%', left: '61.5%', width: '5%', height: '8%' },
             // Right Side
            { id: 'Breakout2', type: 'breakout', top: '18%', left: '83%', width: '14%', height: '18%', label: 'Breakout Area' },
            { id: 'Restroom2', type: 'utility', top: '40%', left: '85%', width: '12%', height: '20%', disabled: true, label: 'Restroom' },
            { id: 'Pantry2', type: 'utility', top: '68%', left: '81%', width: '10%', height: '15%', disabled: true, label: 'Pantry' },
        ]
    }
}
