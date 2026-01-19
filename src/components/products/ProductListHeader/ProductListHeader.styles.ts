import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  searchBar: {
    backgroundColor: colors.light.surface,
    marginBottom: 12,
    elevation: 2,
  },
  count: {
    color: colors.light.textSecondary,
    textAlign: 'right',
  },
});
