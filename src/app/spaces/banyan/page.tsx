import Image from "next/image";

export default function BanyanLayoutPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto text-center">

        <h1 className="text-4xl font-semibold mb-4">
          The Banyan Layout Plan
        </h1>

        <p className="text-gray-500 mb-12">
          Lower Ground Floor, 86 National Park, Lajpat Nagar
        </p>

        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/layouts/the-banyan-layout.jpg"
            alt="The Banyan Layout"
            width={2000}
            height={1200}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

      </div>
    </div>
  );
}
