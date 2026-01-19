/**
 * Componente LoginForm
 * 
 * Formulario de login con campos de email y contraseña
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { colors } from '../../theme';

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  emailError: string | null;
  isLoading: boolean;
  isFormValid: boolean | string;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onTogglePassword: () => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({
  email,
  password,
  showPassword,
  emailError,
  isLoading,
  isFormValid,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) => {
  return (
    <View style={styles.form}>
      {/* Campo Email */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={onEmailChange}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={!!emailError}
        left={<TextInput.Icon icon="email" />}
        style={styles.input}
      />
      <HelperText type="error" visible={!!emailError}>
        {emailError}
      </HelperText>

      {/* Campo Contraseña */}
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={onPasswordChange}
        mode="outlined"
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoComplete="password"
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={onTogglePassword}
          />
        }
        style={styles.input}
      />

      {/* Olvidé mi contraseña */}
      <Button
        mode="text"
        onPress={onForgotPassword}
        style={styles.forgotButton}
        labelStyle={styles.forgotButtonLabel}
      >
        ¿Olvidaste tu contraseña?
      </Button>

      {/* Botón de Login */}
      <Button
        mode="contained"
        onPress={onSubmit}
        loading={isLoading}
        disabled={isLoading || !isFormValid}
        style={styles.loginButton}
        contentStyle={styles.loginButtonContent}
        labelStyle={styles.loginButtonLabel}
      >
        Iniciar Sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    marginBottom: 4,
    backgroundColor: colors.light.surface,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotButtonLabel: {
    color: colors.light.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: colors.light.primary,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
