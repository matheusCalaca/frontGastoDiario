import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import StorageUtil from '../util/StorageUtil';
import GastosList from '../components/PersonalizationList'
import AddGastoButton from '../components/PersonalizationButton'
import MonthYearSelector from '../components/MonthYearSelector';

const GanhoScreen = ({ navigation }) => {
    const [ganhos, setGanhos] = useState([]);
    const [accessToken, setAccessToken] = useState(null); // Estado para armazenar o accessToken
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


    useEffect(() => {
        retriveToken();
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchGanhos();
        }
    }, [accessToken, selectedMonth, selectedYear]);

    const retriveToken = async () => {
        const token = await StorageUtil.retrieveItem("accessToken");
        setAccessToken(token);
    };

    const fetchGanhos = async () => {
        try {
            const response = await axios.get(
                `http://192.168.5.241:8080/ganho/3/${selectedMonth}/${selectedYear}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setGanhos(response.data);
        } catch (error) {
            console.error('Erro ao buscar ganhos:', error);
        }
    };

    const handleMonthChange = (newMonth) => {
        setSelectedMonth(newMonth);
        fetchGanhos();
    };

    const handleYearChange = (newYear) => {
        setSelectedYear(newYear);
        fetchGanhos();
    };

    return (
        <>
            <View style={styles.container}>
                <MonthYearSelector
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    onMonthChange={handleMonthChange}
                    onYearChange={handleYearChange}
                />

                <Text style={styles.title}>Ganhos do Usuário Calaça</Text>
                <GastosList gastos={ganhos} onRefresh={fetchGanhos} />
            </View>
        </>
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

export default GanhoScreen;
