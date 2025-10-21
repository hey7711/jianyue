import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/store/authStore"; // 假设 @/ 指向 ./src

/**
 * 规范：API 响应错误结构
 * (根据你的确认：{code:xx, messages:"xxx"} code!=0为失败)
 */
interface IApiErrorResponse {
  code: number;
  messages: string;
}

// 你的 API 基础 URL，应替换为环境变量
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

/**
 * 规范：创建并导出一个 Axios 单例
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10秒超时
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 规范：配置 Axios 请求拦截器 (Request Interceptor)
 *
 * 职责：
 * 在每个请求发送前，自动从 useAuthStore 中获取 accessToken，
 * 并将其附加到 Authorization 请求头中。
 */
api.interceptors.request.use(
  (config) => {
    // 从 Zustand store 中获取 token
    const token = useAuthStore.getState().accessToken;

    if (token) {
      // 规范：使用 Bearer Token 认证
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

/**
 * 规范：配置 Axios 响应拦截器 (Response Interceptor)
 *
 * 职责：
 * 1. 统一处理成功的响应（直接返回 data）。
 * 2. 统一处理 API 错误（标准化错误格式）。
 * 3. 统一处理 401 Unauthorized 错误（自动登出）。
 */
api.interceptors.response.use(
  /**
   * 1. 成功处理 (HTTP 状态码 2xx)
   * 直接返回 response.data，简化调用方（如 SWR）的数据处理
   */
  (response) => {
    return response.data;
  },

  /**
   * 2. 错误处理
   */
  (error: AxiosError) => {
    if (error.response) {
      // API 返回了错误响应 (非 2xx 状态码)
      const status = error.response.status;
      const data = error.response.data as IApiErrorResponse;

      // 3. 统一处理 401 Unauthorized 错误
      if (status === 401) {
        // Token 失效或未认证
        console.error("[API Interceptor] 401 Unauthorized. Logging out.");
        // 调用 Zustand action 清除本地 token 和 user
        useAuthStore.getState().logout();
        // 强制刷新页面或重定向到登录页
        // window.location.href = '/login';

        // 返回一个标准化的错误信息
        return Promise.reject({
          code: 401,
          messages: "登录已过期，请重新登录",
        });
      }

      // 统一处理我们约定的业务错误格式
      // (根据你的确认：{code:xx, messages:"xxx"} code!=0为失败)
      if (data && data.code !== 0 && data.messages) {
        console.warn(
          `[API Interceptor] Business Error ${data.code}: ${data.messages}`
        );
        return Promise.reject(data);
      }

      // 处理其他 HTTP 错误
      return Promise.reject({
        code: status,
        messages: data.messages || `服务器错误 (HTTP ${status})`,
      });
    } else if (error.request) {
      // 请求已发出，但没有收到响应（例如网络问题或超时）
      console.error(
        "[API Interceptor] Network Error or Timeout:",
        error.message
      );
      return Promise.reject({
        code: -1, // 自定义网络错误码
        messages: "网络连接失败或服务器无响应，请稍后重试",
      });
    } else {
      // 发送请求时出了点问题（例如 Axios 配置错误）
      console.error("[API Interceptor] Request Setup Error:", error.message);
      return Promise.reject({
        code: -2, // 自定义请求配置错误码
        messages: `请求配置错误: ${error.message}`,
      });
    }
  }
);
