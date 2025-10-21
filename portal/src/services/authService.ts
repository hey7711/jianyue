import { api } from "@/lib/api";
import { type IAuthUser } from "@/store/authStore";

// 登录 API 的请求体（Payload）类型
export interface ILoginPayload {
  phone: string;
  password: string;
}

// 登录 API 的成功响应类型
export interface ILoginSuccessResponse {
  accessToken: string;
  user: IAuthUser;
  needsOnboarding: boolean;
}

// 登录 API 的失败响应类型
export interface ILoginErrorResponse {
  code: number;
  messages: string;
}

/**
 *
 * 登录服务函数
 * @param payload 包含 phone 和 password 的对象
 * @returns 包含 token, user 和 needsOnboarding 状态的 Promise
 */
export async function login(
  payload: ILoginPayload
): Promise<ILoginSuccessResponse> {
  const uri = "/auth/login";

  // TODO: 实现登录API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        accessToken: "mockToken",
        user: {
          id: "mockUserId",
          name: "Mock User",
          phone: "1234567890",
          role: "Administrator",
        },
        needsOnboarding: true,
      });
    }, 1000);
  });

  const resp = await api.post<ILoginSuccessResponse>(uri, payload);
  return resp.data;
}
