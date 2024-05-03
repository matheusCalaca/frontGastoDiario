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
import { ActivityIndicator } from 'react-native-paper';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const CriarGanhoScreen = ({ navigation }) => {
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

    const retriveUserInfo = async () => {
        const userInfo = await StorageUtil.retrieveItem("userInfo");
        console.log(userInfo);
        setuserInfo(userInfo);
    };

    useEffect(() => {
        if (accessToken && userInfo) {
            fetchCategorias();
            setShowScreen(true);
            setUserId(userInfo.id)
            console.log("token recuperado");
        }
    }, [accessToken, userInfo, showScreen]);

    const retrivetoken = async () => {
        const token = await StorageUtil.retrieveItem("accessToken");
        console.log(token);
        setAccessToken(token);
    }


    // Função para buscar categorias do backend
    const fetchCategorias = async () => {
        try {
            const response = await axios.get(`${apiUrl}/categoria/GANHO`, {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Adiciona o token ao cabeçalho Authorization
                }
            });
            setCategorias(response.data);
        } catch (error) {
            console.error('Erro ao obter categorias:', error.message);
        }
    };


    const criarGanho = async () => {
        try {
            const ganhoDto = {
                userId: userId,
                nome: nome,
                valor: parseFloat(valor), // Converta o valor para um número
                data: convertDate(data),
                categoriaId: categoriaId
            }
            console.log("tentativa de criação " + ganhoDto.nome + " " + ganhoDto.valor + " " + ganhoDto.data + " " + ganhoDto.categoriaId + " ");
            // Realize a solicitação HTTP POST para o endpoint 'ganho'
            const response = await axios.post(`${apiUrl}/ganho`, ganhoDto, {
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
                alert('ganho criado com sucesso!');
                navigation.navigate('Ganhos');
            } else {
                // Se houver um erro na solicitação, exiba uma mensagem de erro
                alert('Erro ao criar ganho. Tente novamente mais tarde.');
            }
        } catch (error) {
            // Se houver um erro durante a solicitação, exiba uma mensagem de erro
            alert('Erro ao criar ganho: ' + error.message);
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
        <>
            {showScreen ? (
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do ganho"
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
                    <Button title="Criar Gasto" onPress={criarGanho} />
                </View>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                </View>
            )}
        </>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default CriarGanhoScreen;
