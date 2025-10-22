import { type RouteObject, Navigate } from "react-router";

import { AppGuard, OnboardingGuard } from "./guards";

import LoginPage from "@/app/pages/login";
import SetPasswordPage from "@/app/pages/onboarding/SetPasswordPage";
import BindWechatPage from "@/app/pages/onboarding/BindWechatPage";
import { OnboardingLayout } from "@/app/pages/onboarding/OnboardingLayout";
import { ShopInfoStep } from "@/app/pages/onboarding/steps/ShopInfoStep";
import { AddServiceStep } from "@/app/pages/onboarding/steps/AddServiceStep";
import { AddMemberStep } from "@/app/pages/onboarding/steps/AddMemberStep";
import OnboardingCompletePage from "@/app/pages/onboarding/OnboardingCompletePage";
import { useAuthStore } from "@/store/authStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import  AppLayout  from "@/components/layout/AppLayout";

// 这是一个临时的根组件，用于处理初始重定向
const RootRedirect = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const shopInfo = useOnboardingStore((state) => state.shopInfo);
  const firstService = useOnboardingStore((state) => state.firstService);

  const isAuthenticated = !!accessToken && !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  switch (user.status) {
    case "PENDING_PASSWORD":
      return <Navigate to="/onboarding/set-password" replace />;
    case "PENDING_WECHAT":
      return <Navigate to="/onboarding/bind-wechat" replace />;
    case "PENDING_SETUP":
      // PRD 流程中断规则：自动跳转到上次中断的步骤
      // 我们将使用 useOnboardingStore 来判断
      if (!shopInfo.name) {
        return <Navigate to="/onboarding/shop-info" replace />;
      }
      if (!firstService.name) {
        return <Navigate to="/onboarding/add-service" replace />;
      }
      return <Navigate to="/onboarding/add-member" replace />;
    case "ACTIVE":
      return <Navigate to="/app/appointments" replace />;
    default:
      // 兜底，防止未知状态
      return <Navigate to="/login" replace />;
  }
};

const router: RouteObject[] = [
  // 根路径重定向
  {
    path: "/",
    Component: RootRedirect,
  },
  // 公共路由：登录页
  {
    path: "/login",
    Component: LoginPage,
  },
  // Onboarding 流程路由 (受 OnboardingGuard 保护)
  {
    path: "/onboarding",
    Component: OnboardingGuard,
    children: [
      {
        path: "set-password",
        Component: SetPasswordPage,
      },
      {
        path: "bind-wechat",
        Component: BindWechatPage,
      },
      // 三步引导流程，共享 OnboardingLayout
      {
        Component: OnboardingLayout,
        children: [
          {
            path: "shop-info",
            Component: ShopInfoStep,
          },
          {
            path: "add-service",
            Component: AddServiceStep,
          },
          {
            path: "add-member",
            Component: AddMemberStep,
          },
        ],
      },
      {
        path: "complete",
        Component: OnboardingCompletePage,
      },
    ],
  },
  // 主应用路由 (受 AppGuard 保护)
  {
    path: "/app",
    Component: AppGuard,
    children: [
      {
        Component: AppLayout,
        children: [
          // TODO: 未来添加主应用的所有路由
          {
            path: "appointments",
            // 这是一个占位符，未来应替换为 AppointmentsPage
            element: <div>后台主页 - 预约日历</div>,
          },
          // 默认重定向到 appointments
          {
            index: true,
            element: <Navigate to="/app/appointments" replace />,
          },
        ],
      },
    ],
  },
  // 404 页面 (可选)
  {
    path: "*",
    element: <div>404 - 页面未找到</div>,
  },
];

export default router;
