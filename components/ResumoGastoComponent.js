import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { PieChart, StackedBarChart } from 'react-native-chart-kit';
import axios from 'axios';
import StorageUtil from '../util/StorageUtil';

const AnimatedPieChart = Animated.createAnimatedComponent(PieChart);


const ResumoGastoComponent = ({ userId, month, year }) => {
    const [resumo, setResumo] = useState(null);
    const [accessToken, setAccessToken] = useState(null); // Estado para armazenar o accessToken
    const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));

    const interpolatedValue = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });


    useEffect(() => {
        retriveToken();
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchResumo();
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }).start();
        }
    }, [accessToken, userId, month, year]);

    const retriveToken = async () => {
        const token = await StorageUtil.retrieveItem("accessToken");
        setAccessToken(token);
    };

    const fetchResumo = async () => {
        try {
            const response = await axios.get(`http://192.168.5.241:8080/resumo/${userId}/${month}/${year}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setResumo(response.data);
        } catch (error) {
            console.error('Erro ao buscar resumo:', error);
        }
    };

    if (!resumo) {
        return <Text>Carregando...</Text>;
    }

    const { gastos, ganhos, saldo } = resumo;

    const chartData = [
        {
            name: 'Gastos',
            value: gastos, // Assumindo que o valor é um BigDecimal
            color: 'red',
        },
        {
            name: 'Ganhos',
            value: ganhos, // Assumindo que o valor é um BigDecimal
            color: 'green',
        },
    ];

    const screenWidth = Dimensions.get('window').width;
    const chartWidth = screenWidth * 0.5; // 50% da largura da tela

    return (
        < >
            <Text style={[styles.saldoText, { color: saldo > 0 ? '#00CC00' : 'red' }]}>
                Saldo: R$ {resumo.saldo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </Text>
            <Text style={[styles.saldoTextSub, { color: '#00CC00' }]}>
                ganhos:R$ {ganhos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </Text>
            <Text style={[styles.saldoTextSub, { color: '#db3e32', marginBottom: 10 }]}>
                gastos: R$ {gastos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </Text>
        </>
    );
};

const styles = StyleSheet.create({
    saldoContainer: {
        flex: 1,
        flexDirection: 'row',
        width: 100,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    chartContainer: {
    },
    saldoText: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5,
    },
    saldoTextSub: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default ResumoGastoComponent;
