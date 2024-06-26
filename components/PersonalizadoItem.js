import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faTags, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { convertDateBR, parseDate } from '../util/utils';
import { Card } from 'react-native-paper';

const PersonalizadoItem = ({ gasto }) => {
  if (!gasto) {
    return <Text>Erro: Item de gasto inválido.</Text>;
  }

  return (
    <TouchableOpacity style={styles.item}>
      <Card>
        <Card.Title title={gasto.nome} subtitle="Card Subtitle"  />

        {/* <Text style={styles.itemName}>{gasto.nome}</Text> */}
        <Card.Content>
          <View style={styles.itemRow}>
            <FontAwesomeIcon icon={faMoneyBill} style={styles.icon} />
            <Text style={styles.itemText}>R$ {gasto.valor.toFixed(2)}</Text>
          </View>
          <View style={styles.itemRow}>
            <FontAwesomeIcon icon={faCalendarAlt} style={styles.icon} />
            <Text style={styles.itemText}>
              {convertDateBR(parseDate(gasto.data))}
            </Text>
          </View>
          <View style={styles.itemRow}>
            <FontAwesomeIcon icon={faTags} style={styles.icon} />
            <Text style={styles.itemText}>{gasto.categoria.categoria}</Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    marginBottom: 10,
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

export default PersonalizadoItem;
