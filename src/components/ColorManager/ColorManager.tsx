import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button, TextInput, Card, IconButton, Portal, Dialog } from 'react-native-paper';
import { Color, CreateColorDto } from '../../types/color';
import { getColors, createColor, updateColor, deleteColor } from '../../services/colorService';
import { styles } from './ColorManager.styles';

export const ColorManager = () => {
  const [colorList, setColorList] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateColorDto>({ name: '', hexCode: '' });
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      setLoading(true);
      const data = await getColors();
      setColorList(data);
    } catch (error) {
      console.error('Error loading colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    try {
      setLoading(true);
      const dataToSend: CreateColorDto = {
        name: formData.name,
        ...(formData.hexCode && { hexCode: formData.hexCode }),
      };
      
      if (isEditing && editingId) {
        await updateColor(editingId, dataToSend);
      } else {
        await createColor(dataToSend);
      }
      setFormData({ name: '', hexCode: '' });
      setIsEditing(false);
      setEditingId(null);
      await loadColors();
    } catch (error) {
      console.error('Error saving color:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (color: Color) => {
    setFormData({ name: color.name, hexCode: color.hexCode || '' });
    setIsEditing(true);
    setEditingId(color.id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', hexCode: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const confirmDelete = (id: string) => {
    setColorToDelete(id);
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    if (!colorToDelete) return;

    try {
      setLoading(true);
      await deleteColor(colorToDelete);
      await loadColors();
    } catch (error) {
      console.error('Error deleting color:', error);
    } finally {
      setLoading(false);
      setDeleteDialogVisible(false);
      setColorToDelete(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>Colores</Text>

      {/* Formulario */}
      <View style={styles.form}>
        <TextInput
          label="Nombre del color"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Código hexadecimal (opcional)"
          value={formData.hexCode}
          onChangeText={(text) => setFormData({ ...formData, hexCode: text })}
          mode="outlined"
          placeholder="#FF0000"
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
        data={colorList}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemContent}>
              <View style={styles.itemInfo}>
                <View style={styles.colorRow}>
                  {item.hexCode && (
                    <View 
                      style={[styles.colorPreview, { backgroundColor: item.hexCode }]} 
                    />
                  )}
                  <Text variant="bodyMedium">{item.name}</Text>
                </View>
                {item.hexCode && (
                  <Text variant="bodySmall" style={styles.hexCode}>
                    {item.hexCode}
                  </Text>
                )}
              </View>
              <View style={styles.itemActions}>
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
        onRefresh={loadColors}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay colores</Text>
        }
      />

      {/* Dialog de confirmación */}
      <Portal>
        <Dialog visible={deleteDialogVisible} onDismiss={() => setDeleteDialogVisible(false)}>
          <Dialog.Title>Confirmar eliminación</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de eliminar este color?</Text>
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
