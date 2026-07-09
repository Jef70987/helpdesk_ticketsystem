// src/plugins/dateTime.js

/**
 * Format a date object to time string (HH:MM AM/PM)
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a date object to date string (MMM DD, YYYY)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date object to full datetime string
 * @param {Date} date - Date object
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param {Date} date - Date object
 * @returns {string} Relative time string
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${diffYear}y ago`;
};

/**
 * Format date for API (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDateAPI = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};