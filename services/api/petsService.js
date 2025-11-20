import { 
  API_ENDPOINTS, 
  PAGINATION_DEFAULTS,
  ERROR_MESSAGES ,
  PET_SPECIES,
  PET_AGES,
  PET_GENDERS,
  PET_SIZES,
} from './constants';
import apiClient from './apiClient';

// Pets API Service
const petsService = {
  // Fetch all pets with pagination and filters
  fetchPets: async (page = PAGINATION_DEFAULTS.CURRENT_PAGE, searchQuery = '', species = '', breed = '', age = '') => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PETS.BASE, {
        params: {
          page,
          search: searchQuery,
          species,
          breed,
          age,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.FETCH_PETS);
    }
  },

  // Fetch single pet by ID
  fetchPetById: async (id) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PETS.BY_ID(id));
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.PET_NOT_FOUND);
      }
      throw new Error(ERROR_MESSAGES.FETCH_PET);
    }
  },

  // Search pets
  searchPets: async (query, filters = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PETS.SEARCH, {
        params: {
          query,
          ...filters
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.FETCH_PETS);
    }
  },

  // Filter pets
  filterPets: async (filters = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PETS.FILTER, {
        params: filters
      });
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.FETCH_PETS);
    }
  },

  // Admin: Add pet
  addPet: async (petData) => {
    try {
      // Handle file uploads if needed
      const formData = new FormData();
      
      // Append all pet data to formData
      Object.keys(petData).forEach(key => {
        if (key === 'images' && Array.isArray(petData[key])) {
          petData[key].forEach((image, index) => {
            if (image instanceof File) {
              formData.append('images', image);
            }
          });
        } else {
          formData.append(key, petData[key]);
        }
      });

      const response = await apiClient.post(API_ENDPOINTS.PETS.BASE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.ADD_PET);
    }
  },

  // Admin: Update pet
  updatePet: async (id, petData) => {
    try {
      // Handle file uploads if needed
      const formData = new FormData();
      
      // Append all pet data to formData
      Object.keys(petData).forEach(key => {
        if (key === 'images' && Array.isArray(petData[key])) {
          petData[key].forEach((image, index) => {
            if (image instanceof File) {
              formData.append('images', image);
            } else if (typeof image === 'string') {
              formData.append('existingImages', image);
            }
          });
        } else {
          formData.append(key, petData[key]);
        }
      });

      const response = await apiClient.put(API_ENDPOINTS.PETS.BY_ID(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.UPDATE_PET);
    }
  },

  // Admin: Delete pet
  deletePet: async (id) => {
    try {
      await apiClient.delete(API_ENDPOINTS.PETS.BY_ID(id));
      return { success: true };
    } catch (error) {
      throw new Error(ERROR_MESSAGES.DELETE_PET);
    }
  },

  // Get available species
  getAvailableSpecies: () => {
    return Object.values(PET_SPECIES);
  },

  // Get available ages
  getAvailableAges: () => {
    return Object.values(PET_AGES);
  },

  // Get available sizes
  getAvailableSizes: () => {
    return Object.values(PET_SIZES);
  },

  // Get available genders
  getAvailableGenders: () => {
    return Object.values(PET_GENDERS);
  }
};

export default petsService;