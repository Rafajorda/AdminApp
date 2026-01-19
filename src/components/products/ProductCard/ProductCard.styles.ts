import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
    backgroundColor: colors.light.surface,
    elevation: 2,
  },
  content: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: colors.light.background,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontWeight: '600',
    color: colors.light.text,
    fontSize: 14,
  },
  material: {
    color: colors.light.textSecondary,
    marginTop: 2,
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    height: 24,
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
  },
  inactiveChip: {
    backgroundColor: '#FFEBEE',
  },
  chipText: {
    fontSize: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    minHeight: 24,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  categoryChip: {
    height: 24,
    backgroundColor: colors.light.primary,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 10,
    color: colors.light.surface,
    lineHeight: 12,
  },
  colorsContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.light.primary,
    elevation: 1,
  },
  moreText: {
    fontSize: 10,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginRight: -8,
  },
});
