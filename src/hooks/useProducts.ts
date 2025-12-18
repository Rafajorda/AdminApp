/**
 * Hook para gestionar productos
 * 
 * Encapsula toda la lógica de:
 * - Obtención de productos
 * - Filtros y búsqueda
 * - Paginación
 * - Estados de carga y errores
 */

import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  Product,
  ProductFilters,
  ProductListResponse,
} from '../types/product';
import * as productService from '../services/productService';

export const useProducts = (initialFilters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {
    page: 1,
    limit: 10,
    status: 'all',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  /**
   * Carga productos desde el API
   */
  const loadProducts = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }
      setError(null);

      const response: ProductListResponse = await productService.getProducts(filters);
      
      setProducts(response.data);
      setPagination({
        total: response.total,
        page: response.page || 1,
        limit: response.limit || 1000,
        totalPages: response.totalPages || Math.ceil(response.total / (response.limit || 10)),
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar productos';
      setError(errorMessage);
      console.error('[useProducts] Error:', err);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  /**
   * Refresca la lista de productos
   */
  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProducts(false);
  }, [loadProducts]);

  /**
   * Carga más productos (paginación)
   */
  const loadMore = useCallback(async () => {
    if (pagination.page < pagination.totalPages && !isLoading) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  }, [pagination, isLoading]);

  /**
   * Aplica nuevos filtros
   */
  const applyFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1, // Resetear página al aplicar filtros
    }));
  }, []);

  /**
   * Busca productos por texto
   */
  const search = useCallback((searchText: string) => {
    applyFilters({ search: searchText });
  }, [applyFilters]);

  /**
   * Resetea los filtros
   */
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      status: 'all',
    });
  }, []);

  /**
   * Elimina un producto
   */
  const deleteProduct = useCallback(async (id: string) => {
    try {
      await productService.deleteProduct(id);
      // Recargar lista después de eliminar
      await loadProducts(false);
      Alert.alert('Éxito', 'Producto eliminado correctamente');
    } catch (err: any) {
      const errorMessage = err.message || 'Error al eliminar producto';
      Alert.alert('Error', errorMessage);
      throw err;
    }
  }, [loadProducts]);

  /**
   * Cambia el estado de un producto
   */
  const toggleStatus = useCallback(async (id: string) => {
    try {
      await productService.toggleProductStatus(id);
      // Recargar lista después de cambiar estado
      await loadProducts(false);
      Alert.alert('Éxito', 'Estado del producto actualizado');
    } catch (err: any) {
      const errorMessage = err.message || 'Error al actualizar estado';
      Alert.alert('Error', errorMessage);
      throw err;
    }
  }, [loadProducts]);

  /**
   * Carga productos cuando cambian los filtros
   */
  useEffect(() => {
    loadProducts();
  }, [filters.page, filters.limit, filters.search, filters.categoryId, filters.colorId, filters.status]);

  return {
    // Estado
    products,
    isLoading,
    isRefreshing,
    error,
    filters,
    pagination,
    
    // Acciones
    refresh,
    loadMore,
    applyFilters,
    search,
    resetFilters,
    deleteProduct,
    toggleStatus,
  };
};
