import axios, { AxiosResponse, AxiosError } from 'axios';
import { get } from 'http';




const customAxios = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    // Optional: Set default headers
    withCredentials: true, 
    headers: {
      'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Authorization': `Bearer ${getCookie('token')}`
    }
    
  });



customAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
            // window.location.href = '/';
          break;
        case 400:
          console.log('Bad request:', error.response.data);
          break;
        default:
          console.log('An error occurred:', error.response.data);
          break;
      }
    } else {
      console.log('Error connecting to the server:', error.message);
    }


    return Promise.reject(error);
  }
);

export default customAxios;