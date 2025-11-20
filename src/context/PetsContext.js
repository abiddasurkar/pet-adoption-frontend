import React, { createContext, useState } from 'react';
import petsService from '../services/api/petsService';
import { PAGINATION_DEFAULTS } from '../services/api/constants';

export const PetsContext = createContext();

export const PetsProvider = ({ children }) => {
  const [allPets, setAllPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPage, setCurrentPage] = useState(PAGINATION_DEFAULTS.CURRENT_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedSpecies: '',
    selectedBreed: '',
    selectedAge: '',
  });

  // Clear error
  const clearError = () => setError(null);

  // Fetch all pets with pagination and filters
  const fetchPets = async (page = PAGINATION_DEFAULTS.CURRENT_PAGE, searchQuery = '', species = '', breed = '', age = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await petsService.fetchPets(page, searchQuery, species, breed, age);

      setAllPets(response.pets);
      setFilteredPets(response.pets);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      
      return response;
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single pet by ID
  const fetchPetById = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const pet = await petsService.fetchPetById(id);
      setSelectedPet(pet);
      return pet;
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Search and filter pets
  const applyFilters = (query, species, breed, age) => {
    const newFilters = { 
      searchQuery: query, 
      selectedSpecies: species, 
      selectedBreed: breed, 
      selectedAge: age 
    };
    setFilters(newFilters);
    setCurrentPage(PAGINATION_DEFAULTS.CURRENT_PAGE);
    fetchPets(PAGINATION_DEFAULTS.CURRENT_PAGE, query, species, breed, age);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      selectedSpecies: '',
      selectedBreed: '',
      selectedAge: '',
    });
    setCurrentPage(PAGINATION_DEFAULTS.CURRENT_PAGE);
    fetchPets(PAGINATION_DEFAULTS.CURRENT_PAGE);
  };

  // Pagination
  const goToPage = (page) => {
    setCurrentPage(page);
    fetchPets(page, filters.searchQuery, filters.selectedSpecies, filters.selectedBreed, filters.selectedAge);
  };

  // Admin: Add pet
  const addPet = async (petData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPet = await petsService.addPet(petData);
      setAllPets(prev => [...prev, newPet]);
      return { success: true, data: newPet };
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Admin: Update pet
  const updatePet = async (id, petData) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPet = await petsService.updatePet(id, petData);
      const updatedPets = allPets.map((pet) => (pet._id === id ? updatedPet : pet));
      setAllPets(updatedPets);
      
      // Update selected pet if it's the one being updated
      if (selectedPet && selectedPet._id === id) {
        setSelectedPet(updatedPet);
      }
      
      return { success: true, data: updatedPet };
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Admin: Delete pet
  const deletePet = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await petsService.deletePet(id);
      setAllPets(prev => prev.filter((pet) => pet._id !== id));
      setFilteredPets(prev => prev.filter((pet) => pet._id !== id));
      
      // Clear selected pet if it's the one being deleted
      if (selectedPet && selectedPet._id === id) {
        setSelectedPet(null);
      }
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PetsContext.Provider
      value={{
        allPets,
        filteredPets,
        selectedPet,
        currentPage,
        totalPages,
        isLoading,
        error,
        filters,
        clearError,
        fetchPets,
        fetchPetById,
        applyFilters,
        clearFilters,
        goToPage,
        addPet,
        updatePet,
        deletePet,
      }}
    >
      {children}
    </PetsContext.Provider>
  );
};