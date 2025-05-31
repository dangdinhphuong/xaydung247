import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getProducts = async () => {
  const res = await api.get('/products');
  return res.data;
};

export const addProduct = async (product) => {
  const res = await api.post('/products', product);
  return res.data;
};

export default api; 