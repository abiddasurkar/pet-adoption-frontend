// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, LogOut, Home, LogIn, UserPlus } from 'lucide-react';
import { UIContext } from '../context/UIContext';

export default function Navbar() {
  const { isLoggedIn, user, logout, isAdmin } = useContext(AuthContext);
  const { sidebarOpen, toggleSidebar } = useContext(UIContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    toggleSidebar();
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-purple-600 flex items-center gap-2">
              🐾 PetAdopt
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-purple-600 transition">Home</Link>

            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 transition">
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-600 hover:text-purple-600 transition">
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-gray-600">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn btn-secondary flex items-center gap-2">
                  <LogIn size={18} /> Login
                </Link>
                <Link to="/signup" className="btn btn-primary flex items-center gap-2">
                  <UserPlus size={18} /> Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleSidebar} className="text-purple-600">
              {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {sidebarOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-600 hover:text-purple-600 transition"
              onClick={toggleSidebar}
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-600 hover:text-purple-600 transition"
                  onClick={toggleSidebar}
                >
                  My Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block text-gray-600 hover:text-purple-600 transition"
                    onClick={toggleSidebar}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full btn btn-primary text-left flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/login" className="block btn btn-secondary" onClick={toggleSidebar}>
                  Login
                </Link>
                <Link to="/signup" className="block btn btn-primary" onClick={toggleSidebar}>
                  Signup
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}