import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";



export interface IShopInfo {
  logoUrl: string | null;
  name: string;
  phone: string;
}

export interface IFirstService {
  name: string;
  price: number;
  duration: number; // 以分钟为单位
}

export interface IAdminMember {
  name: string;
}

interface IOnboardingState {
  shopInfo: Partial<IShopInfo>;
  firstService: Partial<IFirstService>;
  adminMember: Partial<IAdminMember>;
}

interface IOnboardingActions {
  setShopInfo: (data: IShopInfo) => void;
  setFirstService: (data: IFirstService) => void;
  setAdminMember: (data: IAdminMember) => void;
  reset: () => void;
}

const initialState: IOnboardingState = {
  shopInfo: {},
  firstService: {},
  adminMember: {},
};

/**
 * 规范：创建原子化的 Store (修改版 - 已持久化)
 *
 * useOnboardingStore
 *
 * 职责：
 * 1. 临时暂存多步骤 Onboarding 表单的数据。
 * 2. (修改) 使用 persist 中间件将数据保存到 localStorage，
 * 以防止用户意外刷新页面导致数据丢失。
 * 3. 在流程完成或重置时清空数据。
 */
export const useOnboardingStore = create<
  IOnboardingState & IOnboardingActions
>()(
  // 规范：(已修改) 嵌套 persist 中间件
  persist(
    (set) => ({
      ...initialState,

      setShopInfo: (data: IShopInfo) => set(() => ({ shopInfo: data })),

      setFirstService: (data: IFirstService) =>
        set(() => ({ firstService: data })),

      setAdminMember: (data: IAdminMember) =>
        set(() => ({ adminMember: data })),

      // 规范：reset Action 会将持久化的数据也重置回 initialState
      reset: () => set(initialState),
    }),
    {
      /**
       * 持久化的名称
       */
      name: "onboarding-storage", // 使用唯一的 key
      /**
       * 默认使用 localStorage
       */
      storage: createJSONStorage(() => localStorage),
    }
  )
);
