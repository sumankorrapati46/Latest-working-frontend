import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser, removeUser] = useLocalStorage('user', null);
  const [token, setToken, removeToken] = useLocalStorage('token', null);
  const [loading, setLoading] = useState(true);

  // Memoized user state to prevent unnecessary re-renders
  const userState = useMemo(() => ({
    user,
    isAuthenticated: !!user && !!token,
    role: user?.role || null,
    permissions: user?.permissions || []
  }), [user, token]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Validate token if exists
        if (token && user) {
          try {
            // You can add token validation logic here
            // const isValid = await validateToken(token);
            // if (!isValid) {
            //   removeUser();
            //   removeToken();
            // }
          } catch (error) {
            console.error('Token validation failed:', error);
            removeUser();
            removeToken();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        removeUser();
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token, user, removeUser, removeToken]);

  const login = useCallback((userData, authToken) => {
    try {
      setUser(userData);
      setToken(authToken);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, [setUser, setToken]);

  const logout = useCallback(() => {
    try {
      removeUser();
      removeToken();
      // Clear any other auth-related data
      localStorage.removeItem('refreshToken');
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [removeUser, removeToken]);

  const updateUser = useCallback((updates) => {
    try {
      setUser(prevUser => ({
        ...prevUser,
        ...updates
      }));
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }, [setUser]);

  const value = useMemo(() => ({
    ...userState,
    login,
    logout,
    updateUser,
    loading
  }), [userState, login, logout, updateUser, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 