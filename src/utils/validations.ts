/**
 * Utilidades de validación
 * 
 * Funciones reutilizables para validar campos de formularios
 */

/**
 * Valida el formato de un email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida que una contraseña cumpla con los requisitos mínimos
 * (al menos 6 caracteres)
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Obtiene el mensaje de error para un email inválido
 */
export const getEmailError = (email: string): string => {
  if (!email) return 'El email es requerido';
  if (!validateEmail(email)) return 'Email inválido';
  return '';
};

/**
 * Obtiene el mensaje de error para una contraseña inválida
 */
export const getPasswordError = (password: string): string => {
  if (!password) return 'La contraseña es requerida';
  if (!validatePassword(password)) return 'La contraseña debe tener al menos 6 caracteres';
  return '';
};
