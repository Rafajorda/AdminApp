import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  orderId: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  date: {
    color: colors.light.textSecondary,
    fontSize: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  total: {
    fontWeight: 'bold',
    color: colors.light.primary,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 12,
  },
  productsSection: {
    marginBottom: 8,
  },
  productsTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  productsList: {
    marginTop: 4,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  productName: {
    flex: 1,
    color: colors.light.text,
  },
  productQuantity: {
    color: colors.light.textSecondary,
    marginLeft: 8,
  },
  productsPreview: {
    color: colors.light.textSecondary,
    fontStyle: 'italic',
  },
  expandButton: {
    margin: 0,
    alignSelf: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
});
