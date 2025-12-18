/**
 * Servicio de gestión de tokens
 * Maneja la renovación automática del access token
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  access_token_expires_at: number;
  refresh_token_expires_at: number;
}

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@access_token',
  REFRESH_TOKEN: '@refresh_token',
  TOKEN_EXPIRES_AT: '@token_expires_at',
};

/**
 * Verifica si el token está por expirar (menos de 2 minutos restantes)
 */
export const isTokenExpiringSoon = async (): Promise<boolean> => {
  try {
    const expiresAtStr = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
    if (!expiresAtStr) return true;

    const expiresAt = parseInt(expiresAtStr);
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    // Si quedan menos de 2 minutos (120000 ms), renovar
    return timeUntilExpiry < 120000;
  } catch (error) {
    console.error('[TokenService] Error checking token expiry:', error);
    return true;
  }
};

/**
 * Renueva el access token usando el refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      console.log('[TokenService] No refresh token available');
      await clearAllAuthData();
      return null;
    }

    console.log('[TokenService] Refreshing access token...');

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      console.error('[TokenService] Refresh failed (token expirado):', response.status);
      // Si el refresh falla (expiró), limpiar TODO y forzar logout
      await clearAllAuthData();
      return null;
    }

    const data: TokenResponse = await response.json();

    // Guardar nuevos tokens
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token),
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, data.access_token_expires_at.toString()),
    ]);

    console.log('[TokenService] Access token refreshed successfully');
    return data.access_token;
  } catch (error) {
    console.error('[TokenService] Error refreshing token:', error);
    await clearAllAuthData();
    return null;
  }
};

/**
 * Obtiene el access token, renovándolo si es necesario
 */
export const getValidAccessToken = async (): Promise<string | null> => {
  try {
    const shouldRefresh = await isTokenExpiringSoon();

    if (shouldRefresh) {
      console.log('[TokenService] Token expiring soon, refreshing...');
      return await refreshAccessToken();
    }

    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('[TokenService] Error getting valid token:', error);
    return null;
  }
};

/**
 * Limpia todos los tokens del storage
 */
export const clearTokens = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ACCESS_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.TOKEN_EXPIRES_AT,
  ]);
};

/**
 * Limpia TODOS los datos de autenticación (tokens + user data)
 */
export const clearAllAuthData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ACCESS_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.TOKEN_EXPIRES_AT,
    '@user_data',
    '@last_login',
  ]);
  console.log('[TokenService] All auth data cleared - session expired');
};

/**
 * Guarda los tokens después del login
 */
export const saveTokens = async (tokens: TokenResponse): Promise<void> => {
  await Promise.all([
    AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token),
    AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token),
    AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, tokens.access_token_expires_at.toString()),
  ]);
};
