import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessages, setToastMessages] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState(null);

  // Open apply modal
  const openApplyModal = (petId) => {
    setSelectedPetId(petId);
    setShowApplyModal(true);
  };

  // Close apply modal
  const closeApplyModal = () => {
    setShowApplyModal(false);
    setSelectedPetId(null);
  };

  // Open delete modal
  const openDeleteModal = (petId) => {
    setSelectedPetId(petId);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedPetId(null);
  };

  // Open auth modal
  const openAuthModal = () => {
    setAuthModalOpen(true);
  };

  // Close auth modal
  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Show toast notification
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToastMessages((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToastMessages((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Toggle sidebar
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
        
        // UI states
        toastMessages,
        isDarkMode,
        sidebarOpen,
        selectedPetId,
        
        // Modal functions
        openApplyModal,
        closeApplyModal,
        openDeleteModal,
        closeDeleteModal,
        openAuthModal,
        closeAuthModal,
        
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