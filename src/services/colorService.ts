/**
 * Servicio de colores
 * 
 * Maneja todas las peticiones HTTP relacionadas con colores
 */

import { Platform } from 'react-native';
import { Color, CreateColorDto } from '../types/color';
import { getValidAccessToken } from './tokenService';

/**
 * Configuración de URLs del backend
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'web' 
    ? 'http://localhost:3000' 
    : 'http://10.250.79.59:3000');

/**
 * Headers comunes para las peticiones
 */
const getHeaders = async (): Promise<HeadersInit> => {
  const token = await getValidAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Obtiene todos los colores
 */
export const getColors = async (): Promise<Color[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/color`, {
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
    console.error('[ColorService] Error getting colors:', error);
    throw error;
  }
};

/**
 * Obtiene un color por ID
 */
export const getColorById = async (id: string): Promise<Color> => {
  try {
    const response = await fetch(`${API_BASE_URL}/color/${id}`, {
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
    console.error('[ColorService] Error getting color:', error);
    throw error;
  }
};

/**
 * Crea un nuevo color
 */
export const createColor = async (colorData: CreateColorDto): Promise<Color> => {
  try {
    const response = await fetch(`${API_BASE_URL}/color`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(colorData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[ColorService] Error creating color:', error);
    throw error;
  }
};

/**
 * Actualiza un color
 */
export const updateColor = async (id: string, colorData: CreateColorDto): Promise<Color> => {
  try {
    const response = await fetch(`${API_BASE_URL}/color/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(colorData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[ColorService] Error updating color:', error);
    throw error;
  }
};

/**
 * Elimina un color
 */
export const deleteColor = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/color/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('[ColorService] Error deleting color:', error);
    throw error;
  }
};
