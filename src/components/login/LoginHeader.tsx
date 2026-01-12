/**
 * Componente LoginHeader
 * 
 * Header del login con logo y títulos
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../theme';

export const LoginHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🛍️</Text>
      </View>
      <Text variant="headlineLarge" style={styles.title}>
        Admin Panel
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.light.textSecondary,
  },
});
