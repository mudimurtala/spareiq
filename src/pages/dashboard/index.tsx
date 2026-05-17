import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Menu,
  Package,
  PlusCircle,
  LogOut,
  Boxes,
  CircleDollarSign,
  TriangleAlert,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      // Error is surfaced through useAuth and the user can retry.
    }
  };

  const navLinks = [
    { label: "Dashboard Overview", to: "/dashboard", icon: LayoutDashboard },
    { label: "All Parts", to: "/dashboard/inventory", icon: Package },
    { label: "Add New Part", to: "/dashboard/inventory/new", icon: PlusCircle },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 lg:pl-72">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-primary-950 text-white px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10"
          aria-label="Toggle dashboard menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-accent-500" />
          <span className="font-bold">SpareIQ</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen ? (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 h-full w-72 bg-primary-950 text-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-8">
              <Settings className="w-6 h-6 text-accent-500" />
              <span className="text-xl font-bold">SpareIQ</span>
            </div>

            <nav className="space-y-2">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-accent-500"
                        : "text-white hover:bg-white/10"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-auto absolute bottom-6 left-6 right-6 inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </aside>
        </div>
      ) : null}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-72 flex-col bg-primary-950 text-white px-6 py-8 shadow-xl">
        <Link to="/dashboard" className="flex items-center gap-2 mb-10">
          <Settings className="w-7 h-7 text-accent-500" />
          <span className="text-2xl font-bold">SpareIQ</span>
        </Link>

        <nav className="space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-accent-500"
                    : "text-white hover:bg-white/10"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
      </main>
    </div>
  );
};
