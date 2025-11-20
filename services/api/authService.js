import axios from 'axios';
import { 
  API_BASE_URL, 
  API_ENDPOINTS, 
  STORAGE_KEYS,
  ERROR_MESSAGES 
} from './constants';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout if 401 response
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    const errorMessage = error.response?.data?.message || ERROR_MESSAGES.DEFAULT;
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API Service
const authService = {
  // Signup user
  signup: async (email, password, name, phone, address) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGNUP, {
        email,
        password,
        name,
        phone,
        address,
      });
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.SIGNUP_FAILED);
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.LOGIN_FAILED);
    }
  },

  // Logout user
  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Even if API call fails, clear local storage
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      delete apiClient.defaults.headers.common['Authorization'];
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch profile');
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      return response.data;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  },

  // Get stored user data
  getStoredUser: () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  // Store auth data
  storeAuthData: (token, user) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default authService;