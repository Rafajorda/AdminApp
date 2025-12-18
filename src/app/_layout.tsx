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
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inLoginPage = segments[0] === 'login' || !segments[0];

    // Si no está autenticado y no está en login, redirigir a login
    if (!isAuthenticated && !inLoginPage) {
      console.log('[Guard] Not authenticated - redirecting to login');
      router.replace('/login');
      return;
    }

    // Si está autenticado pero no es ADMIN, cerrar sesión
    if (isAuthenticated && user && user.role !== UserRole.ADMIN) {
      console.log('[Guard] Usuario no es ADMIN, cerrando sesión automáticamente');
      logout();
      router.replace('/login');
      return;
    }

    // Si está autenticado y en la página de login, redirigir al dashboard
    if (isAuthenticated && inLoginPage) {
      console.log('[Guard] Already authenticated - redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, user, segments, isLoading]);

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
