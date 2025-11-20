import { 
  API_ENDPOINTS, 
  ERROR_MESSAGES 
} from './constants';
import apiClient from './apiClient'; // We'll create this shared client

// Applications API Service
const applicationsService = {
  // Get user's applications
  getUserApplications: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.APPLICATIONS.MY_APPLICATIONS);
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.FETCH_APPLICATIONS);
    }
  },

  // Get all applications (admin only)
  getAllApplications: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.APPLICATIONS.BASE);
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.FETCH_APPLICATIONS);
    }
  },

  // Apply for adoption
  applyForAdoption: async (petId, userMessage) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.APPLICATIONS.BASE, {
        petId,
        userMessage,
      });
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.APPLY_ADOPTION);
    }
  },

  // Admin: Approve application
  approveApplication: async (appId, adminNotes = '') => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.APPLICATIONS.APPROVE(appId),
        { adminNotes }
      );
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.APPROVE_APPLICATION);
    }
  },

  // Admin: Reject application
  rejectApplication: async (appId, adminNotes = '') => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.APPLICATIONS.REJECT(appId),
        { adminNotes }
      );
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.REJECT_APPLICATION);
    }
  },

  // User: Withdraw application
  withdrawApplication: async (appId) => {
    try {
      await apiClient.delete(API_ENDPOINTS.APPLICATIONS.BY_ID(appId));
      return { success: true };
    } catch (error) {
      throw new Error(ERROR_MESSAGES.WITHDRAW_APPLICATION);
    }
  },
};

export default applicationsService;