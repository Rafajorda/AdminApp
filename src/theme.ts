import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

/**
 * Configuración de temas de la aplicación
 *
 * Define dos temas:
 * - **lightTheme**: Tema claro con paleta natural (verde oliva, madera, arena)
 * - **darkTheme**: Tema oscuro con tonos más profundos de la misma paleta
 *
 * Paleta de colores (tema claro):
 * - Primary: #7B8C5F (verde olivo suave)
 * - Secondary: #D9C6A5 (madera clara/beige)
 * - Surface: #FFFDF8 (blanco cálido)
 * - Background: #F5EFE6 (arena suave)
 * - OnSurface: #3E3B32 (marrón profundo para texto)
 */

/**
 * Tema claro con paleta natural inspirada en la naturaleza
 *
 * Características:
 * - Fondo arena suave que no cansa la vista
 * - Verde oliva como color principal (botones, énfasis)
 * - Madera clara para elementos secundarios
 * - Texto marrón profundo para buena legibilidad
 * - Botones y campos con bordes redondeados (12px)
 */
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#7B8C5F', // Verde oliva suave
    secondary: '#D9C6A5', // Madera clara
    surface: '#FFFDF8', // Blanco cálido
    background: '#F5EFE6', // Arena suave
    onPrimary: '#FFFFFF', // Texto sobre primary
    onSecondary: '#3E3B32', // Texto sobre secondary
    onSurface: '#3E3B32', // Marrón profundo (texto principal)
    onBackground: '#3E3B32', // Texto sobre background
    surfaceVariant: '#E8E1D6', // Variante de surface
    onSurfaceVariant: '#3E3B32', // Texto sobre surfaceVariant
    outline: '#D9C6A5', // Bordes
    elevation: {
      level0: 'transparent',
      level1: '#FFFDF8',
      level2: '#F9F7F2',
      level3: '#F5F1EC',
      level4: '#F3EFE9',
      level5: '#F0EBE5',
    },
  },
  roundness: 12, // Bordes redondeados
};

/**
 * Tema oscuro con tonos más profundos de la paleta natural
 *
 * Características:
 * - Fondo oscuro (#1E1C18) cómodo para la vista nocturna
 * - Verde oliva oscuro (#5A6B3F) para elementos primarios
 * - Madera oscura (#BFAE94) para secundarios
 * - Texto claro (#EFEDE8) para buena legibilidad
 * - Mantiene la misma estructura que el tema claro
 */
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#5A6B3F', // Verde oliva oscuro
    secondary: '#BFAE94', // Madera oscura
    surface: '#2E2B25', // Superficie oscura
    background: '#1E1C18', // Fondo oscuro
    onPrimary: '#FFFFFF', // Texto sobre primary
    onSecondary: '#1E1C18', // Texto sobre secondary
    onSurface: '#EFEDE8', // Texto claro
    onBackground: '#EFEDE8', // Texto sobre background
    surfaceVariant: '#3E3B35', // Variante de surface
    onSurfaceVariant: '#D4CFC5', // Texto sobre surfaceVariant
    outline: '#8A837A', // Bordes
    elevation: {
      level0: 'transparent',
      level1: '#2E2B25',
      level2: '#34312A',
      level3: '#3A372F',
      level4: '#3C3931',
      level5: '#403D34',
    },
  },
  roundness: 12, // Bordes redondeados
};

/**
 * Colores adicionales para componentes personalizados
 */
export const colors = {
  light: {
    primary: '#7B8C5F',
    secondary: '#D9C6A5',
    background: '#F5EFE6',
    surface: '#FFFDF8',
    text: '#3E3B32',
    textSecondary: '#6B6860',
    border: '#D9C6A5',
    error: '#BA1A1A',
    success: '#6B8C5F',
    warning: '#D9A05F',
    // Colores de estados de pedidos
    orderStatus: {
      pending: {
        background: '#FFF3E0',
        text: '#E65100',
      },
      processing: {
        background: '#E3F2FD',
        text: '#1565C0',
      },
      shipped: {
        background: '#F3E5F5',
        text: '#6A1B9A',
      },
      completed: {
        background: '#E8F5E9',
        text: '#2E7D32',
      },
      cancelled: {
        background: '#FFEBEE',
        text: '#C62828',
      },
    },
  },
  dark: {
    primary: '#5A6B3F',
    secondary: '#BFAE94',
    background: '#1E1C18',
    surface: '#2E2B25',
    text: '#EFEDE8',
    textSecondary: '#C4BFB5',
    border: '#8A837A',
    error: '#FFB4AB',
    success: '#8AAF7F',
    warning: '#FFB871',
    // Colores de estados de pedidos (modo oscuro)
    orderStatus: {
      pending: {
        background: '#4A3000',
        text: '#FFB871',
      },
      processing: {
        background: '#003B5C',
        text: '#90CAF9',
      },
      shipped: {
        background: '#4A1458',
        text: '#CE93D8',
      },
      completed: {
        background: '#1B5E20',
        text: '#A5D6A7',
      },
      cancelled: {
        background: '#5F1010',
        text: '#FFB4AB',
      },
    },
  },
};
