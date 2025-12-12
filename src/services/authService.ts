/**
 * Servicio de autenticación
 * 
 * Maneja las peticiones de login al backend NestJS
 */

// URL del backend - cambiar según tu configuración
// Para dispositivos móviles, usa la IP local de tu PC
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.250.79.59:3000';

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
