import axios from 'axios';

const API_URL = 'https://invoice-mern-backend.vercel.app/api';

export const createSeller = async (seller) => {
  return await axios.post(`${API_URL}/sellers`, seller);
};

export const createItem = async (item) => {
  return await axios.post(`${API_URL}/items`, item);
};

export const createOrder = async (order) => {
  return await axios.post(`${API_URL}/orders`, order);
};

export const getSellers = async () => {
  return await axios.get(`${API_URL}/sellers`);
};

export const getItems = async () => {
  return await axios.get(`${API_URL}/items`);
};

// Add the getOrders function
export const getOrders = async () => {
  return await axios.get(`${API_URL}/orders`);
};
