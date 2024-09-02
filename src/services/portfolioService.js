import axios from 'axios';

const API_URL = 'https://jdwd40.com/api/portfolios/';

export const getPortfolio = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error.response.data;
  }
};
