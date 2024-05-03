import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import StorageUtil from '../util/StorageUtil';
import AuthContext from '../util/AuthContext'; // Importando o contexto de autenticação

const LoginScreen = ({ navigation }) => {
    const { setToken } = useContext(AuthContext);
    // const { setUserInfo } = useContext(UserInfoContext);

    const [username, setUsername] = useState('matheusfcalaca@gmail.com');
    const [password, setPassword] = useState('123');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://192.168.5.241:8080/login', {
                username: username,
                password: password
            });
            const accessToken = response.data.accessToken;

            // Salvar o token de acesso no contexto de autenticação
            await userInfo(accessToken)
        } catch (error) {
            Alert.alert('Erro', `Usuário ou senha inválidos. ${error}`);
        }
    };

    const userInfo = async (jwt) => {

        if (jwt) {
            const response = await axios.post('http://192.168.5.241:8080/user/info', {
                jwt: jwt
            }, {
                headers: {
                    Authorization: `Bearer ${jwt}` // Adiciona o token ao cabeçalho Authorization
                }
            });

            console.log(response.data);
            if (response) {
                const userInfo = {
                    id: response.data.id,
                    cpf: response.data.cpf,
                    nome: response.data.nome,
                    email: response.data.email
                };

                console.log("userInfo");
                console.log(userInfo);

                // setUserInfo(userInfo);
                setToken(jwt);

                StorageUtil.storeItem("userInfo", userInfo)
                StorageUtil.storeItem("accessToken", jwt);

            }
        }

    }

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
