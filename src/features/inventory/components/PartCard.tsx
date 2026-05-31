import { Link } from "react-router-dom";
import type { SparePart } from "../../../types/sparePart";

interface PartCardProps {
  part: SparePart;
}

export const PartCard = ({ part }: PartCardProps) => {
  const isInStock = part.stockQuantity > 0;
  const conditionColor =
    part.condition === "new" ? "bg-green-500" : "bg-orange-500";
  const conditionLabel = part.condition === "new" ? "New" : "Tokunbo";

  const formatPrice = (price: number): string => {
    return `₦${price.toLocaleString("en-NG")}`;
  };

  return (
    <Link to={`/parts/${part.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col cursor-pointer">
        {/* Image Container */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-200">
          <img
            src={part.imageUrl}
            alt={part.name}
            className="w-full h-full object-cover"
          />
          {/* Condition Badge */}
          <div
            className={`absolute top-3 right-3 ${conditionColor} text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold`}
          >
            {conditionLabel}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Part Name */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {part.name}
          </h3>

          {/* Car Info */}
          <p className="text-xs sm:text-sm text-gray-600 mb-3">
            {part.carMake} {part.carModel} • {part.carYear}
          </p>

          {/* Price */}
          <p className="text-lg sm:text-xl font-bold text-primary-950 mb-2">
            {formatPrice(part.price)}
          </p>

          {/* Stock Status */}
          <div className="mb-4">
            <p
              className={`text-xs sm:text-sm font-semibold ${
                isInStock ? "text-green-600" : "text-red-600"
              }`}
            >
              {isInStock ? `In Stock (${part.stockQuantity})` : "Out of Stock"}
            </p>
          </div>

          {/* View Details Button */}
          <button className="mt-auto w-full bg-accent-500 text-primary-950 font-bold py-2 sm:py-2.5 rounded-md hover:bg-opacity-90 transition-all duration-200 text-sm sm:text-base">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};
