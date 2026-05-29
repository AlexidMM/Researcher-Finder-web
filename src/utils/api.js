// src/utils/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  // Sacamos el token guardado en el navegador
  const token = localStorage.getItem('access_token');

  // Configuramos las cabeceras por defecto para enviar y recibir JSON
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Si hay sesión iniciada, le pegamos el token a la cabecera
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Hacemos la petición nativa
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Si la API no devuelve contenido (ej. un DELETE vacío)
  if (response.status === 204) return null;

  // Convertimos la respuesta a JSON
  const data = await response.json();

  // Si la API tiró un error (400, 401, 404, etc.), lanzamos la excepción
  if (!response.ok) {
    throw new Error(data.message || 'Error inesperado en la petición');
  }

  return data;
};