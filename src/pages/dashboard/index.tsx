import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Boxes, CircleDollarSign, TriangleAlert } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { DashboardLayout } from "../../features/dashboard/components/DashboardLayout";
import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { SparePart } from "../../types/sparePart";

const fetchParts = async (): Promise<SparePart[]> => {
  const snapshot = await getDocs(collection(db, "parts"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<SparePart, "id">),
  }));
};

export const DashboardPage = () => {
  const { user } = useAuth();

  const { data: parts = [], isLoading } = useQuery({
    queryKey: ["parts"],
    queryFn: fetchParts,
  });

  const stats = useMemo(() => {
    const totalParts = parts.length;
    const inStockParts = parts.filter((part) => part.stockQuantity > 0).length;
    const lowStockParts = parts.filter((part) => part.stockQuantity < 5).length;

    return [
      {
        label: "Total Parts",
        value: totalParts,
        icon: Boxes,
      },
      {
        label: "In Stock Parts",
        value: inStockParts,
        icon: CircleDollarSign,
      },
      {
        label: "Low Stock Parts",
        value: lowStockParts,
        icon: TriangleAlert,
      },
    ];
  }, [parts]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-accent-500 mb-2">
            Dashboard Overview
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-950">
            Welcome back{user?.email ? `, ${user.email}` : ""}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Here is a quick snapshot of your SpareIQ inventory.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-12 w-12 rounded-full border-4 border-primary-950 border-t-transparent animate-spin" />
          </div>
        ) : null}

        {!isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-primary-950">
                        {stat.value}
                      </p>
                    </div>
                    <div className="rounded-full bg-accent-500/10 p-3 text-accent-500">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};
