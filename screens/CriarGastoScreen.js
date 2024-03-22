import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const CriarGastoScreen = () => {
    const [userId, setUserId] = useState('');
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [dataCompra, setDataCompra] = useState('');
    const [categoriaId, setCategoriaId] = useState('');

    const criarGasto = async () => {
        try {
            const gastoDto = {
                userId: userId,
                nome: nome,
                valor: parseFloat(valor), // Converta o valor para um número
                dataCompra: dataCompra,
                categoriaId: categoriaId
            }
            console.log("tentativa de criação " + gastoDto.nome + " " + gastoDto.valor + " " + gastoDto.dataCompra + " " + gastoDto.categoriaId + " ");
            // Realize a solicitação HTTP POST para o endpoint 'gasto'
            const response = await axios.post('http://192.168.5.241:8080/gasto', {
                userId: userId,
                nome: nome,
                valor: parseFloat(valor), // Converta o valor para um número
                dataCompra: dataCompra,
                categoriaId: categoriaId
            });

            // Verifique a resposta da solicitação
            if (response.status === 201) {
                // Se a solicitação for bem-sucedida, faça alguma ação, como limpar os campos de entrada
                setUserId('');
                setNome('');
                setValor('');
                setDataCompra('');
                setCategoriaId('');
                alert('Gasto criado com sucesso!');
            } else {
                // Se houver um erro na solicitação, exiba uma mensagem de erro
                alert('Erro ao criar gasto. Tente novamente mais tarde.');
            }
        } catch (error) {
            // Se houver um erro durante a solicitação, exiba uma mensagem de erro
            alert('Erro ao criar gasto: ' + error.message);
        }
    };


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="ID do usuário"
                value={userId}
                onChangeText={setUserId}
            />
            <TextInput
                style={styles.input}
                placeholder="Nome do gasto"
                value={nome}
                onChangeText={setNome}
            />
            <TextInput
                style={styles.input}
                placeholder="Valor"
                value={valor}
                onChangeText={setValor}
            />
            <TextInput
                style={styles.input}
                placeholder="Data da compra (AAAA-MM-DD)"
                value={dataCompra}
                onChangeText={setDataCompra}
            />
            <TextInput
                style={styles.input}
                placeholder="ID da categoria"
                value={categoriaId}
                onChangeText={setCategoriaId}
            />
            <Button title="Criar Gasto" onPress={criarGasto} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
});

export default CriarGastoScreen;
