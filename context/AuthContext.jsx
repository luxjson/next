'use client';

import React, { createContext, useMemo, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const api = useMemo(() => axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
  }), []);

  useEffect(() => {
    const storedToken = window.localStorage.getItem('lux-token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      const storedToken = window.localStorage.getItem('lux-token');
      if (storedToken) config.headers.Authorization = `Bearer ${storedToken}`;
      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, [api]);

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token: responseToken, admin: adminData } = response.data;
      window.localStorage.setItem('lux-token', responseToken);
      setToken(responseToken);
      setAdmin(adminData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login',
      };
    }
  };

  const logout = () => {
    window.localStorage.removeItem('lux-token');
    setToken(null);
    setAdmin(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        if (window.localStorage.getItem('lux-token')) {
          return;
        }
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        setAdmin(response.data.admin);
      } catch {
        window.localStorage.removeItem('lux-token');
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [api, token]);

  const value = { admin, loading, login, logout, api, isAuthenticated: !!admin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
