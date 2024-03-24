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
        <>
            <View style={styles.saldoContainer}>
                <Text style={[styles.saldoText, { color: saldo > 0 ? '#00ff51' : 'red' }]}>
                    Saldo: R$ {resumo.saldo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </Text>
                <Text style={[styles.saldoTextSub, { color: '#00ff51' }]}>
                    ganhos: {ganhos}
                </Text>
                <Text style={[styles.saldoTextSub, { color: '#db3e32' }]}>
                    gastos: {gastos}
                </Text>
            </View>
            <View style={styles.container}>

                <View style={styles.chartContainer}>
                    <AnimatedPieChart
                        data={chartData}
                        height={80}
                        width={chartWidth}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        }}
                        accessor="value"
                        backgroundColor="transparent"
                        paddingLeft={"5"}
                        absolute
                        progress={interpolatedValue}

                    />

                </View>


            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        height: 200,
        flexDirection: 'row', // Define a direção dos elementos como linha
    },
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
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5,
    },
    saldoTextSub: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 5,
    }
});

export default ResumoGastoComponent;
