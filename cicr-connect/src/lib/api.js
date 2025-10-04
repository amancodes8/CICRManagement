/**
 * API Client Configuration and Methods
 * 
 * Centralized API client using Axios for all HTTP requests.
 * Includes interceptors for authentication, error handling, and request/response transformation.
 */

import axios from 'axios';

// Base API URL - Update this to match your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to attach authentication token
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// AUTHENTICATION API
// ============================================================================

/**
 * User login
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} User data and token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * User registration
 * @param {Object} userData - Registration data
 * @returns {Promise<Object>} User data and token
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * User logout
 * @returns {Promise<Object>} Logout confirmation
 */
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ============================================================================
// USER API
// ============================================================================

/**
 * Get all users
 * @returns {Promise<Array>} List of users
 */
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// ============================================================================
// PROJECT API
// ============================================================================

/**
 * Get all projects
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of projects
 */
export const getProjects = async (params = {}) => {
  const response = await api.get('/projects', { params });
  return response.data;
};

/**
 * Get project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project data
 */
export const getProjectById = async (projectId) => {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
};

/**
 * Create new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} Created project data
 */
export const createProject = async (projectData) => {
  const response = await api.post('/projects', projectData);
  return response.data;
};

/**
 * Update project
 * @param {string} projectId - Project ID
 * @param {Object} projectData - Updated project data
 * @returns {Promise<Object>} Updated project data
 */
export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/projects/${projectId}`, projectData);
  return response.data;
};

/**
 * Delete project
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteProject = async (projectId) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};

// ============================================================================
// MEETING API
// ============================================================================

/**
 * Get all meetings
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} List of meetings
 */
export const getMeetings = async (params = {}) => {
  const response = await api.get('/meetings', { params });
  return response.data;
};

/**
 * Get meeting by ID
 * @param {string} meetingId - Meeting ID
 * @returns {Promise<Object>} Meeting data
 */
export const getMeetingById = async (meetingId) => {
  const response = await api.get(`/meetings/${meetingId}`);
  return response.data;
};

/**
 * Create new meeting
 * @param {Object} meetingData - Meeting data
 * @returns {Promise<Object>} Created meeting data
 */
export const createMeeting = async (meetingData) => {
  const response = await api.post('/meetings', meetingData);
  return response.data;
};

/**
 * Update meeting
 * @param {string} meetingId - Meeting ID
 * @param {Object} meetingData - Updated meeting data
 * @returns {Promise<Object>} Updated meeting data
 */
export const updateMeeting = async (meetingId, meetingData) => {
  const response = await api.put(`/meetings/${meetingId}`, meetingData);
  return response.data;
};

/**
 * Delete meeting
 * @param {string} meetingId - Meeting ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteMeeting = async (meetingId) => {
  const response = await api.delete(`/meetings/${meetingId}`);
  return response.data;
};

// ============================================================================
// DASHBOARD API
// ============================================================================

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

/**
 * Get recent activities
 * @param {number} limit - Number of activities to fetch
 * @returns {Promise<Array>} List of recent activities
 */
export const getRecentActivities = async (limit = 10) => {
  const response = await api.get('/dashboard/activities', { params: { limit } });
  return response.data;
};

/**
 * Get announcements
 * @returns {Promise<Array>} List of announcements
 */
export const getAnnouncements = async () => {
  const response = await api.get('/dashboard/announcements');
  return response.data;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Upload file
 * @param {File} file - File to upload
 * @param {string} type - File type category
 * @returns {Promise<Object>} Upload response with file URL
 */
export const uploadFile = async (file, type = 'general') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;