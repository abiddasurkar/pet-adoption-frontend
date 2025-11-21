import React, { createContext, useState, useCallback } from "react";
import petsService from "../services/api/petsService";
import { PAGINATION_DEFAULTS } from "../services/api/constants";

export const PetsContext = createContext();

export const PetsProvider = ({ children }) => {
  const [allPets, setAllPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [featuredPets, setFeaturedPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [currentPage, setCurrentPage] = useState(PAGINATION_DEFAULTS.CURRENT_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPets, setTotalPets] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    searchQuery: "",
    selectedSpecies: "",
    selectedBreed: "",
    selectedAge: "",
  });

  const clearError = () => setError(null);

  /* -------------------------------------------------------
     FETCH ALL PETS WITH FILTERS & PAGINATION
  ------------------------------------------------------- */
  const fetchPets = useCallback(async (page = 1, search = "", species = "", breed = "", age = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await petsService.fetchPets(page, search, species, breed, age);

      setAllPets(response.pets || []);
      setFilteredPets(response.pets || []);
      setCurrentPage(response.currentPage || 1);
      setTotalPages(response.totalPages || 1);
      setTotalPets(response.totalPets || 0);

      return { success: true };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch pets";
      setError(errorMsg);
      console.error("Fetch pets error:", err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------------
     FETCH FEATURED PETS
  ------------------------------------------------------- */
  const fetchFeaturedPets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const pets = await petsService.fetchFeaturedPets();
      setFeaturedPets(pets || []);

      return { success: true, data: pets };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch featured pets";
      setError(errorMsg);
      console.error("Fetch featured pets error:", err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------------
     FETCH SINGLE PET BY ID
  ------------------------------------------------------- */
  const fetchPetById = useCallback(async (id) => {
    if (!id) return { success: false, error: "Pet ID is required" };

    setIsLoading(true);
    setError(null);

    try {
      const pet = await petsService.fetchPetById(id);
      setSelectedPet(pet);

      return { success: true, data: pet };
    } catch (err) {
      const errorMsg = err.message || "Failed to fetch pet details";
      setError(errorMsg);
      console.error("Fetch pet by ID error:", err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------------
     APPLY FILTERS
  ------------------------------------------------------- */
  const applyFilters = useCallback(
    (query = "", species = "", breed = "", age = "") => {
      setFilters({
        searchQuery: query,
        selectedSpecies: species,
        selectedBreed: breed,
        selectedAge: age,
      });

      return fetchPets(1, query, species, breed, age);
    },
    [fetchPets]
  );

  /* -------------------------------------------------------
     CLEAR FILTERS
  ------------------------------------------------------- */
  const clearFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      selectedSpecies: "",
      selectedBreed: "",
      selectedAge: "",
    });

    return fetchPets(1);
  }, [fetchPets]);

  /* -------------------------------------------------------
     PAGINATION - GO TO PAGE
  ------------------------------------------------------- */
  const goToPage = useCallback(
    (page) => {
      if (page < 1 || page > totalPages) {
        setError("Invalid page number");
        return { success: false, error: "Invalid page number" };
      }

      setCurrentPage(page);
      return fetchPets(page, filters.searchQuery, filters.selectedSpecies, filters.selectedBreed, filters.selectedAge);
    },
    [fetchPets, filters, totalPages]
  );

  /* -------------------------------------------------------
     ADD PET (ADMIN)
  ------------------------------------------------------- */
  const addPet = useCallback(async (petData) => {
    setIsLoading(true);
    setError(null);

    try {
      const pet = await petsService.addPet(petData);

      // Update state optimistically
      setAllPets((prev) => [pet, ...prev]);
      setFilteredPets((prev) => [pet, ...prev]);
      setTotalPets((prev) => prev + 1);

      return { success: true, data: pet };
    } catch (err) {
      const errorMsg = err.message || "Failed to add pet";
      setError(errorMsg);
      console.error("Add pet error:", err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* -------------------------------------------------------
     UPDATE PET (ADMIN) - Full replacement
  ------------------------------------------------------- */
  const updatePet = useCallback(
    async (id, petData) => {
      setIsLoading(true);
      setError(null);

      try {
        const pet = await petsService.updatePet(id, petData);

        // Update state optimistically
        setAllPets((prev) => prev.map((p) => (p._id === id ? pet : p)));
        setFilteredPets((prev) => prev.map((p) => (p._id === id ? pet : p)));

        if (selectedPet && selectedPet._id === id) {
          setSelectedPet(pet);
        }

        return { success: true, data: pet };
      } catch (err) {
        const errorMsg = err.message || "Failed to update pet";
        setError(errorMsg);
        console.error("Update pet error:", err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [selectedPet]
  );

  /* -------------------------------------------------------
     PATCH PET (ADMIN) - Partial update (status, featured, etc)
  ------------------------------------------------------- */
  const patchPet = useCallback(
    async (id, updateData) => {
      setIsLoading(true);
      setError(null);

      try {
        const pet = await petsService.patchPet(id, updateData);

        // Update state optimistically
        setAllPets((prev) => prev.map((p) => (p._id === id ? pet : p)));
        setFilteredPets((prev) => prev.map((p) => (p._id === id ? pet : p)));

        if (selectedPet && selectedPet._id === id) {
          setSelectedPet(pet);
        }

        return { success: true, data: pet };
      } catch (err) {
        const errorMsg = err.message || "Failed to update pet";
        setError(errorMsg);
        console.error("Patch pet error:", err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [selectedPet]
  );

  /* -------------------------------------------------------
     DELETE PET (ADMIN)
  ------------------------------------------------------- */
  const deletePet = useCallback(
    async (id) => {
      setIsLoading(true);
      setError(null);

      try {
        await petsService.deletePet(id);

        // Update state optimistically
        setAllPets((prev) => prev.filter((p) => p._id !== id));
        setFilteredPets((prev) => prev.filter((p) => p._id !== id));
        setTotalPets((prev) => Math.max(0, prev - 1));

        if (selectedPet && selectedPet._id === id) {
          setSelectedPet(null);
        }

        return { success: true };
      } catch (err) {
        const errorMsg = err.message || "Failed to delete pet";
        setError(errorMsg);
        console.error("Delete pet error:", err);
        return { success: false, error: errorMsg };
      } finally {
        setIsLoading(false);
      }
    },
    [selectedPet]
  );

  return (
    <PetsContext.Provider
      value={{
        // State
        allPets,
        filteredPets,
        featuredPets,
        selectedPet,
        currentPage,
        totalPages,
        totalPets,
        isLoading,
        error,
        filters,

        // Actions
        clearError,
        fetchPets,
        fetchFeaturedPets,
        fetchPetById,
        applyFilters,
        clearFilters,
        goToPage,
        addPet,
        updatePet,
        patchPet,
        deletePet,
      }}
    >
      {children}
    </PetsContext.Provider>
  );
};