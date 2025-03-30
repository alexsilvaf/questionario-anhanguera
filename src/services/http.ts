import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use(
  config => {
    return config;
  },
  error => Promise.reject(error)
);

http.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      console.error('Não autorizado – possivelmente a sessão expirou.');
    }
    return Promise.reject(error);
  }
);

export default http;
