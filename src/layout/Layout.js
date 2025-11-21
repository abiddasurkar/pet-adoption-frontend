import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Global Background Elements - LOWER z-index */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/5 to-indigo-400/10 pointer-events-none z-0" />
      
      {/* Floating Particles - LOWER z-index */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-float"
            style={{
              left: `${15 + i * 12}%`,
              top: `${20 + (i * 8)}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Navigation - HIGHEST z-index */}
      <Navbar />
      
      {/* Main Content - MEDIUM z-index (above background, below navbar) */}
      {/* NO padding-top here - let pages control their own spacing */}
      <main className="flex-grow relative z-10">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />

      {/* Auth Modal - HIGHEST z-index for modal overlay */}
      <AuthModal />

      {/* Global Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(-5px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Layout;