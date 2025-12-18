/**
 * Servicio de categorías
 * 
 * Maneja todas las peticiones HTTP relacionadas con categorías
 */

import { Platform } from 'react-native';
import { Category } from '../types/product';

/**
 * Configuración de URLs del backend
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'web' 
    ? 'http://localhost:3000' 
    : 'http://10.250.79.59:3000');

/**
 * Obtiene el token de acceso desde AsyncStorage
 */
const getAuthToken = async (): Promise<string | null> => {
  const AsyncStorage = await import('@react-native-async-storage/async-storage');
  return AsyncStorage.default.getItem('@access_token');
};

/**
 * Headers comunes para las peticiones
 */
const getHeaders = async (): Promise<HeadersInit> => {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Obtiene todas las categorías
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/category`, {
      method: 'GET',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[CategoryService] Error getting categories:', error);
    throw error;
  }
};

/**
 * Obtiene una categoría por ID
 */
export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/category/${id}`, {
      method: 'GET',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[CategoryService] Error getting category:', error);
    throw error;
  }
};
