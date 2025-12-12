/**
 * Hook personalizado para el formulario de login
 * 
 * Encapsula toda la lógica del formulario:
 * - Estado de los campos
 * - Validación
 * - Manejo de errores
 * - Proceso de login
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, getEmailError } from '../utils/validations';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  /**
   * Maneja el cambio de email con validación en tiempo real
   */
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  };

  /**
   * Maneja el proceso de login
   */
  const handleLogin = async () => {
    // Validar campos
    const emailErr = getEmailError(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    if (!password) {
      Alert.alert('Error', 'La contraseña es requerida');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      console.log('✅ Login exitoso, redirigiendo a dashboard...');
      router.replace('/dashboard');
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      
      let errorMessage = 'No se pudo conectar con el servidor. Por favor, intenta de nuevo.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error de Login', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja la recuperación de contraseña
   */
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Email requerido', 'Por favor ingresa tu email primero');
      return;
    }

    const emailErr = getEmailError(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    try {
      // TODO: Descomentar para conectar con el backend
      // await authService.forgotPassword(email);
      // Alert.alert('Email enviado', 'Revisa tu correo para restablecer tu contraseña');

      // Simulación
      console.log('===== FORGOT PASSWORD =====');
      console.log('Email:', email);
      console.log('===========================');
      Alert.alert('Email enviado', 'Revisa tu correo para restablecer tu contraseña (simulado)');
    } catch (error) {
      console.error('Error en recuperación de contraseña:', error);
      Alert.alert('Error', 'No se pudo procesar tu solicitud');
    }
  };

  /**
   * Indica si el formulario es válido
   */
  const isFormValid = email && password && !emailError;

  return {
    // Estado
    email,
    password,
    showPassword,
    emailError,
    isLoading,
    isFormValid,
    
    // Acciones
    setEmail: handleEmailChange,
    setPassword,
    setShowPassword,
    handleLogin,
    handleForgotPassword,
  };
};
