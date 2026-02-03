import FloorLayout from "@/components/FloorLayout";
import Legend from "@/components/Legend";

export default function SeatBookingPage() {
  return (
    <main className="min-h-screen bg-stone-100 p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold mb-2 text-gray-800">
          Select Your Workspace
        </h1>
        <p className="text-gray-500 mb-6">A visual overview of our office space.</p>
        <FloorLayout />
        <Legend />
      </div>
    </main>
  );
}
