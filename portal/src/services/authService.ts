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
 * 设置新密码 API 的请求体（Payload）类型
 */
export interface ISetPasswordPayload {
  newPassword: string;
}

/**
 * 设置新密码 API 的成功响应类型
 */
export interface ISetPasswordSuccessResponse {
  data: IAuthUser;
}

/**
 * 获取微信绑定二维码 API 的响应类型
 */
export interface IWechatBindQrResponse {
  qrCodeUrl: string; // 用于 <img> 标签显示的 URL
  ticket: string; // 用于后端轮询校验的唯一票据
}

/**
 * 轮询微信绑定状态 API 的响应类型
 */
export interface IWechatBindStatusResponse {
  status: "PENDING" | "SCANNED" | "SUCCESS" | "EXPIRED";
  user?: IAuthUser; // 成功时返回更新后的用户信息 (可选)
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

/**
 *
 * 设置新密码服务函数
 * @param payload 包含 newPassword 的对象
 * @returns Promise
 */
export async function setPassword(
  payload: ISetPasswordPayload
): Promise<ISetPasswordSuccessResponse> {
  // TODO : 实现设置新密码API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id: "mockUserId",
          name: "Mock User",
          phone: "1234567890",
          role: "Administrator",
        },
      });
    }, 1000);
  });

  const uri = "/auth/set-password";
  const resp = await api.post<ISetPasswordSuccessResponse>(uri, payload);
  return resp.data;
}

/**
 *
 * 获取微信绑定二维码
 * @returns Promise<IWechatBindQrResponse>
 */
export async function getWechatBindQr(): Promise<IWechatBindQrResponse> {
  // TODO: 实现获取微信绑定二维码API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        qrCodeUrl: "https://placehold.co/192",
        ticket: "mockTicket",
      });
    }, 1000);
  });

  const uri = "/auth/wechat-bind-qr";
  const resp = await api.get<IWechatBindQrResponse>(uri);
  return resp.data;
}

/**
 *
 * 轮询微信绑定状态
 *
 * 职责：
 *  根据 ticket 轮询 API 检查用户是否已扫码。
 *
 * @param ticket 从 getWechatBindQr 获取的票据
 * @returns Promise<IWechatBindStatusResponse>
 */
export async function getWechatBindStatus(
  ticket: string
): Promise<IWechatBindStatusResponse> {
  // TODO: 实现轮询微信绑定状态API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "SUCCESS",
        user: {
          id: "mockUserId",
          name: "Mock User",
          phone: "1234567890",
          role: "Administrator",
        },
      });
    }, 2000);
  });
  const uri = `/auth/wechat-bind-status?ticket=${ticket}`;
  const resp = await api.get<IWechatBindStatusResponse>(uri);
  return resp.data;
}
