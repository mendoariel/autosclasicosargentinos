import axios from 'axios';

// Detectar la URL de la API
const getApiUrl = () => {
  // Primero, verificar si hay una variable de entorno configurada (en build time)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Si estamos en el cliente (navegador)
  if (typeof window !== 'undefined') {
    // Si estamos en HTTPS (producción), usar la API de producción
    if (window.location.protocol === 'https:') {
      return 'https://api.autosclasicosargentinos.com.ar';
    }
    // Si estamos en HTTP pero no es localhost, también usar producción
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `https://api.${window.location.hostname}`;
    }
  }
  
  // Por defecto, desarrollo local
  return 'http://localhost:5001';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

