import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import StorageUtil from '../util/StorageUtil';
import PersonalizationList from '../components/PersonalizationList'
import MonthYearSelector from '../components/MonthYearSelector';
import PersonalizationButton from '../components/PersonalizationButton';
import { ActivityIndicator } from 'react-native-paper';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;


const GanhoScreen = ({ navigation }) => {
    const [ganhos, setGanhos] = useState([]);
    const [accessToken, setAccessToken] = useState(null); // Estado para armazenar o accessToken
    const [userInfo, setuserInfo] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        retriveToken();
        retriveUserInfo();
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchGanhos();
        }
    }, [accessToken, selectedMonth, selectedYear, userInfo]);

    const retriveToken = async () => {
        const token = await StorageUtil.retrieveItem("accessToken");
        setAccessToken(token);
    };

    const retriveUserInfo = async () => {
        const userInfo = await StorageUtil.retrieveItem("userInfo");
        setuserInfo(userInfo);
    };

    const fetchGanhos = async () => {
        try {
            if (userInfo) {
                const response = await axios.get(
                    `${apiUrl}/ganho/${userInfo.id}/${selectedMonth}/${selectedYear}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setGanhos(response.data);
            }
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
            {userInfo ? (
                <View style={styles.container}>
                    <MonthYearSelector
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onMonthChange={handleMonthChange}
                        onYearChange={handleYearChange}
                    />

                    <Text style={styles.title}>Ganhos do Usuário Calaça</Text>
                    <PersonalizationList dataItens={ganhos} onRefresh={fetchGanhos} />
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default GanhoScreen;
