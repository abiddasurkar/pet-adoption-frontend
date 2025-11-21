import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Auth modals
  const [authModalOpen, setAuthModalOpen] = useState(false);     // Login modal
  const [signupModalOpen, setSignupModalOpen] = useState(false); // Signup modal

  const [toastMessages, setToastMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);

  // ===========================================
  // Apply Modal
  // ===========================================
  const openApplyModal = (petId) => {
    setSelectedPetId(petId);
    setShowApplyModal(true);
  };

  const closeApplyModal = () => {
    setShowApplyModal(false);
    setSelectedPetId(null);
  };

  // ===========================================
  // Delete Modal
  // ===========================================
  const openDeleteModal = (petId) => {
    setSelectedPetId(petId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedPetId(null);
  };

  // ===========================================
  // Auth Modals (Login / Signup)
  // ===========================================
  const openAuthModal = () => {
    setSignupModalOpen(false); // ensure signup modal is closed
    setAuthModalOpen(false);   // reset state
    setAuthModalOpen(true);    // open login
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openSignupModal = () => {
    setAuthModalOpen(false);   // ensure login modal is closed
    setSignupModalOpen(false); // reset state
    setSignupModalOpen(true);  // open signup
  };

  const closeSignupModal = () => {
    setSignupModalOpen(false);
  };

  // ===========================================
  // Toast
  // ===========================================
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToastMessages((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToastMessages((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // ===========================================
  // UI Toggles
  // ===========================================
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <UIContext.Provider
      value={{
        // Modal states
        showApplyModal,
        showDeleteModal,
        authModalOpen,
        signupModalOpen,
        toastMessages,
        isDarkMode,
        sidebarOpen,
        selectedPetId,

        // Apply modal functions
        openApplyModal,
        closeApplyModal,

        // Delete modal functions
        openDeleteModal,
        closeDeleteModal,

        // Auth modal functions
        openAuthModal,
        closeAuthModal,
        openSignupModal,
        closeSignupModal,

        // UI functions
        showToast,
        toggleDarkMode,
        toggleSidebar,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
