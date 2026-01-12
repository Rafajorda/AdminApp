import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '../theme';
import { useLoginForm } from '../hooks/useLoginForm';
import { LoginHeader, LoginForm } from '../components/login';

/**
 * Pantalla de Login para administradores
 *
 * Características:
 * - Formulario con email y contraseña
 * - Validación básica de campos
 * - Diseño responsive con teclado
 * - Opción de "Olvidé mi contraseña"
 * - Estilo coherente con el tema de la app
 * 
 * Toda la lógica del formulario está encapsulada en useLoginForm
 */
export const LoginScreen = () => {
  const {
    email,
    password,
    showPassword,
    emailError,
    isLoading,
    isFormValid,
    setEmail,
    setPassword,
    setShowPassword,
    handleLogin,
    handleForgotPassword,
  } = useLoginForm();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <LoginHeader />
        
        <LoginForm
          email={email}
          password={password}
          showPassword={showPassword}
          emailError={emailError}
          isLoading={isLoading}
          isFormValid={isFormValid}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
});
