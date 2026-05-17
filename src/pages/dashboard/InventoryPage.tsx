import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { db } from "../../lib/firebase";
import type { SparePart } from "../../types/sparePart";

const fetchParts = async (): Promise<SparePart[]> => {
  const snapshot = await getDocs(collection(db, "parts"));

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<SparePart, "id">),
  }));
};

export const InventoryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: parts = [], isLoading } = useQuery({
    queryKey: ["parts"],
    queryFn: fetchParts,
  });

  const sortedParts = useMemo(() => [...parts], [parts]);

  const handleDelete = async (partId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this part?",
    );
    if (!confirmed) return;

    await deleteDoc(doc(db, "parts", partId));
    await queryClient.invalidateQueries({ queryKey: ["parts"] });
  };

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-accent-500">
              Inventory Management
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-950">
              All Parts
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/inventory/new")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent-500 px-4 py-3 font-bold text-primary-950 transition hover:bg-opacity-90"
          >
            <Plus className="w-5 h-5" />
            Add New Part
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-primary-950 border-t-transparent animate-spin" />
          </div>
        ) : null}

        {!isLoading && sortedParts.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-primary-950">
              No parts yet
            </h2>
            <p className="mt-2 text-gray-600">
              Add your first part to start managing inventory.
            </p>
          </div>
        ) : null}

        {!isLoading && sortedParts.length > 0 ? (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Condition
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {sortedParts.map((part) => (
                    <tr key={part.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <img
                          src={part.imageUrl}
                          alt={part.name}
                          className="h-14 w-20 rounded-md object-cover"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-primary-950">
                        {part.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {part.category}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700 capitalize">
                        {part.condition}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        ₦{part.price.toLocaleString("en-NG")}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {part.stockQuantity}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/inventory/new?edit=${part.id}`}
                            className="inline-flex items-center gap-2 rounded-md border border-primary-950 px-3 py-2 text-sm font-semibold text-primary-950 transition hover:bg-primary-950 hover:text-white"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(part.id)}
                            className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
