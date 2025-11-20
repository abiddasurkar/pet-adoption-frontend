import { 
  API_ENDPOINTS, 
  PAGINATION_DEFAULTS,
  ERROR_MESSAGES,
  PET_SPECIES,
  PET_AGES,
  PET_GENDERS,
  PET_SIZES,
  PET_HEALTH_STATUS,
  PET_TEMPERAMENT,
  PET_STATUS,
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
      // Prepare pet data with required fields
      const payload = {
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        age: petData.age,
        size: petData.size || '',
        gender: petData.gender || '',
        healthStatus: petData.healthStatus || PET_HEALTH_STATUS.GOOD,
        temperament: Array.isArray(petData.temperament) ? petData.temperament : [],
        photoBase64: petData.photoBase64,
        description: petData.description || '',
        isFeatured: Boolean(petData.isFeatured),
        status: petData.status || PET_STATUS.AVAILABLE,
      };

      // Validate required fields
      if (!payload.name || !payload.species || !payload.breed || !payload.age || !payload.photoBase64) {
        throw new Error('Missing required fields: name, species, breed, age, and photoBase64');
      }

      const response = await apiClient.post(API_ENDPOINTS.PETS.BASE, payload);
      return response.data;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.ADD_PET);
    }
  },

  // Admin: Update pet
  updatePet: async (id, petData) => {
    try {
      // Prepare pet data with all fields
      const payload = {
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        age: petData.age,
        size: petData.size || '',
        gender: petData.gender || '',
        healthStatus: petData.healthStatus || PET_HEALTH_STATUS.GOOD,
        temperament: Array.isArray(petData.temperament) ? petData.temperament : [],
        photoBase64: petData.photoBase64,
        description: petData.description || '',
        isFeatured: Boolean(petData.isFeatured),
        status: petData.status || PET_STATUS.AVAILABLE,
      };

      // Validate required fields
      if (!payload.name || !payload.species || !payload.breed || !payload.age) {
        throw new Error('Missing required fields: name, species, breed, and age');
      }

      const response = await apiClient.put(API_ENDPOINTS.PETS.BY_ID(id), payload);
      return response.data;
    } catch (error) {
      throw new Error(error.message || ERROR_MESSAGES.UPDATE_PET);
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
  },

  // Get available health statuses
  getAvailableHealthStatuses: () => {
    return Object.values(PET_HEALTH_STATUS);
  },

  // Get available temperaments
  getAvailableTemperaments: () => {
    return Object.values(PET_TEMPERAMENT);
  },

  // Get available statuses
  getAvailableStatuses: () => {
    return Object.values(PET_STATUS);
  }
};

export default petsService;