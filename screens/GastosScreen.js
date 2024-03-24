import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import StorageUtil from '../util/StorageUtil';
import GastosList from '../components/GastosList'
import AddGastoButton from '../components/AddGastoButton'
import MonthYearSelector from '../components/MonthYearSelector';

const GastosScreen = ({ navigation }) => {
    const [gastos, setGastos] = useState([]);
    const [accessToken, setAccessToken] = useState(null); // Estado para armazenar o accessToken
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


    useEffect(() => {
        retriveToken();
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchGastos();
        }
    }, [accessToken, selectedMonth, selectedYear]);

    const retriveToken = async () => {
        const token = await StorageUtil.retrieveItem("accessToken");
        setAccessToken(token);
    };

    const fetchGastos = async () => {
        try {
            const response = await axios.get(
                `http://192.168.5.241:8080/gasto/3/${selectedMonth}/${selectedYear}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setGastos(response.data);
        } catch (error) {
            console.error('Erro ao buscar gastos:', error);
        }
    };

    const handleMonthChange = (newMonth) => {
        setSelectedMonth(newMonth);
        fetchGastos();
    };

    const handleYearChange = (newYear) => {
        setSelectedYear(newYear);
        fetchGastos();
    };

    return (
        <View style={styles.container}>
            <MonthYearSelector
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
            />
            <Text style={styles.title}>Gastos do Usuário Calaça</Text>
            <GastosList gastos={gastos} onRefresh={fetchGastos} />
            <AddGastoButton onPress={() => navigation.navigate('CriarGasto')} />
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
});

export default GastosScreen;
