import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import StorageUtil from '../util/StorageUtil';



const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.5.241:8080/login', {
                username: username,
                password: password
            });
            const accessToken = response.data.accessToken;
            // Salvar o token de acesso em AsyncStorage ou Context API para uso posterior
            // Navegar para a próxima tela após o login bem-sucedido
            StorageUtil.storeItem("accessToken", accessToken)
            navigation.navigate('Gastos');
        } catch (error) {
            Alert.alert('Erro', 'Usuário ou senha inválidos.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome de usuário"
                value={username}
                autoComplete='email'
                inputMode='email'
                onChangeText={text => setUsername(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <Button
                title="Entrar"
                color="#007bff"
                onPress={handleLogin}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        marginBottom: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        fontSize: 16,
    },
});

export default LoginScreen;
