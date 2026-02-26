/**
 * ========================================
 * COMPONENTE: LoginHeader
 * ========================================
 * 
 * DESCRIPCIÓN:
 * Header decorativo de la pantalla de login con logo y títulos.
 * Componente puramente presentacional (no tiene lógica).
 * 
 * ELEMENTOS:
 * - Logo circular con emoji de tienda (🛍️)
 * - Título "Admin Panel"
 * - Subtítulo "Inicia sesión para continuar"
 * 
 * DISEÑO:
 * - Contenedor centrado
 * - Logo circular de 100x100 con fondo color primario
 * - Tipografía Material Design 3 (headlineLarge, bodyLarge)
 * - Colores del tema light (TODO: migrar a tema dinámico)
 * 
 * USO:
 * <LoginHeader />
 * 
 * @returns {JSX.Element} Header con logo y títulos
 */

// ===== IMPORTS DE REACT =====
import React from 'react'; // Biblioteca principal de React
// ===== IMPORTS DE REACT NATIVE =====
import { View, StyleSheet } from 'react-native'; // Componentes básicos
// ===== IMPORTS DE REACT NATIVE PAPER =====
import { Text } from 'react-native-paper'; // Texto con variantes MD3
// ===== IMPORTS DE TEMA =====
import { colors } from '../../theme'; // Colores de la aplicación (TODO: usar tema dinámico)

/**
 * Componente LoginHeader
 * 
 * Header decorativo de la pantalla de login.
 * No recibe props, es un componente estático.
 * 
 * @returns {JSX.Element} Header con logo y títulos
 */
export const LoginHeader = () => {
  return (
    // Contenedor principal centrado
    <View style={styles.header}>
      {/* ========================================
          SECCIÓN: LOGO
          Círculo con emoji de tienda
          ======================================== */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>🛍️</Text> {/* Emoji de tienda */}
      </View>
      
      {/* ========================================
          SECCIÓN: TÍTULO PRINCIPAL
          "Admin Panel" en tipografía grande
          ======================================== */}
      <Text variant="headlineLarge" style={styles.title}>
        Admin Panel
      </Text>
      
      {/* ========================================
          SECCIÓN: SUBTÍTULO
          "Inicia sesión para continuar"
          ======================================== */}
      <Text variant="bodyLarge" style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>
    </View>
  );
};

/**
 * Estilos del componente LoginHeader
 * 
 * TODO: Migrar a getStyles(theme) para soporte de tema dinámico
 */
const styles = StyleSheet.create({
  // ===== CONTENEDOR PRINCIPAL =====
  header: {
    alignItems: 'center', // Centrar todo horizontalmente
    marginBottom: 32, // Separación con el formulario
    width: '100%', // Ancho completo
    maxWidth: 400, // Máximo ancho para pantallas grandes
  },
  
  // ===== CONTENEDOR DEL LOGO =====
  logoContainer: {
    width: 100, // Ancho del círculo
    height: 100, // Alto del círculo
    borderRadius: 50, // Radio para hacerlo circular (mitad del ancho)
    backgroundColor: colors.light.primary, // Fondo color primario
    justifyContent: 'center', // Centrar verticalmente
    alignItems: 'center', // Centrar horizontalmente
    marginBottom: 24, // Separación con el título
  },
  
  // ===== EMOJI DEL LOGO =====
  logoText: {
    fontSize: 48, // Tamaño grande para el emoji
  },
  
  // ===== TÍTULO "ADMIN PANEL" =====
  title: {
    fontWeight: 'bold', // Texto en negrita
    color: colors.light.text, // Color de texto principal
    marginBottom: 8, // Separación con el subtítulo
  },
  
  // ===== SUBTÍTULO "INICIA SESIÓN..." =====
  subtitle: {
    color: colors.light.textSecondary, // Color de texto secundario (más tenue)
  },
});
