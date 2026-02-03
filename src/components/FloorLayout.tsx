"use client";

import { useState } from "react";
import { workstations, meetingRooms, breakout } from "@/data/layout";
import Seat from "./Seat";
import MeetingRoom from "./MeetingRoom";

export default function FloorLayout() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedItem = 
    workstations.find(ws => ws.id === selected) || 
    meetingRooms.find(mr => mr.id === selected) ||
    (selected === breakout.id ? breakout : null);

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8">
        <div className="grid grid-cols-12 gap-6 p-10 bg-stone-50 rounded-3xl border">
          
          {/* Workstations */}
          <div className="col-span-8 grid grid-cols-4 gap-4">
            {workstations.map(ws => (
              <Seat
                key={ws.id}
                seat={ws}
                selected={selected === ws.id}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* Meeting Rooms */}
          <div className="col-span-4 space-y-6">
            {meetingRooms.map(room => (
              <MeetingRoom
                key={room.id}
                room={room}
                selected={selected === room.id}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* Breakout Area */}
          <div className="col-span-12 mt-8">
            <div className="h-28 rounded-2xl bg-stone-200 flex items-center justify-center text-lg font-medium text-stone-500">
              Breakout / Lunch Area
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-4">
        <div className="sticky top-10 rounded-2xl border bg-white p-6 h-fit">
          <h2 className="text-xl font-semibold">Selection Details</h2>
          {selectedItem ? (
            <div className="mt-4 space-y-2">
              <p><span className="font-semibold">ID:</span> {selectedItem.id}</p>
              <p><span className="font-semibold">Type:</span> <span className="capitalize">{(selectedItem.type || '').replace('_', ' ')}</span></p>
              <p><span className="font-semibold">Capacity:</span> {selectedItem.capacity}</p>
              {(selectedItem as any).booked && <p className="font-semibold text-red-600">This space is currently booked.</p>}
            </div>
          ) : (
            <p className="mt-4 text-gray-500">Click on a seat or room to see details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
