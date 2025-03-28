import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials, { withCredentials: true });
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('csrfToken', response.data.csrfToken);
  return response.data;
};
export const logout = async () => {
  await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  localStorage.removeItem('accessToken');
  localStorage.removeItem('csrfToken');
};
