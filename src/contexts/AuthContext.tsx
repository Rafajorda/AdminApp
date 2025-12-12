/**
 * Contexto de Autenticación
 * 
 * Maneja el estado global de autenticación de la aplicación
 * - Login/Logout
 * - Persistencia de tokens en AsyncStorage
 * - Validación de rol ADMIN
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import { User, UserRole } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@access_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
  LAST_LOGIN: '@last_login',
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carga los datos del usuario desde AsyncStorage al iniciar la app
   */
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [accessToken, userData, lastLoginStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN),
      ]);

      if (accessToken && userData && lastLoginStr) {
        const parsedUser: User = JSON.parse(userData);
        const lastLogin = new Date(lastLoginStr);
        const now = new Date();
        const timeDiff = now.getTime() - lastLogin.getTime();

        // Verificar si han pasado más de 24 horas desde el último login
        if (timeDiff > ONE_DAY_MS) {
          await clearAuthData();
          console.log('[AuthContext] Sesión expirada (>24h), se requiere nuevo login');
          return;
        }
        
        // Validar que sea ADMIN
        if (parsedUser.role === UserRole.ADMIN) {
          setUser(parsedUser);
          console.log('[AuthContext] Usuario restaurado:', parsedUser.email);
        } else {
          // Si no es admin, limpiar datos
          await clearAuthData();
          console.log('[AuthContext] Usuario no es ADMIN, sesión limpiada');
        }
      }
    } catch (error) {
      console.error('[AuthContext] Error cargando datos:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      AsyncStorage.removeItem(STORAGE_KEYS.LAST_LOGIN),
    ]);
    setUser(null);
  };

  /**
   * Login del usuario
   * Solo permite login si el usuario es ADMIN
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      // Verificar que el usuario sea ADMIN
      if (response.user.role !== UserRole.ADMIN) {
        throw new Error('Acceso denegado. Solo administradores pueden acceder a esta aplicación.');
      }

      // Guardar tokens, datos de usuario y timestamp del login
      const now = new Date().toISOString();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access_token),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user)),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, now),
      ]);

      setUser(response.user);
      console.log('[AuthContext] Login exitoso:', response.user.email, '- Timestamp:', now);
    } catch (error) {
      console.error('[AuthContext] Error en login:', error);
      throw error;
    }
  };

  /**
   * Logout del usuario
   */
  const logout = async () => {
    try {
      // TODO: Llamar al endpoint de logout del backend si existe
      // await authService.logout();
      
      await clearAuthData();
      console.log('[AuthContext] Logout exitoso');
    } catch (error) {
      console.error('[AuthContext] Error en logout:', error);
      // Limpiar de todas formas
      await clearAuthData();
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
