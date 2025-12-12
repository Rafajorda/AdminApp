/**
 * Servicio de autenticación
 * 
 * Maneja las peticiones de login al backend NestJS
 */

import { Platform } from 'react-native';

/**
 * Configuración de URLs del backend
 * 
 * OPCIÓN 1 - Detección automática según plataforma:
 * Web: usa localhost
 * Móvil: usa IP local de la red
 */
// const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 
//   (Platform.OS === 'web' 
//     ? 'http://localhost:3000' 
//     : 'http://10.250.79.59:3000');

/**
 * OPCIÓN 2 - Variable de entorno configurable (ACTIVA):
 * Cambia la URL en .env según donde estés:
 * - Clase (WiFi Conselleria): http://10.250.79.59:3000
 * - Casa: http://192.168.1.X:3000 (sustituir X por tu IP)
 * - Local (desarrollo web): http://localhost:3000
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'web' 
    ? 'http://localhost:3000' 
    : 'http://10.250.79.59:3000'); // Cambiar esta IP según la red

/**
 * OPCIÓN 3 - Múltiples redes con detección automática:
 * Detecta la IP del dispositivo y usa el mismo rango de red
 */
// import * as Network from 'expo-network';
// const getApiUrl = async () => {
//   const ip = await Network.getIpAddressAsync();
//   if (ip.startsWith('10.250.79')) {
//     return 'http://10.250.79.59:3000'; // Clase
//   } else if (ip.startsWith('192.168.1')) {
//     return 'http://192.168.1.100:3000'; // Casa
//   }
//   return 'http://localhost:3000'; // Fallback
// };

/**
 * OPCIÓN 4 - Pantalla de configuración en la app:
 * Permite al usuario introducir/seleccionar la URL del servidor
 * (Requiere implementar pantalla de settings y AsyncStorage)
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface User {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  status: string;
  isActive: boolean;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  access_token_expires_at: number;
  refresh_token_expires_at: number;
}

/**
 * Realiza el login llamando al backend
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('[AuthService] Intentando login...', credentials.email);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    console.log('[AuthService] Login exitoso:', data.user.email, 'Role:', data.user.role);
    
    return data;
  } catch (error) {
    console.error('[AuthService] Error en login:', error);
    throw error;
  }
};

/**
 * Recuperación de contraseña
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    throw error;
  }
};
