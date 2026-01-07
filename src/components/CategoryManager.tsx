import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, TextInput, Card, IconButton, Portal, Dialog } from 'react-native-paper';
import { Category, CreateCategoryDto } from '../types/category';
import { getCategories, createCategory, updateCategory, deleteCategory, toggleCategoryStatus } from '../services/categoryService';
import { colors } from '../theme';

export const CategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCategoryDto>({ name: '' });
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    try {
      setLoading(true);
      if (isEditing && editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }
      setFormData({ name: '' });
      setIsEditing(false);
      setEditingId(null);
      await loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({ name: category.name });
    setIsEditing(true);
    setEditingId(category.id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setLoading(true);
      await deleteCategory(categoryToDelete);
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    } finally {
      setLoading(false);
      setDeleteDialogVisible(false);
      setCategoryToDelete(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setLoading(true);
      await toggleCategoryStatus(id);
      await loadCategories();
    } catch (error) {
      console.error('Error toggling category status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>Categorías</Text>

      {/* Formulario */}
      <View style={styles.form}>
        <TextInput
          label="Nombre de categoría"
          value={formData.name}
          onChangeText={(text) => setFormData({ name: text })}
          mode="outlined"
          style={styles.input}
        />
        <View style={styles.buttonRow}>
          <Button 
            mode="contained" 
            onPress={handleSubmit}
            disabled={loading || !formData.name.trim()}
            style={styles.submitButton}
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
          {isEditing && (
            <Button 
              mode="outlined" 
              onPress={handleCancelEdit}
              style={styles.cancelButton}
            >
              Cancelar
            </Button>
          )}
        </View>
      </View>

      {/* Lista */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemContent}>
              <View style={styles.itemInfo}>
                <Text variant="bodyMedium">{item.name}</Text>
                <View style={styles.statusRow}>
                  <Text variant="bodySmall" style={[
                    styles.itemStatus,
                    item.status === 'active' ? styles.activeStatus : styles.inactiveStatus
                  ]}>
                    {item.status === 'active' ? '✓ Activo' : '✕ Inactivo'}
                  </Text>
                </View>
              </View>
              <View style={styles.itemActions}>
                <IconButton
                  icon={item.status === 'active' ? 'eye-off' : 'eye'}
                  size={18}
                  onPress={() => handleToggleStatus(item.id)}
                  style={styles.iconButton}
                  iconColor={item.status === 'active' ? colors.light.primary : colors.light.textSecondary}
                />
                <IconButton
                  icon="pencil"
                  size={18}
                  onPress={() => handleEdit(item)}
                  style={styles.iconButton}
                />
                <IconButton
                  icon="delete"
                  size={18}
                  onPress={() => confirmDelete(item.id)}
                  style={styles.iconButton}
                />
              </View>
            </View>
          </View>
        )}
        refreshing={loading}
        onRefresh={loadCategories}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay categorías</Text>
        }
      />

      {/* Dialog de confirmación */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Confirmar eliminación</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de eliminar esta categoría?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleDelete}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  submitButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flex: 1,
    marginHorizontal: 3,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  statusRow: {
    marginTop: 2,
  },
  itemStatus: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
  },
  activeStatus: {
    color: '#4caf50',
  },
  inactiveStatus: {
    color: '#f44336',
  },
  itemActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconButton: {
    margin: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: colors.light.textSecondary,
  },
});
