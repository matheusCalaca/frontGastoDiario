import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { faCalendarAlt, faTags, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { convertDateBR, parseDate } from '../util/utils';
import StorageUtil from '../util/StorageUtil';
import { AuthContext } from '../App'; // Importando o contexto de autenticação

const GastosScreen = ({ navigation }) => {
    const { setToken } = useContext(AuthContext); // Obtendo a função setToken do contexto de autenticação

    const [gastos, setGastos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null); // Estado para armazenar o accessToken

    useEffect(() => {
        retriveToken();
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchGastos();
        }
    }, [accessToken]);

    const retriveToken = async () => {
        const token = await StorageUtil.retrieveItem("accessToken");
        setAccessToken(token);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchGastos();
        setRefreshing(false);
    };

    const fetchGastos = async () => {
        try {
            if (!accessToken) {
                retriveToken();
                return;
            }

            const response = await axios.get('http://192.168.5.241:8080/gasto/3/3/2024', {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Adiciona o token ao cabeçalho Authorization
                }
            });
            setGastos(response.data);
        } catch (error) {
            console.error('Erro ao buscar gastos:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigateToCriarGasto = () => {
        navigation.navigate('CriarGasto');
    };

    const handleLogout = async () => {
        try {
            // Remover o token de acesso
            await StorageUtil.clearItem("accessToken");
            // Limpar o estado do token
            setAccessToken(null);
            setToken(null)
            // Navegar de volta para a tela de login
            navigation.navigate('Login');
        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Erro ao fazer logout.');
        }
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
                    refreshControl={
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

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
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
    logoutButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginTop: 5,
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
