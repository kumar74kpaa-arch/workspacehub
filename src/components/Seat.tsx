'use client';

export function Seat({
  id,
  status = "available",
  onClick,
}: {
  id: string;
  status?: "available" | "selected" | "booked";
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={status === "booked"}
      className={`
        w-24 h-16 rounded-xl border text-sm font-medium
        transition-all
        ${
          status === "available" &&
          "bg-white hover:border-black"
        }
        ${
          status === "selected" &&
          "bg-black text-white"
        }
        ${
          status === "booked" &&
          "bg-gray-300 text-gray-600 cursor-not-allowed"
        }
      `}
    >
      {id}
      {status === "booked" && (
        <div className="text-xs text-red-500">Booked</div>
      )}
    </button>
  );
}
