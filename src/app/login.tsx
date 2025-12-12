import { Redirect } from 'expo-router';
import { LoginScreen } from '../screens/LoginScreen';
import { useAuth } from '../contexts/AuthContext';

/**
 * Ruta /login
 * Si ya está autenticado, redirige al dashboard
 */
export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Redirect href="/dashboard" />;
  }

  return <LoginScreen />;
}
