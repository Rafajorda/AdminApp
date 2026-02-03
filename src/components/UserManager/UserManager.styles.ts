import { StyleSheet } from 'react-native';
import { colors } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerSection: {
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: colors.light.surface,
    marginBottom: 12,
    elevation: 2,
  },
  searchbar: {
    backgroundColor: colors.light.surface,
    marginBottom: 12,
    elevation: 2,
  },
  totalText: {
    color: colors.light.textSecondary,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    color: colors.light.textSecondary,
  },
  listContent: {
    paddingBottom: 80,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  paginationText: {
    color: colors.light.textSecondary,
  },
  pageText: {
    color: colors.light.textSecondary,
  },
  userCard: {
    marginBottom: 8,
    backgroundColor: colors.light.surface,
    elevation: 2,
  },
  itemCard: {
    marginBottom: 8,
    backgroundColor: colors.light.surface,
    elevation: 2,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    fontSize: 14,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  youBadge: {
    fontWeight: '400',
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  userEmail: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  email: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  userActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    margin: 0,
  },
  roleChip: {
    height: 24,
    marginTop: 4,
  },
  roleChipText: {
    fontSize: 11,
    lineHeight: 14,
  },
  adminChip: {
    backgroundColor: colors.light.primary,
  },
  userChip: {
    backgroundColor: '#757575',
  },
  statusChip: {
    height: 24,
    marginLeft: 4,
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeChip: {
    backgroundColor: '#4caf50',
  },
  activeBadge: {
    backgroundColor: '#4caf50',
  },
  inactiveChip: {
    backgroundColor: '#f44336',
  },
  inactiveBadge: {
    backgroundColor: '#f44336',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: colors.light.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.light.primary,
  },
});
