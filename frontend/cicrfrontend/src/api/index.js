import axios from 'axios';

/* ================================
   AXIOS INSTANCE CONFIGURATION
=============================== */
const API = axios.create({
  baseURL: 'http://localhost:4000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================================
   REQUEST INTERCEPTOR
   Attaches the JWT token from localStorage to every outgoing request
=============================== */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   AUTHENTICATION & PROFILE
=============================== */
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const verifyEmail = (token) => API.get(`/auth/verifyemail/${token}`);

// Fetches the logged-in user's own data
export const getMe = () => API.get('/auth/me');

// Updates personal details (Year, Phone, Branch, Batch)
export const updateProfile = (data) => API.put('/auth/profile', data);

/* ================================
   ADMINISTRATION (RESTRICTED)
=============================== */
// User Management
export const fetchMembers = () => API.get('/admin/users'); 
export const updateUserByAdmin = (id, data) => API.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

// Invitation System
export const generateInvite = () => API.post('/admin/invite');
export const sendInviteEmail = (data) => API.post('/admin/send-invite', data);

/* ================================
   PROJECT MANAGEMENT
=============================== */
export const fetchProjects = () => API.get('/projects');
export const fetchProjectById = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post('/projects', data);
export const addProjectSuggestion = (id, text) => API.post(`/projects/${id}/suggestions`, { text });

/* ================================
   COMMUNITY & FORUM
=============================== */
export const fetchPosts = () => API.get('/community/posts');
export const createPost = (data) => API.post('/community/posts', data);
export const likePost = (id) => API.post(`/community/posts/${id}/like`);
export const deletePost = (id) => API.delete(`/community/posts/${id}`);

/* ================================
   MEETINGS & EVENTS
=============================== */
export const fetchMeetings = () => API.get('/meetings');
export const scheduleMeeting = (data) => API.post('/meetings', data);
export const deleteMeeting = (id) => API.delete(`/meetings/${id}`);

/* ================================
   INVENTORY SYSTEM
=============================== */
export const fetchInventory = () => API.get('/inventory');
export const addInventoryItem = (data) => API.post('/inventory/add', data);
export const issueInventoryItem = (data) => API.post('/inventory/issue', data);
export const updateInventoryItem = (id, data) => API.put(`/inventory/${id}`, data);
export const deleteInventoryItem = (id) => API.delete(`/inventory/${id}`);

/* ================================
   AI TOOLS
=============================== */
export const summarize = (data) => API.post('/chatbot/summarize', data);

export default API;