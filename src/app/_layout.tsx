import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { lightTheme } from '../theme';
import { UserRole } from '../services/authService';

/**
 * Componente interno que maneja la navegación protegida
 */
function RootLayoutNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado pero NO es ADMIN
    if (isAuthenticated && user && user.role !== UserRole.ADMIN) {
      console.log('[Guard] Usuario no es ADMIN, cerrando sesión automáticamente');
      logout();
      router.replace('/');
    }
  }, [isAuthenticated, user]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}

/**
 * Layout principal de la aplicación
 * Configura los providers globales y el Stack Navigator
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider theme={lightTheme}>
        <RootLayoutNav />
      </PaperProvider>
    </AuthProvider>
  );
}
