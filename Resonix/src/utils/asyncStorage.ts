import AsyncStorage from '@react-native-async-storage/async-storage';

const saveToAsyncStorage = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

const getFromAsyncStorage = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value;
};

const removeFromAsyncStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

const clearAsyncStorage = async () => {
  await AsyncStorage.clear();
};

export enum Keys {
  AUTH_TOKEN = 'AUTH_TOKEN',
}

export {
  saveToAsyncStorage,
  getFromAsyncStorage,
  removeFromAsyncStorage,
  clearAsyncStorage,
};
