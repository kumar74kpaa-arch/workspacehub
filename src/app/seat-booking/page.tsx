import { Seat } from "@/components/Seat";
import Image from "next/image";

function Legend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 my-6 border-y py-3">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded border bg-white" />
        <span className="text-sm text-muted-foreground">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-black" />
        <span className="text-sm text-muted-foreground">Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gray-300" />
        <span className="text-sm text-muted-foreground">Booked</span>
      </div>
    </div>
  );
}

export default function SeatBookingPage() {
  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-3xl font-semibold mb-2">
        Select Your Workspace
      </h1>
      <p className="text-muted-foreground mb-8">
        A visual overview of our office space.
      </p>

      <div className="my-8 rounded-lg overflow-hidden border shadow-sm">
        <Image
          src="https://i.ibb.co/FzVJw17/floorplan.png"
          alt="Office Floor Plan"
          width={1200}
          height={600}
          className="w-full h-auto object-contain"
        />
      </div>

      <Legend />

      <div className="grid grid-cols-[1fr_2fr_1fr] gap-8">

        {/* LEFT ZONE */}
        <div className="space-y-6">
          <div className="p-6 border rounded-xl h-64">
            <h3 className="font-medium">MR-09</h3>
            <p className="text-sm text-muted-foreground">
              9 seats + 2 extra
            </p>
          </div>

          <div className="p-6 border rounded-xl h-32 bg-gray-100">
            Stairs
          </div>
        </div>

        {/* CENTER ZONE */}
        <div className="space-y-10">

          {/* TOP DESKS */}
          <div className="grid grid-cols-5 gap-4">
            <Seat id="WS-01" />
            <Seat id="WS-03" status="booked" />
            <Seat id="WS-05" />
            <Seat id="WS-07" />
            <Seat id="WS-09" />

            <Seat id="WS-02" />
            <Seat id="WS-04" />
            <Seat id="WS-06" status="selected" />
            <Seat id="WS-08" />
            <Seat id="WS-10" />
          </div>

          {/* CENTER DESKS */}
          <div className="grid grid-cols-3 gap-6 justify-center">
            <Seat id="WS-11" />
            <Seat id="WS-13" />
            <Seat id="WS-15" />

            <Seat id="WS-12" />
            <Seat id="WS-14" />
            <Seat id="WS-16" />
          </div>
        </div>

        {/* RIGHT ZONE */}
        <div className="space-y-6">
          <div className="p-6 border rounded-xl h-48">
            Breakout Area
          </div>
          <div className="p-6 border rounded-xl h-32">
            Pantry
          </div>
          <div className="p-6 border rounded-xl h-32">
            Washroom
          </div>
        </div>
      </div>
    </div>
  );
}
