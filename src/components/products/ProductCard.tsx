/**
 * Componente ProductCard
 * 
 * Tarjeta compacta para mostrar información de producto
 * con acciones de editar, toggle status y eliminar
 */

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Card, Text, Chip, IconButton } from 'react-native-paper';
import { Product } from '../../types/product';
import { colors } from '../../theme';

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

export const ProductCard = ({ product, onEdit, onToggleStatus, onDelete }: ProductCardProps) => {
  const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {/* Header: Imagen, Nombre, Material, Precio y Estado */}
        <View style={styles.header}>
          {firstImage && (
            <Image
              source={{ uri: firstImage.src }}
              style={styles.productImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.info}>
            <Text variant="titleSmall" style={styles.name}>
              {product.name}
            </Text>
            <Text variant="bodySmall" style={styles.material}>
              {product.material} • €{product.price.toFixed(2)}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Chip
              mode="flat"
              compact
              style={[
                styles.statusChip,
                product.status === 'active' ? styles.activeChip : styles.inactiveChip,
              ]}
              textStyle={styles.chipText}
            >
              {product.status === 'active' ? 'Activo' : 'Inactivo'}
            </Chip>
          </View>
        </View>

        {/* Categorías y Colores */}
        <View style={styles.metaRow}>
          {product.categories.length > 0 && (
            <View style={styles.categoriesContainer}>
              {product.categories.slice(0, 2).map((category) => (
                <Chip
                  key={category.id}
                  compact
                  style={styles.categoryChip}
                  textStyle={styles.categoryText}
                >
                  {category.name}
                </Chip>
              ))}
              {product.categories.length > 2 && (
                <Text style={styles.moreText}>+{product.categories.length - 2}</Text>
              )}
            </View>
          )}
          
          {product.colors && product.colors.length > 0 && (
            <View style={styles.colorsContainer}>
              {product.colors.slice(0, 3).map((color) => color && color.id && (
                <View
                  key={color.id}
                  style={[styles.colorDot, { backgroundColor: color.hexCode || '#CCCCCC' }]}
                />
              ))}
              {product.colors.length > 3 && (
                <Text style={styles.moreText}>+{product.colors.length - 3}</Text>
              )}
            </View>
          )}
        </View>

        {/* Acciones */}
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={18}
            onPress={() => onEdit(product.id)}
          />
          <IconButton
            icon={product.status === 'active' ? 'eye-off' : 'eye'}
            size={18}
            onPress={() => onToggleStatus(product.id)}
          />
          <IconButton
            icon="delete"
            size={18}
            iconColor={colors.light.error}
            onPress={() => onDelete(product.id, product.name)}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    backgroundColor: colors.light.surface,
    elevation: 2,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: colors.light.background,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontWeight: '600',
    color: colors.light.text,
    fontSize: 14,
  },
  material: {
    color: colors.light.textSecondary,
    marginTop: 2,
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    height: 24,
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
  },
  inactiveChip: {
    backgroundColor: '#FFEBEE',
  },
  chipText: {
    fontSize: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    minHeight: 24,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  categoryChip: {
    height: 24,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 10,
    color: colors.light.surface,
    lineHeight: 12,
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.light.primary,
    elevation: 1,
  },
  moreText: {
    fontSize: 10,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginRight: -8,
  },
});
