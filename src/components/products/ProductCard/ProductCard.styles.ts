import { StyleSheet } from 'react-native';

export const getStyles = (theme: any) => StyleSheet.create({
  card: {
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
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
    backgroundColor: theme.colors.background,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontWeight: '600',
    color: theme.colors.onBackground,
    fontSize: 14,
  },
  material: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    height: 24,
    alignItems: 'center',
  },
  activeChip: {
    backgroundColor: theme.dark ? '#1B5E20' : '#E8F5E9',
  },
  inactiveChip: {
    backgroundColor: theme.dark ? '#B71C1C' : '#FFEBEE',
  },
  chipText: {
    fontSize: 10,
    color: theme.dark ? '#FFFFFF' : undefined,
    fontWeight: '600',
    lineHeight: 14,
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
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
  },
  categoryText: {
    fontSize: 10,
    color: theme.colors.surface,
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
    borderColor: theme.colors.primary,
    elevation: 1,
  },
  moreText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginRight: -8,
  },
});
