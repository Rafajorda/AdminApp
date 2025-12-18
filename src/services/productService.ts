/**
 * Servicio de productos
 * 
 * Maneja todas las peticiones HTTP relacionadas con productos
 * Incluye validación con Zod
 */

import { Platform } from 'react-native';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ProductListResponse,
  ProductSchema,
  ProductListResponseSchema,
} from '../types/product';
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
 * Obtiene automáticamente un token válido (renovándolo si es necesario)
 */
const getHeaders = async (): Promise<HeadersInit> => {
  const token = await getValidAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

/**
 * Obtiene lista de productos con filtros opcionales
 */
export const getProducts = async (filters?: ProductFilters): Promise<ProductListResponse> => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.colorId) params.append('colorId', filters.colorId);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const url = `${API_BASE_URL}/product${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validar respuesta con Zod
    return ProductListResponseSchema.parse(data);
  } catch (error) {
    console.error('[ProductService] Error getting products:', error);
    throw error;
  }
};

/**
 * Obtiene un producto por ID
 */
export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'GET',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validar respuesta con Zod
    return ProductSchema.parse(data);
  } catch (error) {
    console.error('[ProductService] Error getting product:', error);
    throw error;
  }
};

/**
 * Crea un nuevo producto
 */
export const createProduct = async (product: CreateProductInput): Promise<Product> => {
  try {
    // Separar datos de imagen del producto
    const { imageUrl, imageAlt, ...productData } = product;
    
    // Crear el producto
    const response = await fetch(`${API_BASE_URL}/product`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Si el token expiró, limpiar AsyncStorage y lanzar error específico
      if (response.status === 401) {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        await AsyncStorage.default.multiRemove(['@access_token', '@refresh_token', '@user_data', '@last_login']);
        throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Si se proporcionó una imagen, crearla
    if (imageUrl && imageAlt) {
      try {
        await fetch(`${API_BASE_URL}/images`, {
          method: 'POST',
          headers: await getHeaders(),
          body: JSON.stringify({
            src: imageUrl,
            alt: imageAlt,
            productId: data.id,
          }),
        });
      } catch (imageError) {
        console.warn('[ProductService] Error creating product image:', imageError);
        // No lanzar error, el producto ya fue creado
      }
    }
    
    // Validar respuesta con Zod
    return ProductSchema.parse(data);
  } catch (error) {
    console.error('[ProductService] Error creating product:', error);
    throw error;
  }
};

/**
 * Actualiza un producto existente
 */
export const updateProduct = async (id: string, product: Partial<UpdateProductInput>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validar respuesta con Zod
    return ProductSchema.parse(data);
  } catch (error) {
    console.error('[ProductService] Error updating product:', error);
    throw error;
  }
};

/**
 * Elimina un producto
 */
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('[ProductService] Error deleting product:', error);
    throw error;
  }
};

/**
 * Cambia el estado de un producto (active/inactive)
 */
export const toggleProductStatus = async (id: string): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/product/${id}/toggle-status`, {
      method: 'PUT',
      headers: await getHeaders(),
    });

    if (response.status === 401) {
      throw new Error('Token expirado');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return ProductSchema.parse(data);
  } catch (error) {
    console.error('[ProductService] Error toggling product status:', error);
    throw error;
  }
};
