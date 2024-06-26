import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { TextInputMask } from 'react-native-masked-text';
import { convertDateBR } from '../util/utils';
import StorageUtil from '../util/StorageUtil';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const CriarGastoScreen = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [data, setData] = useState(new Date());
    const [categoriaId, setCategoriaId] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [showData, setShowData] = useState(false);
    const [showScreen, setShowScreen] = useState(false);
    const [userInfo, setuserInfo] = useState(null);
    const [accessToken, setAccessToken] = useState(null); // Estado para armazenar o accessToken

    useEffect(() => {
        retrivetoken();
        retriveUserInfo();
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchCategorias();
            setShowScreen(true);
            console.log("token recuperado");
        }
    }, [accessToken, userInfo, showScreen]);

    const retrivetoken = async () => {
        const token = await StorageUtil.retrieveItem("accessToken");
        console.log(token);
        setAccessToken(token);
    }

    const retriveUserInfo = async () => {
        const userInfo = await StorageUtil.retrieveItem("userInfo");
        console.log(userInfo);
        setuserInfo(userInfo);
    };

    // Função para buscar categorias do backend
    const fetchCategorias = async () => {
        try {
            const response = await axios.get(`${apiUrl}/categoria/GASTO`, {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Adiciona o token ao cabeçalho Authorization
                }
            });
            setCategorias(response.data);
        } catch (error) {
            console.error('Erro ao obter categorias:', error.message);
        }
    };


    const criarGasto = async () => {
        try {
            const gastoDto = {
                userId: userId,
                nome: nome,
                valor: parseFloat(valor), // Converta o valor para um número
                data: convertDate(data),
                categoriaId: categoriaId
            }
            console.log("tentativa de criação " + gastoDto.nome + " " + gastoDto.valor + " " + gastoDto.data + " " + gastoDto.categoriaId + " ");
            // Realize a solicitação HTTP POST para o endpoint 'gasto'
            const response = await axios.post(`${apiUrl}/gasto`, gastoDto, {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Adiciona o token ao cabeçalho Authorization
                }
            });

            // Verifique a resposta da solicitação
            if (response.status === 201) {
                // Se a solicitação for bem-sucedida, faça alguma ação, como limpar os campos de entrada
                setUserId(userId);
                setNome('');
                setValor('');
                setData(new Date());
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
        setShowData(true);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowData(false);
        setData(currentDate);
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
            <TouchableOpacity onPressIn={showDatepicker} style={styles.dateInputContainer}>
                <TextInput
                    style={styles.dateInput}
                    placeholder="Data da compra (AAAA-MM-DD)"
                    value={convertDateBR(data)}
                    editable={false}
                />
                <FontAwesomeIcon icon={faCalendar} style={styles.icon} />
            </TouchableOpacity>
            {showData && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={data}
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
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 14,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
    },
    dateInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 14,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    dateInput: {
        flex: 1,
        fontSize: 16,
    },
    icon: {
        marginRight: 10,
        fontSize: 20,
        color: '#888',
    },
});

export default CriarGastoScreen;
