import axios from 'axios';

const API_URL = 'http://77.68.4.18:9001/api/coins/';

export const getCoins = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin data:', error);
    throw error;
  }
};

export const getCoinDetails = async (coinId) => {
  try {
    const response = await axios.get(`${API_URL}${coinId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin details:', error);
    throw error;
  }
};

