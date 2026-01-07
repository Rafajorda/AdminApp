/**
 * Servicio de categorías
 * 
 * Maneja todas las peticiones HTTP relacionadas con categorías
 */

import { Platform } from 'react-native';
import { Category, CreateCategoryDto } from '../types/category';
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
 * Crea una nueva categoría
 */
export const createCategory = async (categoryData: CreateCategoryDto): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/category`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[CategoryService] Error creating category:', error);
    throw error;
  }
};

/**
 * Actualiza una categoría
 */
export const updateCategory = async (id: string, categoryData: CreateCategoryDto): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/category/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[CategoryService] Error updating category:', error);
    throw error;
  }
};

/**
 * Elimina una categoría
 */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/category/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('[CategoryService] Error deleting category:', error);
    throw error;
  }
};

/**
 * Cambia el estado de una categoría (active/inactive)
 */
export const toggleCategoryStatus = async (id: string): Promise<Category> => {
  try {
    const response = await fetch(`${API_BASE_URL}/category/${id}/toggle-status`, {
      method: 'PUT',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[CategoryService] Error toggling category status:', error);
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
