import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme';

/**
 * Pantalla de Dashboard / CRUD
 * 
 * Pantalla principal después del login
 * Muestra información del usuario admin y opciones de gestión
 */
export const DashboardScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  // Mostrar mensaje de bienvenida al entrar
  useEffect(() => {
    setShowWelcome(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header con info del usuario */}
      <Card style={styles.userCard}>
        <Card.Content style={styles.userCardContent}>
          <Avatar.Icon 
            size={64} 
            icon="account-circle" 
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text variant="headlineSmall" style={styles.welcomeText}>
              {user?.username}
            </Text>
            <Text variant="bodyMedium" style={styles.userEmail}>
              {user?.email}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Snackbar de bienvenida temporal */}
      <Snackbar
        visible={showWelcome}
        onDismiss={() => setShowWelcome(false)}
        duration={3000}
        style={styles.snackbar}
      >
        ✅ Sesión iniciada como administrador
      </Snackbar>

      {/* Opciones de gestión */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Panel de Administración
        </Text>

        <Card style={styles.optionCard}>
          <Card.Content>
            <Text variant="titleMedium">📦 Productos</Text>
            <Text variant="bodyMedium" style={styles.optionDescription}>
              Gestiona el catálogo de productos
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => router.push('/products')}
              style={styles.optionButton}
            >
              Ver Productos
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.optionCard}>
          <Card.Content>
            <Text variant="titleMedium">👥 Usuarios</Text>
            <Text variant="bodyMedium" style={styles.optionDescription}>
              Administra usuarios del sistema
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => console.log('Ir a usuarios')}
              style={styles.optionButton}
            >
              Ver Usuarios
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.optionCard}>
          <Card.Content>
            <Text variant="titleMedium">📊 Pedidos</Text>
            <Text variant="bodyMedium" style={styles.optionDescription}>
              Revisa y gestiona los pedidos
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => console.log('Ir a pedidos')}
              style={styles.optionButton}
            >
              Ver Pedidos
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.optionCard}>
          <Card.Content>
            <Text variant="titleMedium">⚙️ Configuración</Text>
            <Text variant="bodyMedium" style={styles.optionDescription}>
              Ajustes de la aplicación
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => console.log('Ir a configuración')}
              style={styles.optionButton}
            >
              Configuración
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.optionCard}>
          <Card.Content>
            <Text variant="titleMedium">🏷️ Entidades</Text>
            <Text variant="bodyMedium" style={styles.optionDescription}>
              Gestiona categorías, colores y más
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => router.push('/entities-dashboard')}
              style={styles.optionButton}
            >
              Ver Entidades
            </Button>
          </Card.Actions>
        </Card>
      </View>

      {/* Botón de cerrar sesión */}
      <View style={styles.logoutSection}>
        <Button 
          mode="outlined" 
          onPress={handleLogout}
          icon="logout"
          style={styles.logoutButton}
          textColor={colors.light.error}
        >
          Cerrar Sesión
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  userCard: {
    margin: 16,
    backgroundColor: colors.light.primary,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    backgroundColor: colors.light.surface,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  welcomeText: {
    color: colors.light.surface,
    fontWeight: 'bold',
  },
  userEmail: {
    color: colors.light.surface,
    marginTop: 4,
  },
  snackbar: {
    backgroundColor: colors.light.primary,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.light.text,
    fontWeight: 'bold',
  },
  optionCard: {
    marginBottom: 12,
    backgroundColor: colors.light.surface,
  },
  optionDescription: {
    marginTop: 4,
    color: colors.light.textSecondary,
  },
  optionButton: {
    backgroundColor: colors.light.primary,
  },
  logoutSection: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    borderColor: colors.light.error,
  },
});
