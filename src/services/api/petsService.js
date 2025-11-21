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

/* -------------------------------------------------------
   VALIDATION
-------------------------------------------------------- */
const validatePetData = (petData, requirePhoto = false) => {
  const errors = [];

  if (!petData.name || petData.name.trim() === '') {
    errors.push('Pet name is required');
  } else if (petData.name.length > 50) {
    errors.push('Pet name cannot exceed 50 characters');
  }

  if (!petData.species || petData.species.trim() === '') {
    errors.push('Species is required');
  }

  if (!petData.breed || petData.breed.trim() === '') {
    errors.push('Breed is required');
  } else if (petData.breed.length > 50) {
    errors.push('Breed cannot exceed 50 characters');
  }

  if (!petData.age || petData.age.trim() === '') {
    errors.push('Age is required');
  }

  if (!petData.description || petData.description.trim() === '') {
    errors.push('Description is required');
  } else if (petData.description.length > 1000) {
    errors.push('Description cannot exceed 1000 characters');
  } else if (petData.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (petData.temperament && !Array.isArray(petData.temperament)) {
    errors.push('Temperament must be an array');
  }

  if (requirePhoto && !petData.photoFile && !petData.photoBase64) {
    errors.push('Photo file is required');
  }

  return errors;
};

/* -------------------------------------------------------
   FILE → FORMDATA (Direct upload)
-------------------------------------------------------- */
const createPetFormData = (petData) => {
  const formData = new FormData();

  // Append photo file directly (multer will handle it)
  if (petData.photoFile) {
    formData.append('photo', petData.photoFile);
  }

  // Append other fields
  formData.append('name', petData.name.trim());
  formData.append('species', petData.species.trim());
  formData.append('breed', petData.breed.trim());
  formData.append('age', petData.age.trim());
  formData.append('size', petData.size?.trim() || 'medium');
  formData.append('gender', petData.gender?.trim() || 'unknown');
  formData.append('healthStatus', petData.healthStatus?.trim() || PET_HEALTH_STATUS.GOOD);
  formData.append('description', petData.description.trim());
  formData.append('isFeatured', Boolean(petData.isFeatured));
  formData.append('status', petData.status?.trim() || PET_STATUS.AVAILABLE);

  // Append temperament array
  if (Array.isArray(petData.temperament)) {
    petData.temperament.forEach((temp, index) => {
      formData.append(`temperament[${index}]`, temp);
    });
  }

  return formData;
};

/* -------------------------------------------------------
   PETS SERVICE
-------------------------------------------------------- */
const petsService = {
  /* ---------------- GET ALL PETS WITH FILTERS & PAGINATION ---------------- */
  fetchPets: async (page = PAGINATION_DEFAULTS.CURRENT_PAGE, search = '', species = '', breed = '', age = '') => {
    try {
      if (page < 1) throw new Error('Invalid page number');

      const response = await apiClient.get(API_ENDPOINTS.PETS.BASE, {
        params: {
          page,
          search: search.trim(),
          species: species.trim(),
          breed: breed.trim(),
          age: age.trim(),
        },
      });

      return {
        pets: response.data.data || [],
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalPets: response.data.totalPets || 0,
      };
    } catch (error) {
      console.error('Fetch pets error:', error);
      throw new Error(error.response?.data?.message || ERROR_MESSAGES.FETCH_PETS);
    }
  },

  /* ---------------- GET FEATURED PETS ---------------- */
  fetchFeaturedPets: async () => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.PETS.BASE}/featured`);

      return response.data.data || [];
    } catch (error) {
      console.error('Fetch featured pets error:', error);
      throw new Error(error.response?.data?.message || ERROR_MESSAGES.FETCH_PETS);
    }
  },

  /* ---------------- GET PET BY ID ---------------- */
  fetchPetById: async (id) => {
    try {
      if (!id) throw new Error('Invalid pet ID');

      const response = await apiClient.get(API_ENDPOINTS.PETS.BY_ID(id));

      if (!response.data?.data) throw new Error('Invalid pet data');

      return response.data.data;
    } catch (error) {
      console.error('Fetch pet by ID error:', error);
      throw new Error(error.response?.data?.message || ERROR_MESSAGES.FETCH_PET);
    }
  },

  /* ---------------- ADD PET (Admin) - Direct FormData to Backend ---------------- */
  addPet: async (petData) => {
    try {
      if (!petData) throw new Error('Pet data is required');

      // Validate before sending
      const errors = validatePetData(petData, true);
      if (errors.length > 0) throw new Error(errors.join('; '));

      // Create FormData directly from file
      if (!petData.photoFile) {
        throw new Error('Photo file is required');
      }

      const formData = createPetFormData(petData);

      const response = await apiClient.post(API_ENDPOINTS.PETS.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!response.data?.data) throw new Error('Invalid response from server');

      return response.data.data;
    } catch (error) {
      console.error('Add pet error:', error);
      throw new Error(error.response?.data?.message || error.message || ERROR_MESSAGES.ADD_PET);
    }
  },

  /* ---------------- UPDATE PET (Admin) - Supports optional photo change ---------------- */
  updatePet: async (id, petData) => {
    try {
      if (!id) throw new Error('Invalid pet ID');
      if (!petData) throw new Error('Pet data is required');

      // Validate (photo is optional for update)
      const errors = validatePetData(petData, false);
      if (errors.length > 0) throw new Error(errors.join('; '));

      const formData = createPetFormData(petData);

      const response = await apiClient.put(API_ENDPOINTS.PETS.BY_ID(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!response.data?.data) throw new Error('Invalid response from server');

      return response.data.data;
    } catch (error) {
      console.error('Update pet error:', error);
      throw new Error(error.response?.data?.message || error.message || ERROR_MESSAGES.UPDATE_PET);
    }
  },

  /* ---------------- PARTIAL UPDATE PET (Admin, PATCH) - For status/featured changes ---------------- */
  patchPet: async (id, updateData) => {
    try {
      if (!id) throw new Error('Invalid pet ID');
      if (!updateData) throw new Error('Update data is required');

      const response = await apiClient.patch(API_ENDPOINTS.PETS.BY_ID(id), updateData);

      if (!response.data?.data) throw new Error('Invalid response from server');

      return response.data.data;
    } catch (error) {
      console.error('Patch pet error:', error);
      throw new Error(error.response?.data?.message || error.message || ERROR_MESSAGES.UPDATE_PET);
    }
  },

  /* ---------------- DELETE PET (Admin) ---------------- */
  deletePet: async (id) => {
    try {
      if (!id) throw new Error('Invalid pet ID');

      const response = await apiClient.delete(API_ENDPOINTS.PETS.BY_ID(id));
      
      return { success: true };
    } catch (error) {
      console.error('Delete pet error:', error);
      throw new Error(error.response?.data?.message || error.message || ERROR_MESSAGES.DELETE_PET);
    }
  },

  /* ---------------- OPTIONS HELPERS (for dropdowns & filters) ---------------- */
  getAvailableSpecies: () => Object.values(PET_SPECIES),
  getAvailableAges: () => Object.values(PET_AGES),
  getAvailableSizes: () => Object.values(PET_SIZES),
  getAvailableGenders: () => Object.values(PET_GENDERS),
  getAvailableHealthStatuses: () => Object.values(PET_HEALTH_STATUS),
  getAvailableTemperaments: () => Object.values(PET_TEMPERAMENT),
  getAvailableStatuses: () => Object.values(PET_STATUS),
};

export default petsService;