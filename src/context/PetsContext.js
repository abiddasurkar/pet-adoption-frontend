import React, { createContext, useState } from 'react';
import axios from 'axios';

export const PetsContext = createContext();

export const PetsProvider = ({ children }) => {
  const [allPets, setAllPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedSpecies: '',
    selectedBreed: '',
    selectedAge: '',
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch all pets with pagination and filters
  const fetchPets = async (page = 1, searchQuery = '', species = '', breed = '', age = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/pets`, {
        params: {
          page,
          search: searchQuery,
          species,
          breed,
          age,
        },
      });

      setAllPets(response.data.pets);
      setFilteredPets(response.data.pets);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch pets';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single pet by ID
  const fetchPetById = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/pets/${id}`);
      setSelectedPet(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch pet';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Search and filter pets
  const applyFilters = (query, species, breed, age) => {
    setFilters({ searchQuery: query, selectedSpecies: species, selectedBreed: breed, selectedAge: age });
    setCurrentPage(1);
    fetchPets(1, query, species, breed, age);
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
      const response = await axios.post(`${API_URL}/api/pets`, petData);
      setAllPets([...allPets, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add pet';
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
      const response = await axios.put(`${API_URL}/api/pets/${id}`, petData);
      const updatedPets = allPets.map((pet) => (pet._id === id ? response.data : pet));
      setAllPets(updatedPets);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update pet';
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
      await axios.delete(`${API_URL}/api/pets/${id}`);
      setAllPets(allPets.filter((pet) => pet._id !== id));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete pet';
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
        fetchPets,
        fetchPetById,
        applyFilters,
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


