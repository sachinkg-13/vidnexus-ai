import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // Enable sending cookies with requests
});

// Remove the Authorization header interceptor since we're using cookies
client.interceptors.request.use((config) => {
  // Cookies are automatically sent with withCredentials: true
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call refresh endpoint (cookies are automatically sent)
        await axios.post(
          "http://localhost:8000/api/auth/refresh/",
          {},
          { withCredentials: true }
        );
        
        // Retry original request (new cookies are now set)
        return client(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // Redirect to login
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default client;
