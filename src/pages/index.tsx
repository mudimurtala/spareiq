import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Cog,
  CircleStop,
  Zap,
  Car,
  Shield,
  Thermometer,
  Bot,
  BadgeCheck,
  Tags,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Navbar } from "../components/Navbar";
import { PartGrid } from "../features/inventory/components/PartGrid";
import { db } from "../lib/firebase";

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

  const { data: featuredParts = [], isLoading } = useQuery({
    queryKey: ["featuredParts"],
    queryFn: async () => {
      try {
        const q = query(
          collection(db, "parts"),
          orderBy("createdAt", "desc"),
          limit(6),
        );
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      } catch (err) {
        const snap = await getDocs(collection(db, "parts"));
        return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      {/* Hero Section */}
      <section
        className="w-full py-10 sm:py-12 lg:py-12"
        style={{ backgroundColor: "#0F172A" }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              Find Any Spare Part, Fast.
            </h1>
            <p className="text-sm sm:text-base lg:text-lg font-semibold text-accent-500">
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

      {/* Category Browse Section */}
      <section className="w-full bg-gray-50 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-base sm:text-lg font-bold text-primary-950 text-center mb-3">
            Browse by Category
          </h3>

          <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
            <Link
              to={`/parts?category=${encodeURIComponent("Engine")}`}
              className="bg-white rounded-lg shadow px-3 py-3 flex flex-col items-center justify-center hover:-translate-y-1 transform transition cursor-pointer"
            >
              <Cog className="w-5 h-5 text-primary-950" />
              <span className="mt-1 text-sm font-bold text-primary-950">
                Engine
              </span>
            </Link>

            <Link
              to={`/parts?category=${encodeURIComponent("Brakes")}`}
              className="bg-white rounded-lg shadow px-3 py-3 flex flex-col items-center justify-center hover:-translate-y-1 transform transition cursor-pointer"
            >
              <CircleStop className="w-5 h-5 text-primary-950" />
              <span className="mt-1 text-sm font-bold text-primary-950">
                Brakes
              </span>
            </Link>

            <Link
              to={`/parts?category=${encodeURIComponent("Electrical")}`}
              className="bg-white rounded-lg shadow px-3 py-3 flex flex-col items-center justify-center hover:-translate-y-1 transform transition cursor-pointer"
            >
              <Zap className="w-5 h-5 text-primary-950" />
              <span className="mt-1 text-sm font-bold text-primary-950">
                Electrical
              </span>
            </Link>

            <Link
              to={`/parts?category=${encodeURIComponent("Suspension")}`}
              className="bg-white rounded-lg shadow px-3 py-3 flex flex-col items-center justify-center hover:-translate-y-1 transform transition cursor-pointer"
            >
              <Car className="w-5 h-5 text-primary-950" />
              <span className="mt-1 text-sm font-bold text-primary-950">
                Suspension
              </span>
            </Link>

            <Link
              to={`/parts?category=${encodeURIComponent("Body Parts")}`}
              className="bg-white rounded-lg shadow px-3 py-3 flex flex-col items-center justify-center hover:-translate-y-1 transform transition cursor-pointer"
            >
              <Shield className="w-5 h-5 text-primary-950" />
              <span className="mt-1 text-sm font-bold text-primary-950">
                Body Parts
              </span>
            </Link>

            <Link
              to={`/parts?category=${encodeURIComponent("Cooling System")}`}
              className="bg-white rounded-lg shadow px-3 py-3 flex flex-col items-center justify-center hover:-translate-y-1 transform transition cursor-pointer"
            >
              <Thermometer className="w-5 h-5 text-primary-950" />
              <span className="mt-1 text-sm font-bold text-primary-950">
                Cooling System
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Parts Section */}
      <section className="w-full py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-950 text-center mb-6 sm:mb-8 lg:mb-10">
            Featured Parts
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-lg bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <PartGrid parts={featuredParts} />
          )}
        </div>
      </section>

      {/* Why SpareIQ Section */}
      <section className="w-full bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-primary-950">
              Why SpareIQ?
            </h3>
            <div className="mt-3 flex items-center justify-center">
              <div className="w-12 h-1 rounded bg-accent-500" />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center px-6 py-6">
              <Bot className="w-10 h-10 text-accent-500 mb-3" />
              <h4 className="text-lg font-bold text-primary-950 mb-2">
                AI-Powered Part Finder
              </h4>
              <p className="text-gray-600">
                Describe any part in plain English or Pidgin and our AI will
                identify it instantly.
              </p>
            </div>

            <div className="flex flex-col items-center text-center px-6 py-6">
              <BadgeCheck className="w-10 h-10 text-accent-500 mb-3" />
              <h4 className="text-lg font-bold text-primary-950 mb-2">
                Trusted Nigerian Dealers
              </h4>
              <p className="text-gray-600">
                Every part listed is from verified auto shops across Nigeria.
              </p>
            </div>

            <div className="flex flex-col items-center text-center px-6 py-6">
              <Tags className="w-10 h-10 text-accent-500 mb-3" />
              <h4 className="text-lg font-bold text-primary-950 mb-2">
                New and Tokunbo Parts
              </h4>
              <p className="text-gray-600">
                Find brand new parts or quality fairly-used Tokunbo options at
                honest prices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
