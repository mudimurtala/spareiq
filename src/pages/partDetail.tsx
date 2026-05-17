import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  limit,
} from "firebase/firestore";
import { Navbar } from "../components/Navbar";
import { PartCard } from "../features/inventory/components/PartCard";
import { db } from "../lib/firebase";
import type { SparePart } from "../types/sparePart";

export const PartDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: part, isLoading } = useQuery({
    queryKey: ["part", id],
    queryFn: async (): Promise<(SparePart & { id: string }) | null> => {
      if (!id) return null;
      const ref = doc(db, "parts", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return { id: snap.id, ...(snap.data() as any) } as SparePart & {
        id: string;
      };
    },
  });

  const relatedQuery = useQuery({
    queryKey: ["related", part?.category, id],
    enabled: !!part?.category,
    queryFn: async (): Promise<SparePart[]> => {
      const q = query(
        collection(db, "parts"),
        where("category", "==", part!.category),
        limit(3),
      );
      const snap = await getDocs(q);
      return snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }) as SparePart)
        .filter((p) => p.id !== id)
        .slice(0, 3);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="h-12 w-12 rounded-full border-4 border-primary-950 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!part) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center px-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-950 mb-3">
              Part Not Found
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Sorry, the part you're looking for doesn't exist or has been
              removed.
            </p>
            <Link
              to="/parts"
              className="inline-block bg-accent-500 text-primary-950 font-bold py-3 px-8 rounded-md hover:bg-opacity-90 transition-all duration-200"
            >
              Back to Parts
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isInStock = part.stockQuantity > 0;
  const conditionColor =
    part.condition === "new" ? "bg-green-500" : "bg-amber-500";
  const conditionLabel = part.condition === "new" ? "New" : "Tokunbo";

  const formatPrice = (price: number): string => {
    return `₦${price.toLocaleString("en-NG")}`;
  };

  const relatedParts = relatedQuery.data ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/parts"
            className="inline-flex items-center gap-2 text-primary-950 hover:text-accent-500 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Parts
          </Link>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
            {/* Left Column - Image */}
            <div className="flex items-center justify-center">
              <div className="w-full aspect-square rounded-lg shadow-lg overflow-hidden bg-white">
                <img
                  src={part.imageUrl}
                  alt={part.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="flex flex-col justify-center">
              {/* Condition Badge */}
              <div className="mb-4">
                <span
                  className={`${conditionColor} text-white px-4 py-1 rounded-full text-sm font-semibold inline-block`}
                >
                  {conditionLabel}
                </span>
              </div>

              {/* Part Name */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-950 mb-4">
                {part.name}
              </h1>

              {/* Car Info */}
              <p className="text-gray-600 text-base sm:text-lg mb-3">
                For {part.carMake} {part.carModel} ({part.carYear})
              </p>

              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {part.category}
                </span>
              </div>

              {/* Price */}
              <p className="text-4xl sm:text-5xl font-bold text-accent-500 mb-6">
                {formatPrice(part.price)}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                <p
                  className={`text-base sm:text-lg font-semibold ${isInStock ? "text-green-600" : "text-red-600"}`}
                >
                  {isInStock
                    ? `${part.stockQuantity} in stock`
                    : "Out of Stock"}
                </p>
              </div>

              {/* Divider */}
              <hr className="my-6 border-gray-300" />

              {/* Description */}
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8">
                {part.description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  disabled={!isInStock}
                  className={`flex-1 font-bold py-3 px-6 rounded-md transition-all duration-200 ${isInStock ? "bg-accent-500 text-primary-950 hover:bg-opacity-90" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                >
                  Check Availability
                </button>
                <Link
                  to="/parts"
                  className="flex-1 font-bold py-3 px-6 rounded-md border-2 border-primary-950 text-primary-950 hover:bg-primary-950 hover:text-white transition-all duration-200 text-center"
                >
                  Go Back
                </Link>
              </div>
            </div>
          </div>

          {/* Related Parts Section */}
          {relatedParts.length > 0 && (
            <div className="border-t border-gray-300 pt-12 lg:pt-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-950 mb-8 sm:mb-12">
                You Might Also Need
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedParts.map((relatedPart) => (
                  <PartCard key={relatedPart.id} part={relatedPart} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PartDetailPage;
