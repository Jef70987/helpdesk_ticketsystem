import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await api.get('/auth/user/');
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login/', credentials);
      const { user: userData } = response;
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout/');
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;