import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  Package,
  PlusCircle,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

      {/* Main Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
};
