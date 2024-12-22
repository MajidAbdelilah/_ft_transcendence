
import customAxios from './customAxios';

const API_URL = process.env.SIGNUP_API;

const authService = {
  login: (email, password) => {
    return customAxios.post('http://127.0.0.1:8000/api/login/', { email, password });
  },
  signup: (username, email, password) => {
    return customAxios.post('http://127.0.0.1:8000/api/register/', { username, email, password });
  },
  logout: () => {
    localStorage.removeItem('codeSent');
    return customAxios.post('http://127.0.0.1:8000/api/logout/');
  },
  _42API: () => {
    return customAxios.get('http://127.0.0.1:8000/oauth/login/');
  },
  _42CALLBACK: () => {
    return customAxios.get('http://127.0.0.1:8000/oauth/user_data/');
  },
  user_data: () => {
    return customAxios.get(`http://127.0.0.1:8000/oauth/user_data/`);
  }
};

export default authService;
