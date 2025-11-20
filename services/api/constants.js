// =============================================
// API CONFIGURATION
// =============================================

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// =============================================
// API ENDPOINTS
// =============================================

export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    REFRESH_TOKEN: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  
  // Applications Endpoints
  APPLICATIONS: {
    BASE: '/api/applications',
    MY_APPLICATIONS: '/api/applications/my',
    BY_ID: (id) => `/api/applications/${id}`,
    APPROVE: (id) => `/api/applications/${id}/approve`,
    REJECT: (id) => `/api/applications/${id}/reject`,
    USER_APPLICATIONS: (userId) => `/api/applications/user/${userId}`,
    PET_APPLICATIONS: (petId) => `/api/applications/pet/${petId}`,
  },
  
  // Pets Endpoints
  PETS: {
    BASE: '/api/pets',
    BY_ID: (id) => `/api/pets/${id}`,
    SEARCH: '/api/pets/search',
    FILTER: '/api/pets/filter',
    FEATURED: '/api/pets/featured',
    RECENT: '/api/pets/recent',
    BY_SPECIES: (species) => `/api/pets/species/${species}`,
    STATS: '/api/pets/stats',
  },
  
  // Users Endpoints
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
    BY_ID: (id) => `/api/users/${id}`,
    UPDATE_PROFILE: '/api/users/profile',
    CHANGE_PASSWORD: '/api/users/change-password',
    UPLOAD_AVATAR: '/api/users/upload-avatar',
  },
  
  // Upload Endpoints
  UPLOAD: {
    SINGLE: '/api/upload',
    MULTIPLE: '/api/upload/multiple',
    DELETE: (filename) => `/api/upload/${filename}`,
  }
};

// =============================================
// HTTP CONSTANTS
// =============================================

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// =============================================
// APPLICATION CONSTANTS
// =============================================

// Application Status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
  CANCELLED: 'cancelled'
};

// Application Priority
export const APPLICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// =============================================
// USER & AUTH CONSTANTS
// =============================================

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VOLUNTEER: 'volunteer',
  MODERATOR: 'moderator'
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  BANNED: 'banned'
};

// Auth Token Types
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'reset_password',
  VERIFY_EMAIL: 'verify_email'
};

// =============================================
// PET CONSTANTS
// =============================================

// Pet Species
export const PET_SPECIES = {
  DOG: 'dog',
  CAT: 'cat',
  BIRD: 'bird',
  RABBIT: 'rabbit',
  HAMSTER: 'hamster',
  GUINEA_PIG: 'guinea_pig',
  FISH: 'fish',
  REPTILE: 'reptile',
  OTHER: 'other'
};

// Pet Ages
export const PET_AGES = {
  BABY: 'baby',           // 0-1 year
  YOUNG: 'young',         // 1-3 years
  ADULT: 'adult',         // 3-8 years
  SENIOR: 'senior'        // 8+ years
};

// Pet Sizes
export const PET_SIZES = {
  SMALL: 'small',         // < 20 lbs / 9 kg
  MEDIUM: 'medium',       // 20-50 lbs / 9-23 kg
  LARGE: 'large',         // 50-90 lbs / 23-41 kg
  EXTRA_LARGE: 'extra_large' // 90+ lbs / 41+ kg
};

// Pet Genders
export const PET_GENDERS = {
  MALE: 'male',
  FEMALE: 'female',
  UNKNOWN: 'unknown'
};

// Pet Status
export const PET_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  ADOPTED: 'adopted',
  NOT_AVAILABLE: 'not_available',
  FOSTERED: 'fostered'
};

// Pet Health Status
export const PET_HEALTH_STATUS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  CRITICAL: 'critical'
};

// Pet Temperament
export const PET_TEMPERAMENT = {
  CALM: 'calm',
  PLAYFUL: 'playful',
  SHY: 'shy',
  ENERGETIC: 'energetic',
  INDEPENDENT: 'independent',
  AFFECTIONATE: 'affectionate',
  PROTECTIVE: 'protective',
  SOCIAL: 'social'
};

// Pet Vaccination Status
export const VACCINATION_STATUS = {
  VACCINATED: 'vaccinated',
  NOT_VACCINATED: 'not_vaccinated',
  PARTIALLY_VACCINATED: 'partially_vaccinated',
  UNKNOWN: 'unknown'
};

// =============================================
// FILTER & SEARCH CONSTANTS
// =============================================

// Sort Options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  NAME_ASC: 'name_asc',
  NAME_DESC: 'name_desc',
  AGE_ASC: 'age_asc',
  AGE_DESC: 'age_desc'
};

// Filter Defaults
export const FILTER_DEFAULTS = {
  SPECIES: '',
  BREED: '',
  AGE: '',
  GENDER: '',
  SIZE: '',
  STATUS: 'available'
};

// =============================================
// PAGINATION CONSTANTS
// =============================================

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 12,
  CURRENT_PAGE: 1,
  MAX_VISIBLE_PAGES: 5
};

// =============================================
// STORAGE & LOCAL STORAGE KEYS
// =============================================

export const STORAGE_KEYS = {
  // Auth
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  
  // App State
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  
  // Filters
  PET_FILTERS: 'pet_filters',
  APPLICATION_FILTERS: 'application_filters'
};

// =============================================
// ERROR MESSAGES
// =============================================

export const ERROR_MESSAGES = {
  // General Errors
  DEFAULT: 'Something went wrong',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Request timeout',
  SERVER_ERROR: 'Server error occurred',
  
  // Auth Errors
  LOGIN_FAILED: 'Login failed',
  SIGNUP_FAILED: 'Signup failed',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  SESSION_EXPIRED: 'Session expired',
  TOKEN_INVALID: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
  
  // Validation Errors
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  WEAK_PASSWORD: 'Password is too weak',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Invalid phone number',
  
  // Applications Errors
  FETCH_APPLICATIONS: 'Failed to fetch applications',
  APPLY_ADOPTION: 'Failed to apply for adoption',
  APPROVE_APPLICATION: 'Failed to approve application',
  REJECT_APPLICATION: 'Failed to reject application',
  WITHDRAW_APPLICATION: 'Failed to withdraw application',
  APPLICATION_NOT_FOUND: 'Application not found',
  ALREADY_APPLIED: 'You have already applied for this pet',
  
  // Pets Errors
  FETCH_PETS: 'Failed to fetch pets',
  FETCH_PET: 'Failed to fetch pet',
  ADD_PET: 'Failed to add pet',
  UPDATE_PET: 'Failed to update pet',
  DELETE_PET: 'Failed to delete pet',
  PET_NOT_FOUND: 'Pet not found',
  PET_NOT_AVAILABLE: 'Pet is not available for adoption',
  
  // User Errors
  USER_NOT_FOUND: 'User not found',
  PROFILE_UPDATE_FAILED: 'Failed to update profile',
  PASSWORD_CHANGE_FAILED: 'Failed to change password',
  
  // File Upload Errors
  UPLOAD_FAILED: 'Failed to upload file',
  FILE_TOO_LARGE: 'File is too large',
  INVALID_FILE_TYPE: 'Invalid file type',
  MAX_FILES_EXCEEDED: 'Maximum number of files exceeded'
};

// =============================================
// SUCCESS MESSAGES
// =============================================

export const SUCCESS_MESSAGES = {
  // Auth Success
  LOGIN_SUCCESS: 'Login successful',
  SIGNUP_SUCCESS: 'Signup successful',
  LOGOUT_SUCCESS: 'Logout successful',
  
  // Applications Success
  APPLICATION_SUBMITTED: 'Application submitted successfully',
  APPLICATION_APPROVED: 'Application approved successfully',
  APPLICATION_REJECTED: 'Application rejected successfully',
  APPLICATION_WITHDRAWN: 'Application withdrawn successfully',
  
  // Pets Success
  PET_ADDED: 'Pet added successfully',
  PET_UPDATED: 'Pet updated successfully',
  PET_DELETED: 'Pet deleted successfully',
  
  // User Success
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully'
};

// =============================================
// VALIDATION CONSTANTS
// =============================================

export const VALIDATION = {
  // Password
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },
  
  // Email
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MAX_LENGTH: 254,
  },
  
  // Phone
  PHONE: {
    REGEX: /^\+?[\d\s\-()]+$/,
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  
  // Name
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    REGEX: /^[a-zA-Z\s\-']+$/,
  },
  
  // File Upload
  FILE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    MAX_IMAGES: 5,
  }
};

// =============================================
// UI CONSTANTS
// =============================================

export const UI = {
  // Breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
  },
  
  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    MODAL: 1030,
    POPOVER: 1040,
    TOOLTIP: 1050,
    NOTIFICATION: 1060,
  },
  
  // Animation
  ANIMATION: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      SHARP: 'cubic-bezier(0.4, 0, 0.6, 1)',
      SMOOTH: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

// =============================================
// DATE & TIME CONSTANTS
// =============================================

export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY hh:mm A',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ssZ',
};

// =============================================
// EXPORT DEFAULT (for easy importing)
// =============================================

export default {
  // API
  API_BASE_URL,
  API_ENDPOINTS,
  
  // HTTP
  HTTP_METHODS,
  HTTP_STATUS,
  
  // Applications
  APPLICATION_STATUS,
  APPLICATION_PRIORITY,
  
  // Users & Auth
  USER_ROLES,
  USER_STATUS,
  TOKEN_TYPES,
  
  // Pets
  PET_SPECIES,
  PET_AGES,
  PET_SIZES,
  PET_GENDERS,
  PET_STATUS,
  PET_HEALTH_STATUS,
  PET_TEMPERAMENT,
  VACCINATION_STATUS,
  
  // Filters & Search
  SORT_OPTIONS,
  FILTER_DEFAULTS,
  
  // Pagination
  PAGINATION_DEFAULTS,
  
  // Storage
  STORAGE_KEYS,
  
  // Messages
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  
  // Validation
  VALIDATION,
  
  // UI
  UI,
  
  // Date
  DATE_FORMATS,
};