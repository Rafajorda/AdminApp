/**
 * Pantalla de Dashboard de Productos
 * 
 * Gestión completa de productos:
 * - Lista con búsqueda y filtros
 * - Crear, editar, eliminar productos
 * - Cambiar estado (activo/inactivo)
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  FAB,
  ActivityIndicator,
  Appbar,
  Button,
  Text,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { colors } from '../theme';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';
import { ProductCard, ProductListHeader } from '../components/products';

export const ProductsDashboardScreen = () => {
  const router = useRouter();
  const {
    products,
    isLoading,
    isRefreshing,
    pagination,
    search,
    refresh,
    loadMore,
    deleteProduct,
    toggleStatus,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Refresca la lista cuando la pantalla obtiene el foco
   */
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  /**
   * Maneja la búsqueda de productos
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    search(query);
  };

  /**
   * Navega a la pantalla de crear producto
   */
  const handleCreateProduct = () => {
    router.push('/create-product');
  };

  /**
   * Navega a la pantalla de editar producto
   */
  const handleEditProduct = (id: string) => {
    router.push(`/edit-product/${id}`);
  };

  /**
   * Confirma y elimina un producto
   */
  const handleDeleteProduct = async (id: string, name: string) => {
    // TODO: Mostrar diálogo de confirmación
    try {
      await deleteProduct(id);
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  };

  /**
   * Cambia el estado del producto
   */
  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatus(id);
    } catch (error) {
      console.error('Error cambiando estado:', error);
    }
  };

  /**
   * Renderiza cada producto en la lista
   */
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onEdit={handleEditProduct}
      onToggleStatus={handleToggleStatus}
      onDelete={handleDeleteProduct}
    />
  );

  /**
   * Footer de la lista con indicador de carga
   */
  const renderFooter = () => {
    if (!isLoading || products.length === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.light.primary} />
      </View>
    );
  };

  /**
   * Placeholder cuando no hay productos
   */
  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
          No hay productos
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
          {searchQuery
            ? 'No se encontraron productos con ese criterio'
            : 'Comienza creando tu primer producto'}
        </Text>
        {!searchQuery && (
          <Button
            mode="contained"
            onPress={handleCreateProduct}
            style={styles.emptyButton}
          >
            Crear Producto
          </Button>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Appbar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Productos" />
      </Appbar.Header>

      {/* Header con búsqueda y contador */}
      <ProductListHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        totalCount={pagination.total}
      />

      {/* Lista de productos */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />

      {/* Botón flotante para crear producto */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleCreateProduct}
        label="Nuevo Producto"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background, // Arena suave
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    color: colors.light.text,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.light.textSecondary,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.light.primary,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.light.primary,
  },
});
