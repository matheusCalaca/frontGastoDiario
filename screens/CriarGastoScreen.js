import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { TextInputMask } from 'react-native-masked-text';
import { convertDateBR, parseDate } from '../util/utils'; 


const CriarGastoScreen = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [dataCompra, setDataCompra] = useState(new Date());
    const [categoriaId, setCategoriaId] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [showDataCompra, setShowDataCompra] = useState(false);

    // Função para buscar categorias do backend
    const fetchCategorias = async () => {
        try {
            const response = await axios.get('http://192.168.5.241:8080/categoria');
            setCategorias(response.data);
        } catch (error) {
            console.error('Erro ao obter categorias:', error.message);
        }
    };

    useEffect(() => {
        fetchCategorias(); // Chama a função de busca quando o componente é montado
    }, []); // Chama apenas uma vez, quando o componente é montado

    const criarGasto = async () => {
        try {
            const gastoDto = {
                userId: userId,
                nome: nome,
                valor: parseFloat(valor), // Converta o valor para um número
                dataCompra: convertDate(dataCompra),
                categoriaId: categoriaId
            }
            console.log("tentativa de criação " + gastoDto.nome + " " + gastoDto.valor + " " + gastoDto.dataCompra + " " + gastoDto.categoriaId + " ");
            // Realize a solicitação HTTP POST para o endpoint 'gasto'
            const response = await axios.post('http://192.168.5.241:8080/gasto', gastoDto);

            // Verifique a resposta da solicitação
            if (response.status === 201) {
                // Se a solicitação for bem-sucedida, faça alguma ação, como limpar os campos de entrada
                setUserId('');
                setNome('');
                setValor('');
                setDataCompra(new Date());
                setCategoriaId([]);
                alert('Gasto criado com sucesso!');
                navigation.navigate('Gastos');
            } else {
                // Se houver um erro na solicitação, exiba uma mensagem de erro
                alert('Erro ao criar gasto. Tente novamente mais tarde.');
            }
        } catch (error) {
            // Se houver um erro durante a solicitação, exiba uma mensagem de erro
            alert('Erro ao criar gasto: ' + error.message);
        }
    };

    const showDatepicker = () => {
        setShowDataCompra(true);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowDataCompra(false);
        setDataCompra(currentDate);
    };

    const onChangeValor = (event) => {
        setValor(formatarValorParaFloat(event))
    };

    const formatarValorParaFloat = (valorFormatado) => {
        // Remove o símbolo da moeda e substitui vírgula por ponto
        const valorSemSimbolo = valorFormatado.replace('R$', '').replace(/\./g, '').replace(',', '.');
    
        // Converte para float
        const valorFloat = parseFloat(valorSemSimbolo);
    
        return valorFloat;
    };

    const convertDate = (dataOriginal) => {

        const ano = dataOriginal.getFullYear();
        const mes = String(dataOriginal.getMonth() + 1).padStart(2, '0');
        const dia = String(dataOriginal.getDate()).padStart(2, '0');

        const dataFormatada = `${ano}-${mes}-${dia}`;

        return dataFormatada;
    }


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
            <TextInputMask
                style={styles.input}
                placeholder="Valor"
                value={valor}
                onChangeText={onChangeValor}
                type={'money'}
                options={{
                    precision: 2, // número de casas decimais
                    separator: ',', // separador decimal
                    delimiter: '.', // separador de milhares
                    unit: 'R$', // símbolo da moeda
                    suffixUnit: '', // sufixo da unidade (por exemplo, 'USD')
                }}
            />
            <TouchableOpacity onPressIn={showDatepicker}>
                <TextInput
                    style={styles.input}
                    placeholder="Data da compra (AAAA-MM-DD)"
                    value={convertDateBR(dataCompra)}
                    editable={false}
                />
                <FontAwesomeIcon icon={faCalendar} style={styles.icon} />
            </TouchableOpacity>
            {showDataCompra && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={dataCompra}
                    mode="date"
                    is24Hour={true}
                    onChange={onChangeDate}
                />
            )}
            <Picker
                selectedValue={categoriaId}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) => setCategoriaId(itemValue)}
            >
                <Picker.Item label="Selecione uma categoria" value="" />
                {categorias.map((categoria) => (
                    <Picker.Item key={categoria.id} label={categoria.categoria} value={categoria.id} />
                ))}
            </Picker>
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
    icon: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
        color: '#888', // Cor do ícone
    },
});

export default CriarGastoScreen;
