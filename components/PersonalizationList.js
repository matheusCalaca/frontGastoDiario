import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import PersonalizadoItem from './PersonalizadoItem';

const PersonalizationList = ({ gastos, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);

  const renderItem = ({ item }) => <PersonalizadoItem gasto={item} />;

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

export default PersonalizationList;
