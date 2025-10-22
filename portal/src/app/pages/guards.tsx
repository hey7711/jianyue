import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/authStore";

/**
 * Onboarding 流程的路由守卫
 *
 * 职责：
 * 1. 确保用户已登录才能访问 Onboarding 页面。
 */
export function OnboardingGuard() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!accessToken && !!user;

  // 1. 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. 如果已登录但已完成 Onboarding，重定向到主应用
  // (防止用户通过 URL 手动返回 Onboarding 流程)
  if (user.status === "ACTIVE") {
    return <Navigate to="/app/appointments" replace />;
  }

  // 3. 验证通过，渲染 Onboarding 的子路由
  return <Outlet />;
}

/**
 * 主应用的路由守卫
 *
 * 职责：
 * 1. 确保用户已登录才能访问主应用。
 * 2. 确保用户已完成 Onboarding 才能访问。
 */
export function AppGuard() {
  // const { accessToken, user } = useAuthStore((state) => ({
  //   accessToken: state.accessToken,
  //   user: state.user,
  // }));
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = !!accessToken && !!user;

  // 1. 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.status.startsWith("PENDING_")) {
    // 规范：(关键逻辑) 我们不直接跳到某个步骤，
    // 而是重定向到根路径 '/'。
    // 我们在根路径的 RootRedirect 组件包含了智能判断
    // (检查 PENDING 状态 和 useOnboardingStore 的数据)
    // 以便将用户发送到 *正确* 的中断步骤。
    return <Navigate to="/" replace />;
  }

  // 3. 验证通过，渲染主应用的子路由
  // TODO: 这里未来应该渲染一个包含侧边栏和顶栏的主应用布局 <AppLayout />
  return <Outlet />;
}
