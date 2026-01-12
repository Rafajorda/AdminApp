import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { UserManager } from '../components/UserManager';
import { colors } from '../theme';

const UsersDashboardScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.push('/dashboard')} />
        <Appbar.Content title="Gestión de Usuarios" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <UserManager />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default UsersDashboardScreen;
