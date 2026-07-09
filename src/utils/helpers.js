// src/utils/helpers.js

/**
 * Truncate a string to a specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, length = 50) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get status badge color
 * @param {string} status - Status type
 * @returns {string} Badge color class
 */
export const getStatusColor = (status) => {
  const colors = {
    new: 'blue',
    open: 'yellow',
    'in-progress': 'orange',
    resolved: 'green',
    closed: 'gray',
  };
  return colors[status] || 'gray';
};

/**
 * Get priority badge color
 * @param {number} priority - Priority level (1-4)
 * @returns {string} Badge color class
 */
export const getPriorityColor = (priority) => {
  const colors = {
    1: 'red',
    2: 'orange',
    3: 'blue',
    4: 'gray',
  };
  return colors[priority] || 'gray';
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate a random ID
 * @returns {string} Random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};