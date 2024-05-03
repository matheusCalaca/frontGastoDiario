import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import StorageUtil from '../util/StorageUtil';
import PersonalizationList from '../components/PersonalizationList'
import PersonalizationButton from '../components/PersonalizationButton'
import MonthYearSelector from '../components/MonthYearSelector';
import ResumoGastoComponent from '../components/ResumoGastoComponent';
import { ActivityIndicator, Card } from 'react-native-paper';

const GastosScreen = ({ navigation }) => {
    const [gastos, setGastos] = useState([]);
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
            fetchGastos();
        }
    }, [accessToken, selectedMonth, selectedYear, userInfo]);

    const retriveToken = async () => {
        const token = await StorageUtil.retrieveItem("accessToken");
        setAccessToken(token);
    };

    const retriveUserInfo = async () => {
        const userInfo = await StorageUtil.retrieveItem("userInfo");
        console.log(userInfo);
        setuserInfo(userInfo);
    };

    const fetchGastos = async () => {
        try {
            console.log("userInfo")
            console.log(userInfo)
            if (userInfo) {
                const response = await axios.get(
                    `http://192.168.5.241:8080/gasto/${userInfo.id}/${selectedMonth}/${selectedYear}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                setGastos(response.data);
            }
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
        <>
            {userInfo ? (
                <View style={styles.container}>

                    <Card title="CARD WITH DIVIDER">
                        <ResumoGastoComponent userId={userInfo.id} month={selectedMonth} year={selectedYear} />
                    </Card>
                    <MonthYearSelector
                        selectedMonth={selectedMonth}
                        selectedYear={selectedYear}
                        onMonthChange={handleMonthChange}
                        onYearChange={handleYearChange}
                    />

                    <Text style={styles.title}>Canhos {userInfo.nome} </Text>
                    <PersonalizationList dataItens={gastos} onRefresh={fetchGastos} />
                    <PersonalizationButton titulo="Add Gasto" onPress={() => navigation.navigate('CriarGasto')} />
                    {/* <PersonalizationButton titulo="GANHOS" onPress={() => navigation.navigate('Ganhos')} /> */}

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

export default GastosScreen;
