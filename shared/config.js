import AsyncStorage from '@react-native-community/async-storage';
export const Config = async () => {
  const config = {

    host: await AsyncStorage.getItem("host") ?? '192.168.10.50',
    port: await AsyncStorage.getItem("port") ?? '8080',
    database: await AsyncStorage.getItem("database") ?? 'products',

    
  }
  return config;
}

export const version = '1.0'