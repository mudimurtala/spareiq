import { Link } from "react-router-dom";
import { Settings, Code, Share2, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-primary-950 text-white">
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Three Column Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Column 1: Brand */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-accent-500" />
                <span className="text-lg font-bold text-white">SpareIQ</span>
              </div>
              <p className="text-sm text-gray-400">
                Nigeria's AI-powered spare parts marketplace. Find any part,
                fast.
              </p>
              <div className="flex space-x-4 pt-2">
                <a
                  href="https://github.com/mudimurtala"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-accent-500"
                  aria-label="GitHub"
                >
                  <Code className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/mudimurtala/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-accent-500"
                  aria-label="LinkedIn"
                >
                  <Share2 className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-bold text-accent-500">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Home
                </Link>
                <Link
                  to="/parts"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Browse Parts
                </Link>
                <Link
                  to="/ai-finder"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  AI Part Finder
                </Link>
                <Link
                  to="/login"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Login
                </Link>
              </nav>
            </div>

            {/* Column 3: Contact */}
            <div className="flex flex-col space-y-4">
              <h3 className="font-bold text-accent-500">Contact</h3>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400">
                    ibnmuhyideen95@gmail.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400">Ilorin, Nigeria</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-400">
                    Mon to Fri, 9am to 6pm WAT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-8 border-t border-gray-700" />

          {/* Copyright */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2025 SpareIQ. Built with React, TypeScript and AI. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
