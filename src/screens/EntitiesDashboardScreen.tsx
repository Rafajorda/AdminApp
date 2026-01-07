import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EntitiesDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de entidades</Text>
      <Text>Categorías, colores y otras entidades no producto.</Text>
      {/* Aquí se pueden añadir enlaces o componentes para gestionar cada entidad */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default EntitiesDashboardScreen;
