/**
 * Componente ProductCard
 * 
 * Tarjeta compacta para mostrar información de producto
 * con acciones de editar, toggle status y eliminar
 */

import React from 'react';
import { View, Image } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme } from 'react-native-paper';
import { Product } from '../../../types/product';
import { getStyles } from './ProductCard.styles';

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onGenerateLabel?: (product: Product) => void;
}

export const ProductCard = ({ product, onEdit, onToggleStatus, onDelete, onGenerateLabel }: ProductCardProps) => {
  const firstImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const theme = useTheme();
  const styles = getStyles(theme);

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
              {product.material} • €{Number(product.price).toFixed(2)}
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
              textStyle={[
                styles.chipText,
                product.status === 'active' 
                  ? { color: theme.dark ? '#FFFFFF' : '#2E7D32' }
                  : { color: theme.dark ? '#FFFFFF' : '#C62828' }
              ]}
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
          {onGenerateLabel && (
            <IconButton
              icon="qrcode"
              size={18}
              onPress={() => onGenerateLabel(product)}
              iconColor={theme.colors.primary}
            />
          )}
          <IconButton
            icon={product.status === 'active' ? 'eye-off' : 'eye'}
            size={18}
            onPress={() => onToggleStatus(product.id)}
          />
          <IconButton
            icon="delete"
            size={18}
            iconColor={theme.colors.error}
            onPress={() => onDelete(product.id, product.name)}
          />
        </View>
      </Card.Content>
    </Card>
  );
};
