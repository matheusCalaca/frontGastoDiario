import React, { createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GastosScreen from './screens/GastosScreen';
import CriarGastoScreen from './screens/CriarGastoScreen';
import LoginScreen from './screens/LoginScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import StorageUtil from './util/StorageUtil';

const Stack = createStackNavigator();

// Criar um contexto de autenticação
export const AuthContext = createContext();

export default function App() {
  const [userToken, setUserToken] = useState(null);


  // Função para definir o token do usuário após o login
  const setToken = token => {
    setUserToken(token);
  };

  const handleLogout = async () => {
    try {
      // Remover o token de acesso
      await StorageUtil.clearItem("accessToken");
      // Limpar o estado do token
      setUserToken(null)
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao fazer logout.');
    }
  };



  const header = (title) => {
    return {
      title: title,
      headerStyle: {
        backgroundColor: '#28023d',
      },
      headerRight: () => (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.buttonContainer}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </View>
        </TouchableOpacity>
      ),
      headerTintColor: '#ffa804',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  }


  return (
    <AuthContext.Provider value={{ userToken, setToken }}>
      <NavigationContainer>
        <Stack.Navigator>
          {userToken ? (
            <>
              <Stack.Screen name="Gastos" component={GastosScreen} options={header("Gastos")} />
              <Stack.Screen name="CriarGasto" component={CriarGastoScreen} options={header("Criar Gasto")} />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};


const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 10,
  },
  buttonContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#dc3545',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});