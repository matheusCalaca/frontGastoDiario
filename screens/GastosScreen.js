import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import { faCalendarAlt, faTags, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { convertDateBR, parseDate } from '../util/utils';


const GastosScreen = ({ navigation }) => {
    const [gastos, setGastos] = useState([]);
    const [refreshing, setRefreshing] = useState(false); // Estado para controlar se a atualização está em andamento
    const [loading, setLoading] = useState(true); // Estado para controlar se os dados estão sendo carregados

    useEffect(() => {
        fetchGastos();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true); // Inicia a animação de atualização
        await fetchGastos(); // Atualiza os gastos
        setRefreshing(false); // Encerra a animação de atualização
    };

    const fetchGastos = async () => {
        try {
            const response = await axios.get('http://192.168.5.241:8080/gasto/1/3/2024');
            setGastos(response.data);
        } catch (error) {
            console.error('Erro ao buscar gastos:', error);
        } finally {
            setLoading(false); // Marca que o carregamento dos dados foi concluído
        }
    };

    const navigateToCriarGasto = () => {
        navigation.navigate('CriarGasto');
    };

    const renderGastoItem = ({ item }) => (
        <TouchableOpacity style={styles.item}>
            <Text style={styles.itemName}>{item.nome}</Text>
            <View style={styles.itemRow}>
                <FontAwesomeIcon icon={faMoneyBill} style={styles.icon} />
                <Text style={styles.itemText}>R$ {item.valor.toFixed(2)}</Text>
            </View>
            <View style={styles.itemRow}>
                <FontAwesomeIcon icon={faCalendarAlt} style={styles.icon} />
                <Text style={styles.itemText}>
                    {convertDateBR(parseDate(item.dataCompra))}
                </Text>

            </View>
            <View style={styles.itemRow}>
                <FontAwesomeIcon icon={faTags} style={styles.icon} />
                <Text style={styles.itemText}>{item.categoria.categoria}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gastos do Usuário Calaça</Text>

            {loading ? (
                <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={gastos}
                    renderItem={renderGastoItem}
                    keyExtractor={(item, index) => index.toString()}
                    refreshControl={ // Adiciona o RefreshControl à View
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            )}

            <TouchableOpacity style={styles.addButton} onPress={navigateToCriarGasto}>
                <Text style={styles.addButtonText}>Adicionar Gasto</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    item: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
    },
    loadingIndicator: {
        marginTop: 20,
    },
    addButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemName: {
        fontSize: 20, // Ajuste o tamanho da fonte conforme necessário
        fontWeight: 'bold',
        color: '#000', // Cor preta escura
        textAlign: 'center', // Centraliza o texto horizontalmente
        marginTop: 5, // Adiciona um espaço superior para separar do texto abaixo
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    icon: {
        marginRight: 10,
        color: '#000',
    },
    itemText: {
        fontSize: 16,
        color: '#000',
    },
});

export default GastosScreen;
