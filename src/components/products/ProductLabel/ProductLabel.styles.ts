import { StyleSheet } from 'react-native';
import { colors } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  surface: {
    width: '95%',
    maxWidth: 600,
    maxHeight: '90%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.light.surface,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
