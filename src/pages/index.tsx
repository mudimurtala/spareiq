import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { PartGrid } from "../features/inventory/components/PartGrid";
import { placeholderParts } from "../lib/placeholderParts";

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement actual search functionality
      navigate(`/parts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const featuredParts = placeholderParts.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      {/* Hero Section */}
      <section
        className="w-full py-12 sm:py-16 lg:py-24"
        style={{ backgroundColor: "#0F172A" }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Find Any Spare Part, Fast.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-accent-500">
              Trusted by auto shops across Nigeria.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 sm:gap-2"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by part name, car make or model..."
              className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
            />
            <button
              type="submit"
              className="bg-accent-500 text-primary-950 font-bold py-3 sm:py-3.5 px-4 sm:px-8 rounded-md hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2 text-base sm:text-lg whitespace-nowrap"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Featured Parts Section */}
      <section className="w-full py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-950 text-center mb-8 sm:mb-12 lg:mb-16">
            Featured Parts
          </h2>
          <PartGrid parts={featuredParts} />
        </div>
      </section>
    </div>
  );
};
