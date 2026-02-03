export default function Legend() {
  return (
    <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-600">
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 rounded-md bg-white border"></div>
        <span>Available</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 rounded-md bg-white ring-2 ring-black"></div>
        <span>Selected</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 rounded-md bg-gray-300"></div>
        <span>Booked</span>
      </div>
    </div>
  );
}
