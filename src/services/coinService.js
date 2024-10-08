import axios from 'axios';

const API_URL = 'https://jdwd40.com/api/coins/';
const HISTORY_URL = 'https://jdwd40.com/api/history/';
const STATS_URL = 'https://jdwd40.com/api/stats';
const TRANSACTION_URL = 'https://jdwd40.com:/api/transactions';

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

export const getCoinHistory = async (coinId) => {
  try {
    const response = await axios.get(`${HISTORY_URL}${coinId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coin history:', error);
    throw error;
  }
};

export const getCoinEvents = async (coinId) => {
  try {
    const response = await axios.get(`${API_URL}${coinId}/events`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMarketStats = async () => {
  try {
    const response = await axios.get(STATS_URL);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const buyCoin = async (transactionData) => {
  try {
    const response = await axios.post(TRANSACTION_URL, transactionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const sellCoin = async (transactionData) => {
  try {
    const response = await axios.post(TRANSACTION_URL, transactionData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}