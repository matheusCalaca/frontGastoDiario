import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GastosScreen from './screens/GastosScreen';
import CriarGastoScreen from './screens/CriarGastoScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Gastos" component={GastosScreen} options={header("Gastos")} />
        <Stack.Screen name="CriarGasto" component={CriarGastoScreen} options={header("Criar Gasto")} />
      </Stack.Navigator>

    </NavigationContainer>
  );
}


function header(title) {
  return {
    title: title,
    headerStyle: {
      backgroundColor: '#28023d',
    },
    headerTintColor: '#ffa804',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
