import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/screens/LoginScreen';
import { lightTheme } from './src/theme';

/**
 * Componente principal de la aplicación
 *
 * Configura:
 * - PaperProvider con el tema personalizado
 * - LoginScreen como pantalla inicial
 * - SafeAreaProvider para dispositivos con notch
 */
const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={lightTheme}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={lightTheme.colors.background}
        />
        <View style={styles.container}>
          <LoginScreen />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

