// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // Applications
  APPLICATIONS: {
    BASE: '/api/applications',
    MY_APPLICATIONS: '/api/applications/my',
    BY_ID: (id) => `/api/applications/${id}`,
    APPROVE: (id) => `/api/applications/${id}/approve`,
    REJECT: (id) => `/api/applications/${id}/reject`,
  },
  // Pets (if needed for future expansion)
  PETS: {
    BASE: '/api/pets',
    BY_ID: (id) => `/api/pets/${id}`,
  },
  // Users (if needed for future expansion)
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/profile',
  }
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Application Status Constants
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
};

// Error Messages
export const ERROR_MESSAGES = {
  DEFAULT: 'Something went wrong',
  NETWORK_ERROR: 'Network error occurred',
  FETCH_APPLICATIONS: 'Failed to fetch applications',
  APPLY_ADOPTION: 'Failed to apply for adoption',
  APPROVE_APPLICATION: 'Failed to approve application',
  REJECT_APPLICATION: 'Failed to reject application',
  WITHDRAW_APPLICATION: 'Failed to withdraw application'
};