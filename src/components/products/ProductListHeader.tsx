/**
 * Componente ProductListHeader
 * 
 * Buscador y contador de productos
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { colors } from '../../theme';

interface ProductListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}

export const ProductListHeader = ({ 
  searchQuery, 
  onSearchChange, 
  totalCount 
}: ProductListHeaderProps) => {
  return (
    <View style={styles.header}>
      <Searchbar
        placeholder="Buscar productos..."
        value={searchQuery}
        onChangeText={onSearchChange}
        style={styles.searchBar}
      />
      <Text variant="bodyMedium" style={styles.count}>
        Total: {totalCount} producto{totalCount !== 1 ? 's' : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  searchBar: {
    backgroundColor: colors.light.surface,
    marginBottom: 12,
    elevation: 2,
  },
  count: {
    color: colors.light.textSecondary,
    textAlign: 'right',
  },
});
