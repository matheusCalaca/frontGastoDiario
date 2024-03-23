import React, { createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GastosScreen from './screens/GastosScreen';
import CriarGastoScreen from './screens/CriarGastoScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

// Criar um contexto de autenticação
export const AuthContext = createContext();

export default function App() {
  const [userToken, setUserToken] = useState(null);

  // Função para definir o token do usuário após o login
  const setToken = token => {
    setUserToken(token);
  };
  

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
