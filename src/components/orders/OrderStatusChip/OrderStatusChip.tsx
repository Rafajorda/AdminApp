/**
 * Componente OrderStatusChip
 * 
 * Chip reutilizable para mostrar el estado de un pedido
 * con colores y textos consistentes según el tema
 */

import React from 'react';
import { Chip } from 'react-native-paper';
import { getOrderStatusConfig } from '../../../utils/orderStatus';
import { styles } from './OrderStatusChip.styles';

interface OrderStatusChipProps {
  status: string;
  isDark?: boolean;
  compact?: boolean;
}

/**
 * Chip de estado de pedido
 * 
 * @param status - Estado del pedido ('pending', 'processing', 'shipped', 'completed', 'cancelled')
 * @param isDark - Si está en modo oscuro
 * @param compact - Si debe ser compacto (menor altura)
 */
export const OrderStatusChip = ({ status, isDark = false, compact = true }: OrderStatusChipProps) => {
  const config = getOrderStatusConfig(status, isDark);

  return (
    <Chip
      mode="flat"
      compact={compact}
      style={[
        styles.chip,
        { backgroundColor: config.backgroundColor },
      ]}
      textStyle={[
        styles.chipText,
        { color: config.textColor },
      ]}
    >
      {config.text}
    </Chip>
  );
};
