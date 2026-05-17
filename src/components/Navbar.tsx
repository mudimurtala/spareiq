import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  const links: Array<{ label: string; to: string }> = [
    { label: "Home", to: "/" },
    { label: "Parts", to: "/parts" },
    { label: "AI Finder", to: "/ai-finder" },
  ];

  return (
    <nav
      className="w-full sticky top-0 z-50"
      style={{ backgroundColor: "#0F172A" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" onClick={close} className="flex items-center gap-3">
          <Settings className="w-6 h-6" color="#F59E0B" />
          <span className="text-white font-bold text-lg">SpareIQ</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-white hover:text-amber-500 transition-colors duration-150 px-2 py-1 ${
                  isActive ? "text-amber-500" : ""
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <Link
            to="/login"
            className="ml-3 bg-amber-500 text-[#0F172A] font-bold rounded px-4 py-2"
          >
            Login
          </Link>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          <button
            onClick={toggle}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="inline-flex items-center justify-center p-2 rounded text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          className="md:hidden w-full"
          style={{ backgroundColor: "#0F172A" }}
        >
          <div className="flex flex-col max-w-7xl mx-auto px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={close}
                className={({ isActive }) =>
                  `block w-full text-left px-2 py-3 text-white hover:text-amber-500 transition-colors duration-150 ${
                    isActive ? "text-amber-500" : ""
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <Link
              to="/login"
              onClick={close}
              className="mt-2 inline-block bg-amber-500 text-[#0F172A] font-bold rounded px-4 py-2 text-center"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
