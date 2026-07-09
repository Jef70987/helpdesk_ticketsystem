// src/services/authService.js
import api, { get, post, refreshToken } from './api';

const authService = {
  // Login user
  login: async (credentials) => {
    return await post('/auth/login/', credentials);
  },

  // Register user
  register: async (userData) => {
    return await post('/auth/register/', userData);
  },

  // Logout user
  logout: async () => {
    try {
      await post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // Get current user
  getCurrentUser: async () => {
    return await get('/auth/user/');
  },

  // Refresh token
  refreshToken: async (refresh) => {
    return await refreshToken(refresh);
  },

  // Change password
  changePassword: async (data) => {
    return await post('/auth/change-password/', data);
  },

  // Reset password request
  resetPasswordRequest: async (email) => {
    return await post('/auth/reset-password/', { email });
  },

  // Reset password confirm
  resetPasswordConfirm: async (data) => {
    return await post('/auth/reset-password/confirm/', data);
  },
};

export default authService;