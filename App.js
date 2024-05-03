import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import GastosScreen from './screens/GastosScreen';
import CriarGastoScreen from './screens/CriarGastoScreen';
import LoginScreen from './screens/LoginScreen';
import StorageUtil from './util/StorageUtil';
import AuthContext from './util/AuthContext'; // Importando o contexto de autenticação
import GanhoScreen from './screens/GanhoScreen';
import CriarGanhoScreen from './screens/CriarGanhoScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


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
      await StorageUtil.clearItem("userInfo");
      // Limpar o estado do token
      setUserToken(null)
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Erro ao fazer logout.');
    }
  };

  const header = (title, isLogged) => {
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

        {userToken ? (
          <NavigationContainer>
            <Drawer.Navigator>
              <>
                <Drawer.Screen name="Gastos" component={GastosScreen} options={({ route }) => header("Gastos", !!route.params?.userToken)} />
                <Drawer.Screen name="CriarGasto" component={CriarGastoScreen} options={({ route }) => header("Criar Gasto", !!route.params?.userToken)} />
                <Drawer.Screen name="Ganhos" component={GanhoScreen} options={({ route }) => header("Ganhos", !!route.params?.userToken)} />
                <Drawer.Screen name="CriarGanho" component={CriarGanhoScreen} options={({ route }) => header("Criar Ganho", !!route.params?.userToken)} />
              </>
            </Drawer.Navigator>
          </NavigationContainer>
        ) : (
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        )
        }

    </AuthContext.Provider >
  );
}


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
