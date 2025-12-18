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
  Text,
  Card,
  Button,
  Searchbar,
  FAB,
  IconButton,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { colors } from '../theme';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types/product';

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
    <Card style={styles.productCard}>
      <Card.Content>
        <View style={styles.productHeader}>
          <View style={styles.productInfo}>
            <Text variant="titleMedium" style={styles.productName}>
              {item.name}
            </Text>
            <Text variant="bodySmall" style={styles.productMaterial}>
              {item.material}
            </Text>
          </View>
          <Chip
            mode="flat"
            style={[
              styles.statusChip,
              item.status === 'active' ? styles.activeChip : styles.inactiveChip,
            ]}
            textStyle={styles.chipText}
          >
            {item.status === 'active' ? 'Activo' : 'Inactivo'}
          </Chip>
        </View>

        <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>

        <View style={styles.productDetails}>
          <Text variant="titleLarge" style={styles.price}>
            €{item.price.toFixed(2)}
          </Text>
          {item.dimensions && (
            <Text variant="bodySmall" style={styles.dimensions}>
              📏 {item.dimensions}
            </Text>
          )}
        </View>

        {/* Categorías */}
        {item.categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            {item.categories.map((category) => (
              <Chip
                key={category.id}
                compact
                style={styles.categoryChip}
                textStyle={styles.categoryText}
              >
                {category.name}
              </Chip>
            ))}
          </View>
        )}

        {/* Colores */}
        {item.colors && item.colors.length > 0 && (
          <View style={styles.colorsContainer}>
            {item.colors.map((color) => color && color.id && (
              <View
                key={color.id}
                style={[styles.colorDot, { backgroundColor: color.hexCode || '#CCCCCC' }]}
              />
            ))}
          </View>
        )}

        {/* Acciones */}
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => handleEditProduct(item.id)}
          />
          <IconButton
            icon={item.status === 'active' ? 'eye-off' : 'eye'}
            size={20}
            onPress={() => handleToggleStatus(item.id)}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor={colors.light.error}
            onPress={() => handleDeleteProduct(item.id, item.name)}
          />
        </View>
      </Card.Content>
    </Card>
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
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Productos
        </Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          {pagination.total} productos totales
        </Text>
      </View>

      {/* Barra de búsqueda */}
      <Searchbar
        placeholder="Buscar productos..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchbar}
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
    backgroundColor: colors.light.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    color: colors.light.text,
  },
  subtitle: {
    color: colors.light.textSecondary,
    marginTop: 4,
  },
  searchbar: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.light.surface,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  productCard: {
    marginBottom: 12,
    backgroundColor: colors.light.surface,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontWeight: 'bold',
    color: colors.light.text,
  },
  productMaterial: {
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
  },
  inactiveChip: {
    backgroundColor: '#FFEBEE',
  },
  chipText: {
    fontSize: 12,
  },
  description: {
    color: colors.light.textSecondary,
    marginBottom: 12,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontWeight: 'bold',
    color: colors.light.primary,
  },
  dimensions: {
    color: colors.light.textSecondary,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryChip: {
    height: 26,
    backgroundColor: colors.light.secondary,
  },
  categoryText: {
    fontSize: 11,
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginRight: -8,
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
