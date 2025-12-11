import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { colors } from '../theme';
import * as authService from '../services/authService';

/**
 * Pantalla de Login para administradores
 *
 * Características:
 * - Formulario con email y contraseña
 * - Validación básica de campos
 * - Diseño responsive con teclado
 * - Opción de "Olvidé mi contraseña"
 * - Estilo coherente con el tema de la app
 */
export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Valida el formato del email
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Maneja el cambio de email con validación
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
   * Preparado para conectar con el backend
   */
  const handleLogin = async () => {
    // Validar campos
    if (!email || !password) {
      if (!email) setEmailError('El email es requerido');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    setIsLoading(true);

    try {
      //  Descomentar para conectar con el backend
      // const response = await authService.login({ email, password });
      // 
      // if (response.success && response.token) {
      //   // Guardar token en AsyncStorage
      //   // await AsyncStorage.setItem('token', response.token);
      //   // Navegar a Dashboard
      //   console.log('Login exitoso:', response.user);
      // } else {
      //   Alert.alert('Error', response.message || 'Credenciales inválidas');
      // }

      // Simulación
      console.log('===== LOGIN ATTEMPT =====');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('=========================');
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simular respuesta exitosa
      console.log('✅ Login simulado exitoso');
      Alert.alert('Login Exitoso', `Bienvenido ${email}`);
      
    } catch (error) {
      console.error('❌ Error en login:', error);
      Alert.alert(
        'Error de conexión',
        'No se pudo conectar con el servidor. Por favor, intenta de nuevo.'
      );
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

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }

    try {
      //  Descomentar para conectar con el backend)
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header con logo/título */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>🛍️</Text>
          </View>
          <Text variant="headlineLarge" style={styles.title}>
            Admin Panel
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Inicia sesión para continuar
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Campo Email */}
          <TextInput
            label="Email"
            value={email}
            onChangeText={handleEmailChange}
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
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
          />

          {/* Olvidé mi contraseña */}
          <Button
            mode="text"
            onPress={handleForgotPassword}
            style={styles.forgotButton}
            labelStyle={styles.forgotButtonLabel}
          >
            ¿Olvidaste tu contraseña?
          </Button>

          {/* Botón de Login */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading || !email || !password || !!emailError}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
            labelStyle={styles.loginButtonLabel}
          >
            Iniciar Sesión
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.light.textSecondary,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 4,
    backgroundColor: colors.light.surface,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotButtonLabel: {
    color: colors.light.primary,
    fontSize: 14,
  },
  loginButton: {
    marginTop: 8,
    backgroundColor: colors.light.primary,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: colors.light.textSecondary,
  },
});
