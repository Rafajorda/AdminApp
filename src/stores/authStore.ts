/**
 * Store de Autenticación con Zustand
 * 
 * Maneja el estado global de autenticación de la aplicación
 * - Login/Logout
 * - Persistencia de tokens en AsyncStorage
 * - Validación de rol ADMIN
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';
import { User, UserRole } from '../services/authService';
import { saveTokens } from '../services/tokenService';

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@access_token',
  REFRESH_TOKEN: '@refresh_token',
  USER_DATA: '@user_data',
  LAST_LOGIN: '@last_login',
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUserData: () => Promise<void>;
  checkSessionValidity: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * Carga los datos del usuario desde AsyncStorage al iniciar la app
   */
  loadUserData: async () => {
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
          await get().logout();
          console.log('[AuthStore] Sesión expirada (>24h), se requiere nuevo login');
          return;
        }
        
        // Validar que sea ADMIN
        if (parsedUser.role === UserRole.ADMIN) {
          set({ user: parsedUser, isAuthenticated: true, isLoading: false });
          console.log('[AuthStore] Usuario restaurado:', parsedUser.email);
        } else {
          // Si no es admin, limpiar datos
          await get().logout();
          console.log('[AuthStore] Usuario no es ADMIN, sesión limpiada');
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('[AuthStore] Error cargando datos:', error);
      await get().logout();
      set({ isLoading: false });
    }
  },

  /**
   * Verifica si la sesión sigue válida
   */
  checkSessionValidity: async () => {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    
    // Si no hay datos de usuario, la sesión expiró
    if (!userData && get().user) {
      console.log('[AuthStore] Session expired - logging out');
      await get().logout();
    }
  },

  /**
   * Login del usuario
   * Solo permite login si el usuario es ADMIN
   */
  login: async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });

      // Verificar que el usuario sea ADMIN
      if (response.user.role !== UserRole.ADMIN) {
        throw new Error('Acceso denegado. Solo administradores pueden acceder a esta aplicación.');
      }

      // Guardar tokens usando tokenService (incluye timestamp de expiración)
      await saveTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_in: response.expires_in || 900,
        access_token_expires_at: response.access_token_expires_at || Date.now() + 900000,
        refresh_token_expires_at: response.refresh_token_expires_at || Date.now() + 86400000,
      });

      // Guardar datos de usuario y timestamp del login
      const now = new Date().toISOString();
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user)),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, now),
      ]);

      set({ user: response.user, isAuthenticated: true });
      console.log('[AuthStore] Login exitoso:', response.user.email, '- Timestamp:', now);
    } catch (error) {
      console.error('[AuthStore] Error en login:', error);
      throw error;
    }
  },

  /**
   * Logout del usuario
   */
  logout: async () => {
    try {
      // TODO: Llamar al endpoint de logout del backend si existe
      // await authService.logout();
      
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.LAST_LOGIN),
      ]);

      set({ user: null, isAuthenticated: false });
      console.log('[AuthStore] Logout exitoso');
    } catch (error) {
      console.error('[AuthStore] Error en logout:', error);
      // Limpiar de todas formas
      set({ user: null, isAuthenticated: false });
    }
  },
}));
