import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import authentication context

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Get authentication state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Hamburger Icon */}
        <button
          onClick={toggleMenu}
          className="lg:hidden flex flex-col space-y-1"
        >
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </button>

        {/* Navigation Links */}
        <ul
          className={`lg:flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 absolute lg:relative left-0 top-16 lg:top-0 w-full lg:w-auto bg-gray-900 lg:bg-transparent transition-all duration-300 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <li>
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-400 transition-colors">About</Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
          </li>
          <li>
            <Link to="/editor" className="hover:text-blue-400 transition-colors">Editor</Link>
          </li>
          <li>
            <Link to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          </li>
          <li>
            <Link to="/room-management" className="hover:text-blue-400 transition-colors">Manage Rooms</Link>
          </li>
          <li>
            <Link to="/settings" className="hover:text-blue-400 transition-colors">Settings</Link> {/* Added Settings link */}
          </li>
          {user && ( // Show Logout button if user is logged in
            <li>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
