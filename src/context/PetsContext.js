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
 // inside PetsProvider: replace the old fetchPets with this
const fetchPets = useCallback(
  async (page = 1, search = "", species = "", breed = "", age = "") => {
    const MAX_RETRIES = 3;          // total attempts = 1 initial + (MAX_RETRIES - 1) retries
    const BACKOFF_BASE_MS = 300;   // base delay for exponential backoff (300ms, 600ms, 1200ms...)

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    setIsLoading(true);
    setError(null);

    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        attempt += 1;
        const response = await petsService.fetchPets(page, search, species, breed, age);

        setAllPets(response.pets || []);
        setFilteredPets(response.pets || []);
        setCurrentPage(response.currentPage || 1);
        setTotalPages(response.totalPages || 1);
        setTotalPets(response.totalPets || 0);

        setIsLoading(false);
        return { success: true };
      } catch (err) {
        // Determine if the error is retryable:
        // - No response (network)
        // - 5xx server error
        // - 429 Too Many Requests
        const status = err?.response?.status;
        const isNetworkError = !err?.response;
        const isServerError = status >= 500 && status < 600;
        const isRateLimit = status === 429;

        const shouldRetry = isNetworkError || isServerError || isRateLimit;

        const errorMsg = err?.message || "Failed to fetch pets";
        console.error(`Fetch pets error (attempt ${attempt}):`, err);

        // If we've exhausted attempts or error is not retryable, set error and return failure
        if (attempt >= MAX_RETRIES || !shouldRetry) {
          setError(errorMsg);
          setIsLoading(false);
          return { success: false, error: errorMsg };
        }

        // Otherwise wait (exponential backoff) and try again
        const backoff = BACKOFF_BASE_MS * Math.pow(2, attempt - 1); // 300, 600, 1200...
        await sleep(backoff);
        // loop continues to next attempt
      }
    }

    // Should not reach here, but keep a safe fallback
    setIsLoading(false);
    setError("Failed to fetch pets");
    return { success: false, error: "Failed to fetch pets" };
  },
  []
);

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