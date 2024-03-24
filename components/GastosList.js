import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import GastoItem from './GastoItem';

const GastosList = ({ gastos, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);

  const renderItem = ({ item }) => <GastoItem gasto={item} />;

  return (
    <FlatList
      data={gastos}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default GastosList;
