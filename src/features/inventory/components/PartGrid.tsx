import type { SparePart } from "../../../types/sparePart";
import { PartCard } from "./PartCard";

interface PartGridProps {
  parts: SparePart[];
}

export const PartGrid = ({ parts }: PartGridProps) => {
  if (parts.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-20">
        <p className="text-center text-gray-600 text-base sm:text-lg">
          No parts found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {parts.map((part) => (
        <PartCard key={part.id} part={part} />
      ))}
    </div>
  );
};
