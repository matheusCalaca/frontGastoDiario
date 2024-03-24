import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import axios from 'axios';
import StorageUtil from '../util/StorageUtil';

const ResumoGastoComponent = () => {
    const [resumo, setResumo] = useState(null);
    const [accessToken, setAccessToken] = useState(null); // Estado para armazenar o accessToken

    useEffect(() => {
        retriveToken();
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchResumo();
        }
    }, [accessToken]);

    const retriveToken = async () => {
        const token = await StorageUtil.retrieveItem("accessToken");
        setAccessToken(token);
    };

    const fetchResumo = async () => {
        try {
            const response = await axios.get('http://192.168.5.241:8080/resumo/3/3/2024', {
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

    return (
        <View style={styles.container}>
            <PieChart
                data={chartData}
                width={200}
                height={200}
                chartConfig={{
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientTo: '#08130D',
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="value"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute // Para exibir valores absolutos ao lado das porcentagens no gráfico de pizza
            />
            <View style={styles.saldoContainer}>
                <Text style={[styles.saldoText, { color: saldo > 0 ? 'green' : 'red' }]}>
                    Saldo: {saldo} {/* Assumindo que o valor é um BigDecimal */}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    saldoContainer: {
        marginTop: 20,
    },
    saldoText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ResumoGastoComponent;
