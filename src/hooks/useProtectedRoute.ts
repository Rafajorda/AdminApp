/**
 * Hook para proteger rutas
 * Redirige al login si el usuario no está autenticado
 */

import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Usuario no autenticado intentando acceder a ruta protegida
      console.log('[useProtectedRoute] Redirecting to login - not authenticated');
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Usuario autenticado en página de login, redirigir al dashboard
      console.log('[useProtectedRoute] Redirecting to dashboard - already authenticated');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, segments, isLoading]);
};
