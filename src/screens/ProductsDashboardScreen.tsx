/**
 * Pantalla de Dashboard de Productos
 * 
 * Gestión completa de productos:
 * - Lista con búsqueda y filtros
 * - Crear, editar, eliminar productos
 * - Cambiar estado (activo/inactivo)
 * - Generar etiquetas con QR
 * - Escanear QR para buscar productos
 */

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Modal, Alert } from 'react-native';
import {
  FAB,
  ActivityIndicator,
  Appbar,
  Button,
  Text,
  Portal,
  Dialog,
  useTheme,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { 
  useProductsQuery, 
  useDeleteProductMutation,
  useToggleProductStatusMutation,
} from '../hooks/queries';
import { Product } from '../types/product';
import { ProductCard, ProductListHeader, ProductLabel, QRScanner } from '../components/products';

export const ProductsDashboardScreen = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = getStyles(theme);
  
  // React Query hooks
  const { data: products = [], isLoading, refetch, isRefetching } = useProductsQuery();
  const deleteProductMutation = useDeleteProductMutation();
  const toggleStatusMutation = useToggleProductStatusMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  /**
   * Refresca la lista cuando la pantalla obtiene el foco
   */
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  /**
   * Productos filtrados por búsqueda
   */
  const filteredProducts = searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  /**
   * Maneja la búsqueda de productos
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
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
   * Confirma eliminación de producto
   */
  const handleDeleteProduct = (id: string, name: string) => {
    setProductToDelete({ id, name });
    setDeleteDialogVisible(true);
  };

  /**
   * Confirma y ejecuta eliminación
   */
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
      Alert.alert('Éxito', 'Producto eliminado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el producto');
    } finally {
      setDeleteDialogVisible(false);
      setProductToDelete(null);
    }
  };

  /**
   * Cambia el estado del producto
   */
  const handleToggleStatus = async (id: string) => {
    try {
      await toggleStatusMutation.mutateAsync(id);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado del producto');
    }
  };

  /**
   * Abre el modal de etiqueta del producto
   */
  const handleGenerateLabel = (product: Product) => {
    setSelectedProduct(product);
  };

  /**
   * Cierra el modal de etiqueta
   */
  const handleCloseLabelModal = () => {
    setSelectedProduct(null);
  };

  /**
   * Abre el escáner de QR
   */
  const handleOpenScanner = () => {
    setShowScanner(true);
  };

  /**
   * Cierra el escáner de QR
   */
  const handleCloseScanner = () => {
    setShowScanner(false);
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
      onGenerateLabel={handleGenerateLabel}
    />
  );

  /**
   * Footer de la lista con indicador de carga
   */
  const renderFooter = () => {
    if (!isRefetching || products.length === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
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
        <Appbar.BackAction onPress={() => router.push('/dashboard')} />
        <Appbar.Content title="Productos" />
        <Appbar.Action icon="qrcode-scan" onPress={handleOpenScanner} />
      </Appbar.Header>

      {/* Header con búsqueda y contador */}
      <ProductListHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        totalCount={filteredProducts.length}
      />

      {/* Lista de productos */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
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

      {/* Diálogo de confirmación de eliminación */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Confirmar eliminación</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de que quieres eliminar "{productToDelete?.name}"?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
            <Button onPress={confirmDelete} loading={deleteProductMutation.isPending}>
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Modal de etiqueta del producto */}
      <Modal
        visible={!!selectedProduct}
        transparent
        animationType="fade"
        onRequestClose={handleCloseLabelModal}
      >
        {selectedProduct && (
          <ProductLabel
            product={selectedProduct}
            onClose={handleCloseLabelModal}
          />
        )}
      </Modal>

      {/* Modal de escáner QR */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={handleCloseScanner}
      >
        <QRScanner onClose={handleCloseScanner} />
      </Modal>
    </View>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.onBackground,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: theme.colors.primary,
  },
});
