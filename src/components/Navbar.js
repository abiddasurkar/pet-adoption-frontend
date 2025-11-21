import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Home, LogIn, UserPlus, PawPrint, Sparkles, Settings, Heart, Search, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../context/UIContext';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Use real contexts from your app
  const { user, isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const { openAuthModal } = useContext(UIContext);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleOpenAuthModal = () => {
    openAuthModal();
    setSidebarOpen(false);
  };

  // Check if user is visitor
  const isVisitor = user?.role === 'visitor';

  const NavLink = ({ to, children, icon: Icon, mobile = false, requiredRole }) => {
    if (requiredRole === 'admin' && !isAdmin) return null;
    if (requiredRole === 'user' && isVisitor) return null;

    const handleClick = () => {
      navigate(to);
      if (mobile) {
        toggleSidebar();
      }
    };

    if (mobile) {
      return (
        <button
          onClick={handleClick}
          className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500 group w-full text-left mx-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-900 font-semibold shadow-md hover:shadow-lg border border-white/40"
        >
          <div className="p-2 rounded-xl bg-white/20 group-hover:bg-white/30 transition-all">
            <Icon size={20} className="text-gray-900" />
          </div>
          <span className="font-semibold">{children}</span>
        </button>
      );
    }

    return (
      <button 
        onClick={handleClick}
        className="px-6 py-2.5 rounded-full font-semibold transition-all duration-500 text-gray-700 hover:text-purple-600 hover:bg-white/80 hover:shadow-lg"
      >
        {children}
      </button>
    );
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 border-b border-white/30'
          : 'bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm'
      }`}>
        {isScrolled && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 opacity-60" />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-600 rounded-2xl flex items-center justify-center transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 ${
                      isHovered ? 'shadow-2xl shadow-purple-500/50' : 'shadow-lg'
                    }`}>
                      <PawPrint size={28} className="text-white transition-all duration-500" />
                      {isHovered && (
                        <>
                          <Sparkles size={14} className="absolute -top-1 -right-1 text-yellow-300 animate-bounce" />
                          <Sparkles size={10} className="absolute -bottom-1 -left-1 text-yellow-200 animate-pulse" />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col hidden sm:block">
                    <span className={`text-2xl font-black transition-all duration-500 ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent' 
                        : 'text-white'
                    }`}>
                      PetAdopt
                    </span>
                    <span className={`text-xs font-semibold tracking-widest uppercase transition-all duration-500 ${
                      isScrolled ? 'text-gray-400' : 'text-white/80'
                    }`}>
                      Find Your Friend
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              <button 
                onClick={() => navigate('/')}
                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-purple-600 hover:bg-white/80' 
                  : 'text-white hover:text-purple-300 hover:bg-white/10'
              } hover:shadow-lg`}>
                Home
              </button>
              {isLoggedIn ? (
                <>
                  {!isVisitor && (
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-500 ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-purple-600 hover:bg-white/80' 
                        : 'text-white hover:text-purple-300 hover:bg-white/10'
                    } hover:shadow-lg`}>
                      My Favorites
                    </button>
                  )}
                  {isAdmin && (
                    <button 
                      onClick={() => navigate('/admin')}
                      className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-500 ${
                      isScrolled 
                        ? 'text-gray-700 hover:text-purple-600 hover:bg-white/80' 
                        : 'text-white hover:text-purple-300 hover:bg-white/10'
                    } hover:shadow-lg`}>
                      Admin Panel
                    </button>
                  )}
                  <div className="relative ml-4">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-lg border shadow-lg hover:shadow-xl transition-all duration-500 ${
                        isScrolled
                          ? 'bg-white/80 border-white/30'
                          : 'bg-white/10 border-white/20'
                      }`}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div className="text-left hidden sm:block">
                        <span className={`font-semibold text-sm block ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                          {user?.name || 'User'}
                        </span>
                        <span className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-white/80'}`}>
                          Pet Lover
                        </span>
                      </div>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden animate-slideDown">
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-b border-purple-100">
                          <p className="font-bold text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-600">{user?.email || ''}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} />
                          <span className="font-semibold">Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleOpenAuthModal}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                      isScrolled
                        ? 'text-white bg-gradient-to-r from-purple-600 to-indigo-600'
                        : 'text-white bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30'
                    }`}
                  >
                    <LogIn size={18} />
                    Sign In
                  </button>
                  <button 
                    onClick={handleOpenAuthModal}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
                      isScrolled
                        ? 'text-gray-700 border-2 border-gray-300 hover:border-purple-400 hover:text-purple-600'
                        : 'text-white border-2 border-white/50 hover:bg-white/10'
                    }`}
                  >
                    <UserPlus size={18} />
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleSidebar}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 backdrop-blur-lg ${
                  sidebarOpen
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xl'
                    : isScrolled
                      ? 'bg-white/80 text-gray-700 hover:bg-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30 shadow-lg border border-white/30'
                }`}
              >
                {sidebarOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {sidebarOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-white via-purple-50 to-indigo-50 backdrop-blur-xl border-t border-purple-200 shadow-2xl animate-slideDown">
            <div className="p-2 space-y-1 max-h-[80vh] overflow-y-auto">
              {/* User Info Section - Only shown when logged in */}
              {isLoggedIn && user && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl mb-1 border border-purple-200 shadow-md">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{user?.name || 'User'}</p>
                    <p className="text-gray-600 text-xs truncate">{user?.email || ''}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-md">
                      Pet Lover
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <NavLink to="/" icon={Home} mobile>
                  Home
                </NavLink>
                <NavLink to="/pets" icon={Search} mobile>
                  Browse Pets
                </NavLink>

                {isLoggedIn ? (
                  <>
                    {!isVisitor && (
                      <NavLink to="/dashboard" icon={Heart} mobile>
                        My Favorites
                      </NavLink>
                    )}
                    <NavLink to="/profile" icon={User} mobile>
                      My Profile
                    </NavLink>
                    {isAdmin && (
                      <NavLink to="/admin" icon={Settings} mobile>
                        Admin Panel
                      </NavLink>
                    )}
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleOpenAuthModal}
                      className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500 w-full text-left mx-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg border border-purple-300"
                    >
                      <div className="p-2 rounded-xl bg-white/20">
                        <LogIn size={20} className="text-white" />
                      </div>
                      <span className="font-semibold">Sign In</span>
                    </button>
                    <button 
                      onClick={handleOpenAuthModal}
                      className="flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-500 w-full text-left mx-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 text-gray-900 font-semibold shadow-md hover:shadow-lg border border-white/60"
                    >
                      <div className="p-2 rounded-xl bg-white/30">
                        <UserPlus size={20} className="text-gray-900" />
                      </div>
                      <span className="font-semibold">Sign Up</span>
                    </button>
                  </>
                )}
              </div>

              {/* Logout Button for Mobile - Only shown when logged in */}
              {isLoggedIn && (
                <>
                  <div className="my-1 border-t border-purple-200 mx-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-4 text-white hover:shadow-lg rounded-2xl transition-all duration-300 border border-red-300 backdrop-blur-sm group transform hover:scale-105 mx-2 bg-gradient-to-r from-red-500 to-red-600 shadow-md"
                  >
                    <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                      <LogOut size={20} />
                    </div>
                    <span className="font-semibold">Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}