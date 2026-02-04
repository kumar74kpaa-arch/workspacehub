'use client';
import { useState } from 'react';
import Image from 'next/image';
import { seatMap } from '@/lib/seatMap';
import type { SeatHotspot } from '@/lib/seatMap';

function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 my-6 border-y py-3">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-500/20" />
        <span className="text-sm text-muted-foreground">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border-2 border-accent bg-accent/20" />
        <span className="text-sm text-muted-foreground">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border-2 border-gray-400 bg-gray-400/30" />
        <span className="text-sm text-muted-foreground">Booked</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border-2 border-gray-300 bg-gray-300/30" />
        <span className="text-sm text-muted-foreground">Utility</span>
      </div>
    </div>
  );
}

export default function SeatBookingPage() {
  const [selectedSeat, setSelectedSeat] = useState<SeatHotspot | null>(null);
  // Mocking booked status for demonstration
  const [bookedSeats, setBookedSeats] = useState<string[]>(['WS-03', 'WS-08']);

  const handleHotspotClick = (spot: SeatHotspot) => {
    if (spot.disabled || bookedSeats.includes(spot.id)) {
      return;
    }
    setSelectedSeat(spot);
    // In a real app, you would open a booking modal here.
    console.log('Selected:', spot.id);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-10">
      <h1 className="text-3xl font-semibold mb-2">Select Your Workspace</h1>
      <p className="text-muted-foreground mb-8">
        An interactive overview of our office space. Click a spot to select it.
      </p>

      <Legend />

      <div className="relative w-full max-w-6xl mx-auto">
        {/* BASE IMAGE */}
        <Image
          src="https://i.ibb.co/FzVJw17/floorplan.png"
          alt="Office Layout"
          width={2000}
          height={1414}
          className="w-full rounded-lg"
          priority
        />

        {/* HOTSPOTS */}
        {seatMap.map((spot) => {
          const isBooked = bookedSeats.includes(spot.id);
          const isSelected = selectedSeat?.id === spot.id;

          let stateClass = 'border-blue-500 bg-blue-500/20 hover:bg-blue-500/40';
          if (spot.disabled) {
            stateClass = 'border-gray-300 bg-gray-300/30 cursor-not-allowed';
          } else if (isBooked) {
            stateClass = 'border-gray-400 bg-gray-400/30 cursor-not-allowed';
          } else if (isSelected) {
            stateClass = 'border-accent bg-accent/20 ring-2 ring-accent';
          }

          return (
            <button
              key={spot.id}
              className={`absolute border-2 rounded-sm text-xs font-semibold transition-colors flex items-center justify-center ${stateClass}`}
              style={{
                top: spot.top,
                left: spot.left,
                width: spot.width,
                height: spot.height,
              }}
              disabled={spot.disabled || isBooked}
              onClick={() => handleHotspotClick(spot)}
              title={spot.id}
            >
              <span className="text-black/80 font-bold text-[10px] sm:text-xs">
                {spot.label || spot.id}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
