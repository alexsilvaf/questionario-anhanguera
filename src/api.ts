import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/', // Altere conforme sua URL de backend
  withCredentials: true, // Envia cookies automaticamente
});

// Interceptor de requisição (caso precise adicionar cabeçalhos)
api.interceptors.request.use(
  config => {
    // Se necessário, adicione headers ou outros ajustes aqui
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor de resposta para tratar erros (como 401 - não autorizado)
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      // Aqui você pode implementar a lógica de refresh token, se aplicável,
      // ou redirecionar para a tela de login.
      console.error('Não autorizado – possivelmente a sessão expirou.');
    }
    return Promise.reject(error);
  }
);

export default api;
