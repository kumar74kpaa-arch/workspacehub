export const workstations = Array.from({ length: 16 }, (_, i) => ({
  id: `WS-${String(i + 1).padStart(2, "0")}`,
  type: "workstation",
  capacity: 1,
  booked: i === 2 || i === 7, // mock booked seats
}));

export const meetingRooms = [
  {
    id: "MR-12",
    type: "meeting_room",
    capacity: 9,
    extraCapacity: 3,
    booked: false,
  },
  {
    id: "MR-09",
    type: "meeting_room",
    capacity: 9,
    extraCapacity: 2,
    booked: true,
  },
];

export const breakout = {
  id: "BREAKOUT",
  type: "breakout",
  capacity: 8,
};
