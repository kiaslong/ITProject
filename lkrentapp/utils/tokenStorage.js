import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_TOKEN_KEY = 'userToken';
const ADMIN_TOKEN_KEY = 'adminToken';

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(USER_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save the token', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(USER_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve the token', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(USER_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove the token', error);
  }
};

// Admin token functions
export const saveAdminToken = async (token) => {
  try {
    await AsyncStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save the admin token', error);
  }
};

export const getAdminToken = async () => {
  try {
    return await AsyncStorage.getItem(ADMIN_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve the admin token', error);
    return null;
  }
};

export const removeAdminToken = async () => {
  try {
    await AsyncStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove the admin token', error);
  }
};
