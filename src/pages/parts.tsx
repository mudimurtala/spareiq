import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { Navbar } from "../components/Navbar";
import { PartGrid } from "../features/inventory/components/PartGrid";
import { db } from "../lib/firebase";
import type { SparePart } from "../types/sparePart";

export const PartsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<
    "all" | "new" | "tokunbo"
  >("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = [
    "Engine",
    "Brakes",
    "Electrical",
    "Suspension",
    "Body Parts",
    "Cooling System",
  ];

  const { data: parts = [], isLoading } = useQuery({
    queryKey: ["parts"],
    queryFn: async (): Promise<SparePart[]> => {
      const snap = await getDocs(collection(db, "parts"));
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    },
  });

  const filteredParts = useMemo(() => {
    return parts.filter((part: SparePart) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          part.name.toLowerCase().includes(query) ||
          part.carMake.toLowerCase().includes(query) ||
          part.carModel.toLowerCase().includes(query) ||
          part.category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(part.category)
      ) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== "all" && part.condition !== selectedCondition) {
        return false;
      }

      // Price filter
      if (minPrice && part.price < Number(minPrice)) return false;
      if (maxPrice && part.price > Number(maxPrice)) return false;

      return true;
    });
  }, [
    parts,
    searchQuery,
    selectedCategories,
    selectedCondition,
    minPrice,
    maxPrice,
  ]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      {/* Page Title */}
      <div className="bg-white border-b border-gray-200 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-950">
            All Parts
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Two Column Layout: Mobile Stack, Desktop Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-5 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-primary-950 mb-5 sm:mb-6">
                  Filters
                </h2>

                {/* Category Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Category
                  </h3>
                  <div className="space-y-2.5">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-3 cursor-pointer text-sm sm:text-base"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 text-accent-500 rounded focus:ring-2 focus:ring-accent-500"
                        />
                        <span className="text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Condition Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Condition
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      { value: "all", label: "All" },
                      { value: "new", label: "New" },
                      { value: "tokunbo", label: "Tokunbo" },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer text-sm sm:text-base"
                      >
                        <input
                          type="radio"
                          name="condition"
                          value={value}
                          checked={selectedCondition === value}
                          onChange={(e) =>
                            setSelectedCondition(
                              e.target.value as "all" | "new" | "tokunbo",
                            )
                          }
                          className="w-4 h-4 text-accent-500 focus:ring-2 focus:ring-accent-500"
                        />
                        <span className="text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Search Bar */}
              <div className="mb-8">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search parts..."
                    className="flex-1 px-4 sm:px-5 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                  <button className="bg-accent-500 text-primary-950 font-bold px-4 sm:px-6 py-3 rounded-md hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-sm sm:text-base text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredParts.length}
                  </span>{" "}
                  parts
                </p>
              </div>

              {/* Part Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-12 w-12 rounded-full border-4 border-primary-950 border-t-transparent animate-spin" />
                </div>
              ) : (
                <PartGrid parts={filteredParts} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
