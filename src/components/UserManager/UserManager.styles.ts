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
  searchBar: {
    backgroundColor: colors.light.surface,
    marginBottom: 12,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  count: {
    color: colors.light.textSecondary,
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
  userCard: {
    marginBottom: 8,
    backgroundColor: colors.light.surface,
    elevation: 2,
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
  userEmail: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  userActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  roleChip: {
    height: 24,
    marginTop: 4,
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
  activeChip: {
    backgroundColor: '#4caf50',
  },
  inactiveChip: {
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
