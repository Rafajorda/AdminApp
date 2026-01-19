/**
 * Servicio de usuarios
 * 
 * Maneja todas las peticiones HTTP relacionadas con usuarios
 */

import { Platform } from 'react-native';
import { User, CreateUserDto, UpdateUserDto } from '../types/user';
import { getValidAccessToken } from './tokenService';

export interface PaginatedResponse {
  data: User[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Configuración de URLs del backend
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'web' 
    ? 'http://localhost:3000' 
    : 'http://10.250.77.96:3000');

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
 * Obtiene todos los usuarios con paginación
 */
export const getUsers = async (page: number = 1, limit: number = 20): Promise<PaginatedResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users?page=${page}&limit=${limit}`, {
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
    console.error('[UserService] Error getting users:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por ID
 */
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
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
    console.error('[UserService] Error getting user:', error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario
 */
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[UserService] Error creating user:', error);
    throw error;
  }
};

/**
 * Actualiza un usuario
 */
export const updateUser = async (id: number, userData: UpdateUserDto): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[UserService] Error updating user:', error);
    throw error;
  }
};

/**
 * Elimina un usuario (física)
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('[UserService] Error deleting user:', error);
    throw error;
  }
};

/**
 * Cambia el estado de un usuario (active/inactive)
 */
export const toggleUserStatus = async (id: number): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}/toggle-status`, {
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
    console.error('[UserService] Error toggling user status:', error);
    throw error;
  }
};
