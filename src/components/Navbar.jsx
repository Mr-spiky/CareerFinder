import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="text-2xl font-bold text-white hover:text-indigo-200 transition duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="bg-white text-indigo-600 px-2 py-1 rounded-lg mr-1">Career</span>
            <span>Finder</span>
          </NavLink>

          {/* Desktop Navigation (hidden on mobile) */}
          <div className="hidden md:flex space-x-6">
            <NavItem to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </NavItem>
            <NavItem to="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </NavItem>
            <NavItem to="/result" onClick={() => setIsMenuOpen(false)}>
              Results
            </NavItem>
          </div>

          {/* Mobile menu button (hidden on desktop) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none transition"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (animated with Tailwind) */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pb-3 space-y-1 bg-indigo-700 bg-opacity-95">
          <MobileNavItem to="/" onClick={() => setIsMenuOpen(false)}>
            Home
          </MobileNavItem>
          <MobileNavItem to="/about" onClick={() => setIsMenuOpen(false)}>
            About
          </MobileNavItem>
          <MobileNavItem to="/result" onClick={() => setIsMenuOpen(false)}>
            Results
          </MobileNavItem>
        </div>
      </div>
    </nav>
  );
};

// Reusable NavItem component for desktop
const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative px-3 py-2 font-medium text-white transition duration-300 ${
        isActive ? "font-bold" : "hover:text-indigo-200"
      }`
    }
  >
    {children}
    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-4/5" />
  </NavLink>
);

// Reusable MobileNavItem component
const MobileNavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block px-3 py-2 rounded-md text-base font-medium ${
        isActive ? "bg-indigo-800 text-white" : "text-white hover:bg-indigo-600"
      } transition duration-300`
    }
  >
    {children}
  </NavLink>
);

export default Navbar;