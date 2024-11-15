import axios from 'axios';

const API_URL = process.env.SIGNUP_API;

const authService = {
  login: (email, password) => {

    return axios.post('http://127.0.0.1:8000/api/login/', { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'origin': 'http://127.0.0.1:3000',
        },
      }
    );
  },
  signup: (username, email, password) => {
    return axios.post('http://127.0.0.1:8000/api/register/', { username, email, password });
  },
  _42API: () => {
    return axios.get('http://127.0.0.1:8000/oauth/login/');
  },
  _42CALLBACK: () => {
    return axios.get('http://127.0.0.1:8000/oauth/user_data/');
  },
  logout: () => {
    return axios.post(`${API_URL}/logout`);
  },
  user_data: () => {
    return axios.get(`http://127.0.0.1:8000/oauth/user_data/`);
  }
};

export default authService;
