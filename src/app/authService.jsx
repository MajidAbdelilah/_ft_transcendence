import axios from 'axios';

const API_URL = 'https://your-backend-api-url.com/api';

const authService = {
  login: (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
  },
  signup: (name, email, password) => {
    return axios.post(`${API_URL}/signup`, { name, email, password });
  },
  logout: () => {
    return axios.post(`${API_URL}/logout`);
  },
};

export default authService;