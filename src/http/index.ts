import axios, { type AxiosResponse, type AxiosError } from "axios";
import { message as AntMessage } from 'ant-design-vue';
import { i18n } from "@/language";
const { t } = i18n.global;
import { useUserProfileStore } from '@/stores/userProfile';
declare module "axios" {
  interface AxiosRequestConfig {
    loading?: boolean;   // 是否显示loading框
    skipAuth?: boolean; // 是否跳过身份验证
  }
}

// 不需要认证的API路径
const SKIP_AUTH_PATHS = ['/API/auth/LoginTest', '/API/auth/login'];
// 加载状态管理
const loading = {
  show: () => { showLoading() },
  hide: () => { hideLoading() }
};

// 处理认证过期的逻辑
const handleAuthExpired = () => {
  const userProfileStore = useUserProfileStore();
  userProfileStore.clearUserProfile();
  userProfileStore.clearActivePrincipal();
  userProfileStore.setRememberMe(false);
  router.push("/home").then(() => {router.go(0)});
};

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 300000, // 5分钟超时
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    // 显示loading
    if (config.loading) {
      loading.show();
    }
    // 添加认证令牌
    if (!config.skipAuth && !SKIP_AUTH_PATHS.includes(config.url || '')) {
      const userProfileStore = useUserProfileStore();
      const token = userProfileStore.userProfile?.Token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },

  (error: AxiosError) => {
    // 请求错误时隐藏loading
    if (error.config?.loading) {
      loading.hide();
    }
    return Promise.reject(error);
  }
);


request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 响应成功时隐藏loading
    if (response.config.loading) {
      loading.hide();
    }
    if(response.config.responseType === 'blob'){
      return response;
    }
    const { data, status } = response;
    if (status === 200) {
      const { StatusCode, Message, Data } = data;
      // 业务状态码处理
      if (StatusCode === 200) {
        return Data;
      }
      // // 认证过期处理
      // if ((StatusCode === 401 || 403) && !SKIP_AUTH_PATHS.includes(response.config.url as string)) {
      //   AntMessage.error(Message);
      //   handleAuthExpired();
      //   return Promise.reject(data);
      // }
      // 其他业务错误
      AntMessage.error(Message);
      return Promise.reject(data);
    }
    return response;
  },

  (error: AxiosError) => {
    // 响应错误时隐藏loading
    if (error.config?.loading) {
      loading.hide();
    }
    // 网络错误处理
    if (!error.response) {
      AntMessage.error(error.message);
      return Promise.reject(error);
    }

    // HTTP状态码处理
    const { code, status, config } = error;
    // 认证过期处理
    if ((status === 401 || status === 403) && !SKIP_AUTH_PATHS.includes(config?.url as string)) {
      handleAuthExpired();
      return Promise.reject(error);
    }
    if (code === "ECONNABORTED") {
      AntMessage.error(t("timeoutError"));
      return Promise.reject(error);
    }
    // 其他HTTP错误
    const message = error.message;
    AntMessage.error(message);
    return Promise.reject(error);
  }
);

export default request;
