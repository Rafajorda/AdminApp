import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Appbar, ActivityIndicator } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { User, CreateUserDto, UpdateUserDto, UserRole } from '../types/user';
import { getUserById, createUser, updateUser } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

const UserFormScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user: currentUser } = useAuth();
  const isEditing = !!id;
  const isEditingSelf = isEditing && currentUser && parseInt(id!) === currentUser.id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [formData, setFormData] = useState<CreateUserDto | UpdateUserDto>({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    avatar: '',
    role: UserRole.USER,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && id) {
      loadUser(parseInt(id));
    }
  }, [id]);

  const loadUser = async (userId: number) => {
    try {
      setInitialLoading(true);
      const user = await getUserById(userId);
      setFormData({
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        avatar: user.avatar || '',
        role: user.role,
        password: '', // No mostrar contraseña
      });
    } catch (error) {
      console.error('Error loading user:', error);
      alert('Error al cargar el usuario');
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username?.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!isEditing && !(formData as CreateUserDto).password) {
      newErrors.password = 'La contraseña es requerida para crear un usuario';
    } else if ((formData as CreateUserDto).password && (formData as CreateUserDto).password!.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (isEditing && id) {
        const updateData: UpdateUserDto = {
          username: formData.username,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          avatar: formData.avatar,
          role: formData.role,
        };
        if ((formData as CreateUserDto).password) {
          updateData.password = (formData as CreateUserDto).password;
        }
        await updateUser(parseInt(id), updateData);
        alert('Usuario actualizado correctamente');
      } else {
        await createUser(formData as CreateUserDto);
        alert('Usuario creado correctamente');
      }
      router.back();
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(error.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Cargando..." />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={isEditing ? 'Editar Usuario' : 'Crear Usuario'} />
        <Appbar.Action 
          icon="content-save" 
          onPress={handleSubmit}
          disabled={loading}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Avatar preview */}
        {formData.avatar && (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: formData.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Campos del formulario */}
        <TextInput
          label="Nombre de usuario *"
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          mode="outlined"
          style={styles.input}
          error={!!errors.username}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}

        <TextInput
          label="Email *"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          error={!!errors.email}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}

        <TextInput
          label={isEditing ? "Contraseña (dejar vacío para no cambiar)" : "Contraseña *"}
          value={(formData as CreateUserDto).password || ''}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          error={!!errors.password}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        <TextInput
          label="Nombre"
          value={formData.firstName || ''}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Apellido"
          value={formData.lastName || ''}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Dirección"
          value={formData.address || ''}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          mode="outlined"
          multiline
          numberOfLines={2}
          style={styles.input}
        />

        <TextInput
          label="URL del Avatar"
          value={formData.avatar || ''}
          onChangeText={(text) => setFormData({ ...formData, avatar: text })}
          mode="outlined"
          autoCapitalize="none"
          style={styles.input}
          placeholder="https://ejemplo.com/avatar.jpg"
        />

        {/* Selector de rol */}
        <Text variant="titleSmall" style={styles.sectionTitle}>Rol del usuario</Text>
        {isEditingSelf && (
          <Text style={styles.warningText}>
            ℹ️ No puedes cambiar tu propio rol
          </Text>
        )}
        <SegmentedButtons
          value={formData.role || UserRole.USER}
          onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
          buttons={[
            { value: UserRole.USER, label: 'Usuario', disabled: !!isEditingSelf },
            { value: UserRole.ADMIN, label: 'Administrador', disabled: !!isEditingSelf },
          ]}
          style={styles.segmentedButtons}
        />

        {/* Botones de acción */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.cancelButton}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={loading}
            disabled={loading}
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
  },
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: colors.light.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 12,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  warningText: {
    color: colors.light.primary,
    fontSize: 12,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  segmentedButtons: {
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});

export default UserFormScreen;
