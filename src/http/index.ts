import axios, { AxiosError } from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    showLoading?: boolean;
  }
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 180000,
  withCredentials: true,
  headers: {
    post: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  },
});

// request拦截器
request.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// response 拦截器
request.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default request;
