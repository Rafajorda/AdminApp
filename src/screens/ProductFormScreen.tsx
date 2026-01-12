/**
 * Formulario de producto (crear/editar)
 * 
 * Componente reutilizable para crear o editar productos
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Button,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useProductForm } from '../hooks/useProductForm';
import { colors } from '../theme';
import {
  ProductBasicFields,
  ProductCategorySelector,
  ProductColorSelector,
} from '../components/products';

interface ProductFormScreenProps {
  productId?: string;
}

export default function ProductFormScreen({ productId }: ProductFormScreenProps) {
  const router = useRouter();
  const {
    formData,
    categories,
    colors: colorsList,
    isLoadingOptions,
    isLoadingProduct,
    isSubmitting,
    fieldErrors,
    error,
    isEditMode,
    updateField,
    handleCategoryToggle,
    handleColorToggle,
    handleSubmit: submitForm,
  } = useProductForm({ productId });

  const handleSubmit = async () => {
    await submitForm();
  };

  const isLoading = isLoadingOptions || isLoadingProduct;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.light.primary} />
        <Text variant="bodyLarge" style={styles.loadingText}>
          Cargando producto...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ProductBasicFields
          formData={formData}
          fieldErrors={fieldErrors}
          onFieldChange={updateField}
        />

        <ProductCategorySelector
          categories={categories}
          selectedIds={formData.categoryIds}
          error={fieldErrors.categoryIds}
          onToggle={handleCategoryToggle}
        />

        <ProductColorSelector
          colors={colorsList}
          selectedIds={formData.colorIds}
          error={fieldErrors.colorIds}
          onToggle={handleColorToggle}
        />

        {/* Mensaje de error general */}
        {error && (
          <Text variant="bodyMedium" style={styles.errorText}>
            {error}
          </Text>
        )}

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            disabled={isSubmitting}
            style={styles.button}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
          >
            {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.light.background,
  },
  loadingText: {
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    color: colors.light.error,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
});
