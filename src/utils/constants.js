// src/utils/constants.js

// ===== API ENDPOINTS =====
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  REGISTER: '/auth/register/',
  REFRESH: '/auth/refresh/',
  USER: '/auth/user/',
  CHANGE_PASSWORD: '/auth/change-password/',
  RESET_PASSWORD: '/auth/reset-password/',
  RESET_PASSWORD_CONFIRM: '/auth/reset-password/confirm/',
  
  // Tickets
  TICKETS: '/tickets/',
  TICKET_DETAIL: (id) => `/tickets/${id}/`,
  TICKET_MESSAGES: (id) => `/tickets/${id}/messages/`,
  TICKET_STATS: '/tickets/stats/',
  
  // Notifications
  NOTIFICATIONS: '/notifications/',
  NOTIFICATION_COUNT: '/notifications/count/',
  NOTIFICATION_MARK_READ: (id) => `/notifications/${id}/mark-read/`,
  NOTIFICATION_MARK_ALL_READ: '/notifications/mark-all-read/',
};

// ===== PAGINATION =====
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
};

// ===== DATE FORMATS =====
export const DATE_FORMATS = {
  DISPLAY: 'MMM D, YYYY',
  DISPLAY_TIME: 'MMM D, YYYY h:mm A',
  API: 'YYYY-MM-DD',
  TIME: 'h:mm A',
  DATE_SHORT: 'MMM D',
};

// ===== LOCAL STORAGE KEYS =====
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
};

// ===== ROUTES =====
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  TICKETS: '/tickets',
  TICKET_CREATE: '/tickets/create',
  TICKET_DETAIL: (id) => `/tickets/${id}`,
  NOTIFICATIONS: '/notifications',
  MESSAGES: '/messages',
};

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized. Please login.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION: 'Please check your input and try again.',
  DEFAULT: 'Something went wrong. Please try again.',
};

// ===== BADGE COLORS (Frontend only - maps status from DB to UI color) =====
export const STATUS_COLORS = {
  new: 'blue',
  open: 'yellow',
  in_progress: 'orange',
  resolved: 'green',
  closed: 'gray',
};

export const PRIORITY_COLORS = {
  1: 'red',
  2: 'orange',
  3: 'blue',
  4: 'gray',
};