import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios'; 

const GastosScreen = () => {
    const [gastos, setGastos] = useState([]);
  
    useEffect(() => {
      fetchGastos();
    }, []);
  
    const fetchGastos = async () => {
      try {
        console.log("teste");
        const response = await axios.get('http://192.168.5.241:8080/gasto/1/3/2024');
        console.log(response);
        setGastos(response.data);
      } catch (error) {
        console.error('Erro ao buscar gastos:', error);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gastos do Usuário Calaça</Text>
        <FlatList
          data={gastos}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.nome}</Text>
              <Text>Valor: R$ {item.valor.toFixed(2)}</Text>
              <Text>{item.dataCompra}</Text>
              <Text>Categoria: {item.categoria.categoria}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
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
    },
    item: {
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
    },
  });
  
  export default GastosScreen;
  