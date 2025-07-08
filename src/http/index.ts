import axios, { type AxiosResponse, type AxiosError } from "axios";
import {message as AntMessage} from 'ant-design-vue';

declare module "axios" {
  interface AxiosRequestConfig {
    showLoading?: boolean;
    skipAuth?: boolean; // 是否跳过身份验证
  }
}

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 180000, // 3分钟超时
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加认证令牌
    if (!config.skipAuth) {
      const userProfileStore = useUserProfileStore();
      const token = userProfileStore.userProfile?.Token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
// 响应拦截器

request.interceptors.response.use(
  (response: AxiosResponse) => {
    if(response.status === 200){
      const res = response.data;
      const {StatusCode , Message, Data} = res;
      if(StatusCode === 200){
        return Data;
      }
      else{
        AntMessage.error(Message);
        return Promise.reject(res);
      }

    }
    return response;
  },
  (err: AxiosError) => {
    const {code, message, status} = err;

    AntMessage.error(message, 1);
    return Promise.reject(err);
  }
);

export default request;
