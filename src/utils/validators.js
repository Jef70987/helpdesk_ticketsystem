// src/utils/validators.js

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
export const validatePassword = (password) => {
  const result = {
    isValid: true,
    errors: [],
  };

  if (!password || password.length < 8) {
    result.isValid = false;
    result.errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one number');
  }

  return result;
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const required = (value, fieldName = 'This field') => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

/**
 * Validate min length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const minLength = (value, min, fieldName = 'This field') => {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
};

/**
 * Validate max length
 * @param {string} value - Value to validate
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null
 */
export const maxLength = (value, max, fieldName = 'This field') => {
  if (value && value.length > max) {
    return `${fieldName} must be less than ${max} characters`;
  }
  return null;
};

/**
 * Validate email format
 * @param {string} value - Email to validate
 * @returns {string|null} Error message or null
 */
export const email = (value) => {
  if (value && !isValidEmail(value)) {
    return 'Please enter a valid email address';
  }
  return null;
};

/**
 * Validate phone number
 * @param {string} value - Phone to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (value) => {
  const regex = /^\+?[\d\s-]{10,}$/;
  return regex.test(value);
};