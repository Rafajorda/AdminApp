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
  TextInput,
  Button,
  HelperText,
  Chip,
  ActivityIndicator,
  Text,
  Divider,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useProductForm } from '../hooks/useProductForm';
import { colors } from '../theme';

interface ProductFormScreenProps {
  productId?: string;
}

export default function ProductFormScreen({ productId }: ProductFormScreenProps) {
  const router = useRouter();
  const {
    formData,
    categories,
    colors,
    isLoadingOptions,
    isLoadingProduct,
    isSubmitting,
    error,
    fieldErrors,
    isEditMode,
    handleSubmit,
    handleCategoryToggle,
    handleColorToggle,
    updateField,
  } = useProductForm({ productId });

  if (isLoadingOptions || isLoadingProduct) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          {isLoadingProduct ? 'Cargando producto...' : 'Cargando opciones...'}
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
        {/* Información básica */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Información Básica
        </Text>

        <TextInput
          label="Nombre del producto *"
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
          mode="outlined"
          error={!!fieldErrors.name}
          style={styles.input}
        />
        <HelperText type="error" visible={!!fieldErrors.name}>
          {fieldErrors.name}
        </HelperText>

        <TextInput
          label="Descripción *"
          value={formData.description}
          onChangeText={(text) => updateField('description', text)}
          mode="outlined"
          multiline
          numberOfLines={4}
          error={!!fieldErrors.description}
          style={styles.input}
        />
        <HelperText type="error" visible={!!fieldErrors.description}>
          {fieldErrors.description}
        </HelperText>

        <TextInput
          label="Material *"
          value={formData.material}
          onChangeText={(text) => updateField('material', text)}
          mode="outlined"
          error={!!fieldErrors.material}
          style={styles.input}
        />
        <HelperText type="error" visible={!!fieldErrors.material}>
          {fieldErrors.material}
        </HelperText>

        <TextInput
          label="Precio *"
          value={formData.price ? formData.price.toString() : ''}
          onChangeText={(text) => {
            const price = parseFloat(text) || 0;
            updateField('price', price);
          }}
          mode="outlined"
          keyboardType="decimal-pad"
          error={!!fieldErrors.price}
          style={styles.input}
          left={<TextInput.Icon icon="currency-usd" />}
        />
        <HelperText type="error" visible={!!fieldErrors.price}>
          {fieldErrors.price}
        </HelperText>

        <TextInput
          label="Dimensiones (opcional)"
          value={formData.dimensions || ''}
          onChangeText={(text) => updateField('dimensions', text)}
          mode="outlined"
          style={styles.input}
          placeholder="Ej: 120x80x75 cm"
        />

        <Divider style={styles.divider} />

        {/* Categorías */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Categorías *
        </Text>

        <View style={styles.chipContainer}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              selected={formData.categoryIds.includes(category.id)}
              onPress={() => handleCategoryToggle(category.id)}
              style={[
                styles.chip,
                formData.categoryIds.includes(category.id) && styles.chipSelected,
              ]}
              textStyle={formData.categoryIds.includes(category.id) && styles.chipSelectedText}
              mode="outlined"
            >
              {category.name}
            </Chip>
          ))}
        </View>
        <HelperText type="error" visible={!!fieldErrors.categoryIds}>
          {fieldErrors.categoryIds}
        </HelperText>

        <Divider style={styles.divider} />

        {/* Colores */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Colores *
        </Text>

        <View style={styles.chipContainer}>
          {colors.map((color) => (
            <Chip
              key={color.id}
              selected={formData.colorIds.includes(color.id)}
              onPress={() => handleColorToggle(color.id)}
              style={[
                styles.chip,
                formData.colorIds.includes(color.id) && styles.chipSelected,
              ]}
              textStyle={formData.colorIds.includes(color.id) && styles.chipSelectedText}
              mode="outlined"
              avatar={
                color.hexCode ? (
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: color.hexCode },
                    ]}
                  />
                ) : undefined
              }
            >
              {color.name}
            </Chip>
          ))}
        </View>
        <HelperText type="error" visible={!!fieldErrors.colorIds}>
          {fieldErrors.colorIds}
        </HelperText>

        <Divider style={styles.divider} />

        {/* Imagen del producto */}
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Imagen del Producto (opcional)
        </Text>

        <TextInput
          label="URL de la imagen"
          value={formData.imageUrl || ''}
          onChangeText={(text) => updateField('imageUrl', text)}
          mode="outlined"
          style={styles.input}
          placeholder="https://ejemplo.com/imagen.jpg"
          keyboardType="url"
          error={!!fieldErrors.imageUrl}
        />
        <HelperText type="error" visible={!!fieldErrors.imageUrl}>
          {fieldErrors.imageUrl}
        </HelperText>

        <TextInput
          label="Descripción de la imagen"
          value={formData.imageAlt || ''}
          onChangeText={(text) => updateField('imageAlt', text)}
          mode="outlined"
          style={styles.input}
          placeholder="Ej: Silla de madera vista frontal"
          error={!!fieldErrors.imageAlt}
        />
        <HelperText type="error" visible={!!fieldErrors.imageAlt}>
          {fieldErrors.imageAlt}
        </HelperText>

        {/* Error general */}
        {error && (
          <HelperText type="error" visible style={styles.errorText}>
            {error}
          </HelperText>
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
  },
  loadingText: {
    marginTop: 12,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 4,
    backgroundColor: colors.light.surface,
  },
  divider: {
    marginVertical: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    marginBottom: 4,
  },
  chipSelected: {
    backgroundColor: colors.light.primary,
  },
  chipSelectedText: {
    color: colors.light.surface,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.light.primary,
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
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
