'use client';

export default function Seat({ seat, selected, onSelect }: any) {
  const disabled = seat.booked;

  return (
    <div
      onClick={() => !disabled && onSelect(seat.id)}
      className={`group
        relative p-4 rounded-xl text-center cursor-pointer
        transition-all duration-200
        ${disabled ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white hover:shadow-lg"}
        ${selected ? "ring-2 ring-black" : ""}
      `}
    >
      <div className="text-sm font-semibold">{seat.id}</div>

      {/* Tooltip */}
      <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded-md -top-10 left-1/2 -translate-x-1/2 z-10">
        Workstation · 1 Seat
      </div>

      {disabled && (
        <span className="text-xs text-red-600 mt-1 block">Booked</span>
      )}
    </div>
  );
}
