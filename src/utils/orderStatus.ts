/**
 * Utilidad para manejo de estados de pedidos
 * 
 * Proporciona funciones centralizadas para:
 * - Obtener textos de estados en español
 * - Obtener colores de estados desde el tema
 */

import { colors } from '../theme';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

/**
 * Configuración de estado de pedido
 */
export interface OrderStatusConfig {
  text: string;
  backgroundColor: string;
  textColor: string;
}

/**
 * Obtiene el texto en español para un estado de pedido
 */
export function getOrderStatusText(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'processing':
      return 'Procesando';
    case 'shipped':
      return 'Enviado';
    case 'completed':
      return 'Completado';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
}

/**
 * Obtiene la configuración completa de un estado
 * (colores desde el tema + texto)
 */
export function getOrderStatusConfig(status: string, isDark = false): OrderStatusConfig {
  const theme = isDark ? colors.dark : colors.light;
  const text = getOrderStatusText(status);

  switch (status) {
    case 'pending':
      return {
        text,
        backgroundColor: theme.orderStatus.pending.background,
        textColor: theme.orderStatus.pending.text,
      };
    case 'processing':
      return {
        text,
        backgroundColor: theme.orderStatus.processing.background,
        textColor: theme.orderStatus.processing.text,
      };
    case 'shipped':
      return {
        text,
        backgroundColor: theme.orderStatus.shipped.background,
        textColor: theme.orderStatus.shipped.text,
      };
    case 'completed':
      return {
        text,
        backgroundColor: theme.orderStatus.completed.background,
        textColor: theme.orderStatus.completed.text,
      };
    case 'cancelled':
      return {
        text,
        backgroundColor: theme.orderStatus.cancelled.background,
        textColor: theme.orderStatus.cancelled.text,
      };
    default:
      // Estado desconocido usa colores neutros
      return {
        text: status,
        backgroundColor: '#F5F5F5',
        textColor: '#757575',
      };
  }
}

/**
 * Lista de todos los estados disponibles
 */
export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'completed',
  'cancelled',
];
