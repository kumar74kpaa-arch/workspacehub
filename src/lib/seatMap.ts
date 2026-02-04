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

export const seatMap: SeatHotspot[] = [
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
];
