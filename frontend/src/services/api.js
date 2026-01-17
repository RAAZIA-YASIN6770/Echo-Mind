import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request Interceptor (e.g., for attaching tokens)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // or from context
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (e.g., for global error handling)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific error codes (e.g., 401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Clear storage and redirect to login if needed
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
