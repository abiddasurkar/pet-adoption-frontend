import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PetsProvider } from './context/PetsContext';
import { ApplicationsProvider } from './context/ApplicationsContext';
import { UIProvider } from './context/UIContext';

// Pages
import LandingPage from './pages/LandingPage';
import PetDetailsPage from './pages/PetDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router basename="/pet-adoption-frontend">
      <AuthProvider>
        <PetsProvider>
          <ApplicationsProvider>
            <UIProvider>
              <div className="flex flex-col min-h-screen bg-white">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/pet/:id" element={<PetDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute requiredRole="user">
                          <UserDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            </UIProvider>
          </ApplicationsProvider>
        </PetsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;