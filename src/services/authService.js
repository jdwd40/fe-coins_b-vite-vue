import axios from 'axios';

const API_URL = 'http://77.68.4.18:9001/api/users/';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}register`, { username, email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
