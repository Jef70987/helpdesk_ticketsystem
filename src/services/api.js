const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get CSRF token from cookies
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

const api = {
  get: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  post: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  patch: async (url, data) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (url) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
    });
    return handleResponse(response);
  },
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    throw new Error('Session expired. Please login again.');
  }

  if (!response.ok) {
    let errorMessage = 'Something went wrong. Please try again.';
    
    try {
      const errorData = await response.json();
      if (typeof errorData === 'object') {
        if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch {
      errorMessage = response.statusText || 'Request failed';
    }
    
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  // For blob responses (file downloads like Excel/PDF)
  if (response.headers.get('content-type')?.includes('application/octet-stream') ||
      response.headers.get('content-type')?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
      response.headers.get('content-type')?.includes('application/pdf')) {
    return response.blob();
  }

  return response.json();
};

export default api;