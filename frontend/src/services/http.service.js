import axios from "axios";

const app = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

app.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

app.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;
    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
          { withCredentials: true }
        );
        if (data) return app(originalConfig);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const httpService = {
  get: app.get,
  post: app.post,
  delete: app.delete,
  put: app.put,
  patch: app.patch,
};

export default httpService;
