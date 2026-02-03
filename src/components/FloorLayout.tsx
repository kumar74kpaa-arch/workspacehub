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
  
  const mr12 = meetingRooms.find(r => r.id === "MR-12");
  const mr09 = meetingRooms.find(r => r.id === "MR-09");

  // Workstation groups based on floor plan
  const wsTopPod1 = workstations.slice(0, 4);   // 2x2
  const wsTopPod2 = workstations.slice(4, 8);   // 2x2
  const wsTopPod3 = workstations.slice(8, 10);  // 1x2
  const wsBottomPod1 = workstations.slice(10, 12); // 1x2
  const wsBottomPod2 = workstations.slice(12, 14); // 1x2
  const wsBottomPod3 = workstations.slice(14, 16); // 1x2

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8">
        <div className="relative w-full h-[600px] bg-stone-50 rounded-3xl border p-4 font-sans">
          
          {/* Walls and dividers for visual structure */}
          <div className="absolute top-[5%] left-[30%] h-[90%] w-px bg-stone-200"></div>
          <div className="absolute top-[48%] left-[30%] w-[48%] h-px bg-stone-200"></div>
          <div className="absolute top-[5%] right-[22%] h-[90%] w-px bg-stone-200"></div>


          {/* Large Meeting Room - Left */}
          {mr12 && (
            <div className="absolute top-[5%] left-[2%] w-[26%] h-[65%]">
              <MeetingRoom key={mr12.id} room={mr12} selected={selected === mr12.id} onSelect={setSelected} className="h-full !flex !flex-col !justify-center" />
            </div>
          )}
          {/* Stairs */}
          <div className="absolute bottom-[5%] left-[2%] w-[26%] h-[25%] bg-stone-200 rounded-2xl flex items-center justify-center text-lg font-medium text-stone-500">Stairs</div>

          {/* Top Workstation Area */}
          <div className="absolute top-[8%] left-[33%] w-[45%] h-[35%]">
            <div className="relative h-full w-full">
              <div className="absolute top-0 left-0 grid grid-cols-2 gap-2">{wsTopPod1.map(ws => <Seat key={ws.id} seat={ws} selected={selected === ws.id} onSelect={setSelected}/>)}</div>
              <div className="absolute top-0 left-[35%] grid grid-cols-2 gap-2">{wsTopPod2.map(ws => <Seat key={ws.id} seat={ws} selected={selected === ws.id} onSelect={setSelected}/>)}</div>
              <div className="absolute top-0 left-[70%] grid grid-cols-1 gap-2">{wsTopPod3.map(ws => <Seat key={ws.id} seat={ws} selected={selected === ws.id} onSelect={setSelected}/>)}</div>
            </div>
          </div>

          {/* Bottom Workstation Area */}
          <div className="absolute top-[55%] left-[33%] w-[45%] h-[40%]">
             <div className="relative h-full w-full">
               <div className="absolute top-0 left-0 grid grid-cols-1 gap-2">{wsBottomPod1.map(ws => <Seat key={ws.id} seat={ws} selected={selected === ws.id} onSelect={setSelected}/>)}</div>
               <div className="absolute top-0 left-[25%] grid grid-cols-1 gap-2">{wsBottomPod2.map(ws => <Seat key={ws.id} seat={ws} selected={selected === ws.id} onSelect={setSelected}/>)}</div>
               <div className="absolute top-0 left-[50%] grid grid-cols-1 gap-2">{wsBottomPod3.map(ws => <Seat key={ws.id} seat={ws} selected={selected === ws.id} onSelect={setSelected}/>)}</div>
             </div>
          </div>

          {/* Right Column Rooms */}
          {mr09 && (
            <div className="absolute top-[5%] right-[2%] w-[18%] h-[40%]">
              <MeetingRoom key={mr09.id} room={mr09} selected={selected === mr09.id} onSelect={setSelected} className="h-full !flex !flex-col !justify-center" />
            </div>
          )}
          <div className="absolute bottom-[5%] right-[2%] w-[18%] h-[48%] bg-stone-200 rounded-2xl flex items-center justify-center text-lg font-medium text-stone-500 text-center">
            Pantry /<br/> Restroom
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