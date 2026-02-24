/**
 * Componente OrderCard
 * 
 * Tarjeta compacta para mostrar información de pedido
 * con acciones de ver detalles y cambiar estado
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { Card, Text, IconButton, Divider, useTheme } from 'react-native-paper';
import { Order } from '../../../types/order';
import { OrderStatusChip } from '../OrderStatusChip';
import { getStyles } from './OrderCard.styles';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (id: number) => void;
  onUpdateStatus?: (id: number, status: string) => void;
  onDelete?: (id: number) => void;
}

export const OrderCard = ({ order, onViewDetails, onUpdateStatus, onDelete }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const styles = getStyles(theme);

  // Formatear fecha
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {/* Header: ID, Usuario, Total y Estado */}
        <View style={styles.header}>
          <View style={styles.info}>
            <Text variant="titleMedium" style={styles.orderId}>
              Pedido #{order.id}
            </Text>
            {order.user && (
              <Text variant="bodySmall" style={styles.email}>
                {order.user.email}
              </Text>
            )}
            <Text variant="bodySmall" style={styles.date}>
              {formatDate(order.createdAt)}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text variant="titleLarge" style={styles.total}>
              €{order.total.toFixed(2)}
            </Text>
            <OrderStatusChip status={order.status} />
          </View>
        </View>

        {/* Productos */}
        {order.orderLines && order.orderLines.length > 0 && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.productsSection}>
              <Text variant="bodyMedium" style={styles.productsTitle}>
                Productos ({order.orderLines.length})
              </Text>
              {expanded ? (
                <View style={styles.productsList}>
                  {order.orderLines.map((line) => (
                    <View key={line.id} style={styles.productItem}>
                      <Text variant="bodySmall" style={styles.productName}>
                        {line.product.name}
                      </Text>
                      <Text variant="bodySmall" style={styles.productQuantity}>
                        x{line.quantity} • €{line.price.toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text variant="bodySmall" style={styles.productsPreview}>
                  {order.orderLines.slice(0, 2).map(line => line.product.name).join(', ')}
                  {order.orderLines.length > 2 && ` +${order.orderLines.length - 2} más`}
                </Text>
              )}
              <IconButton
                icon={expanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                onPress={() => setExpanded(!expanded)}
                style={styles.expandButton}
              />
            </View>
          </>
        )}

        {/* Acciones */}
        <View style={styles.actions}>
          {onViewDetails && (
            <IconButton
              icon="eye"
              size={18}
              onPress={() => onViewDetails(order.id)}
              iconColor={theme.colors.primary}
            />
          )}
          {onUpdateStatus && order.status === 'pending' && (
            <IconButton
              icon="check-circle"
              size={18}
              onPress={() => onUpdateStatus(order.id, 'completed')}
              iconColor="#4CAF50"
            />
          )}
          {onDelete && (
            <IconButton
              icon="delete"
              size={18}
              iconColor={theme.colors.error}
              onPress={() => onDelete(order.id)}
            />
          )}
        </View>
      </Card.Content>
    </Card>
  );
};
