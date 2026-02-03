'use client';

export default function MeetingRoom({ room, selected, onSelect, className }: any) {
  const disabled = room.booked;
  return (
    <div
      onClick={() => !disabled && onSelect(room.id)}
      className={`
        p-6 rounded-2xl border transition cursor-pointer
        ${disabled ? "bg-gray-300 cursor-not-allowed text-gray-500" : "bg-white hover:shadow-xl"}
        ${selected ? "ring-2 ring-black" : ""}
        ${className || ''}
      `}
    >
      <h3 className="font-semibold text-lg">{room.id}</h3>
      <p className="text-sm text-gray-600">
        {room.capacity} seats included
      </p>
      <p className="text-xs text-gray-500">
        +{room.extraCapacity} optional seats
      </p>

      {room.booked && (
        <p className="text-xs text-red-600 mt-2 font-semibold">Currently Booked</p>
      )}
    </div>
  );
}
