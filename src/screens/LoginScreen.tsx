import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTheme } from 'react-native-paper';
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
  const theme = useTheme();
  const styles = getStyles(theme);
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

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
