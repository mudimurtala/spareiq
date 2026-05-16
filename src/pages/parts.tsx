import { Navbar } from "../components/Navbar";

export const PartsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-950 mb-4">
            Spare Parts
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Browse our extensive inventory of spare parts.
          </p>
        </div>
      </main>
    </div>
  );
};
