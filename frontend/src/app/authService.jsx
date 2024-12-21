
import customAxios from './customAxios';

const API_URL = process.env.SIGNUP_API;

const authService = {
  login: (email, password) => {
    return customAxios.post('https://127.0.0.1/api/api/login/', { email, password });
  },
  signup: (username, email, password) => {
    return customAxios.post('https://127.0.0.1/api/api/register/', { username, email, password });
  },
  logout: () => {
    return customAxios.post('https://127.0.0.1/api/api/logout/');
  },
  _42API: () => {
    return customAxios.get('https://127.0.0.1/api/oauth/login/');
  },
  _42CALLBACK: () => {
    return customAxios.get('https://127.0.0.1/api/oauth/user_data/');
  },
  user_data: () => {
    return customAxios.get(`https://127.0.0.1/api/oauth/user_data/`);
  }
};

export default authService;
