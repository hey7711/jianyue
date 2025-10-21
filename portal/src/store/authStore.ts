import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * 规范：类型/接口 命名，大驼峰并以 I 开头
 * 已登录用户信息接口
 */
export interface IAuthUser {
  id: string;
  name: string;
  phone: string;
  /**
   * 角色：遵照 pd/mvp/core.md 定义
   * 'Administrator' (商户管理员)
   * 'Operator' (运营人员)
   * 'Practitioner' (服务人员)
   */
  role: "Administrator" | "Operator" | "Practitioner" | string; // 使用 string 作为兜底
}

/**
 * Auth Store 的状态接口
 */
interface IAuthState {
  accessToken: string | null;
  user: IAuthUser | null;
}

/**
 * Auth Store 的 Action 接口
 */
interface IAuthActions {
  /**
   * 登录 Action
   * @param token
   * @param user
   */
  login: (token: string, user: IAuthUser) => void;

  /**
   * 登出 Action
   */
  logout: () => void;
}

/**
 *
 * useAuthStore
 *
 * 职责：
 * 1. 存储全局认证 token 和用户信息。
 * 2. 暴露 login 和 logout action 来管理认证状态。
 * 3. 规范：使用 Zustand 的 persist 中间件将认证状态持久化到 localStorage，
 * 以确保浏览器刷新后登录状态不丢失。
 */
export const useAuthStore = create<IAuthState & IAuthActions>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,

      /**
       * 规范：Action（状态更新函数）直接定义在 create 函数内部
       */
      login: (token: string, user: IAuthUser) => {
        set({
          accessToken: token,
          user: user,
        });
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
        });
      },
    }),
    {
      /**
       * 持久化的名称
       */
      name: "auth-storage",
      /**
       * (可选) 默认使用 localStorage
       */
      storage: createJSONStorage(() => localStorage),
      /**
       * 我们只持久化 accessToken 和 user，
       * login/logout 函数不需要持久化。
       */
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);

/**
 * (可选) 导出便捷的选择器 (Selectors)
 * 规范：使用选择器（selectors）从Store中读取状态，以避免不必要的组件重渲染。
 */
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => !!state.accessToken);
