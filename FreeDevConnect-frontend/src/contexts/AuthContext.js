import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8889/api',
  headers: { 'Content-Type': 'application/json' }
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post('/auth/signin', credentials);
      console.log('🔐 Réponse login:', response.data);

      if (response.data.token && response.data.user) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return true;
      } else {
        setError(response.data.message || 'Échec de la connexion');
        return false;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.map(e => e.message).join(', ') ||
        err.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.post('/auth/signup', userData);
      console.log('🆕 Réponse register:', response.data);

      if (response.data.token && response.data.user) {
        const { token: newToken, user: newUser } = response.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
        return true;
      } else {
        setError(response.data.message || 'Échec de l\'inscription');
        return false;
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.map(e => e.message).join(', ') ||
        err.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const getCurrentUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!savedToken || !savedUser) {
      setIsInitializing(false);
      return null;
    }

    setToken(savedToken);
    setUser(JSON.parse(savedUser));

    try {
      const response = await axiosInstance.get('/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` }
      });

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return response.data.user;
      } else {
        return null;
      }
    } catch (err) {
      console.error('Erreur getCurrentUser:', err);
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const activeToken = localStorage.getItem('token');
        if (activeToken) {
          config.headers.Authorization = `Bearer ${activeToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const value = {
    user,
    token,
    login,
    register,
    logout,
    getCurrentUser,
    error,
    loading,
    isInitializing,
    clearError: () => setError(null),
    isAuthenticated: !!token && !!user,
    role: user?.role || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}
