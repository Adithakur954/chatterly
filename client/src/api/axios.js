import axios from 'axios';

// Create a single, configured axios instance
const apiClient = axios.create({
  baseURL: '/api',
});

// Function to set the authentication token on the shared instance
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default apiClient;