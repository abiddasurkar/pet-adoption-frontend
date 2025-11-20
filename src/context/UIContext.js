import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        showApplyModal,
        showDeleteModal,
        toastMessages,
        isDarkMode,
        sidebarOpen,
        selectedPetId,
        openApplyModal,
        closeApplyModal,
        openDeleteModal,
        closeDeleteModal,
        showToast,
        toggleDarkMode,
        toggleSidebar,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};