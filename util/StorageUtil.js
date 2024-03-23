import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageUtil {
  // Método para armazenar um item no AsyncStorage
  static async storeItem(key, value) {
    try {
      await AsyncStorage.setItem(key,  JSON.stringify(value));
      console.log(`Item ${key} armazenado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao armazenar o item ${key}:`, error);
    }
  }

  // Método para recuperar um item do AsyncStorage
  static async retrieveItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log(`Item ${key} recuperado com sucesso:`,  JSON.parse(value));
        return JSON.parse(value);
      } else {
        console.log(`Nenhum item encontrado para a chave ${key}.`);
        return null;
      }
    } catch (error) {
      console.error(`Erro ao recuperar o item ${key}:`, error);
      return null;
    }
  }

  // Método para limpar um item do AsyncStorage
  static async clearItem(key) {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Item ${key} removido com sucesso.`);
    } catch (error) {
      console.error(`Erro ao limpar o item ${key}:`, error);
    }
  }
}

export default StorageUtil;
