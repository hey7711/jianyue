import { useAuthStore } from "@/store/authStore";
import {
  CalendarDays, // 预约
  LayoutGrid, // 服务项目 (用 Grid 图标代替工具箱)
  Users, // 团队
  Contact, // 会员
  BarChartBig, // 统计
  Settings, // 设置
  TrendingUp, // 增长
} from "lucide-react"; // 规范：使用 lucide-react 图标库

/**
 * 导航菜单项接口
 * 定义了每个菜单项的数据结构
 */
export interface INavItem {
  href: string; // 链接路径
  label: string; // 显示标签
  icon: React.ComponentType<{ className?: string }>; // 图标组件
  roles: ("Administrator" | "Operator" | "Practitioner")[]; // 允许访问的角色
}

/**
 * 所有可能的导航菜单项
 *,
 */
const allNavItems: INavItem[] = [
  {
    href: "/app/appointments",
    label: "预约",
    icon: CalendarDays,
    roles: ["Administrator", "Operator", "Practitioner"], // 所有角色可见
  },
  {
    href: "/app/services",
    label: "服务项目",
    icon: LayoutGrid,
    roles: ["Administrator", "Operator"], // 服务人员不可见
  },
  {
    href: "/app/team",
    label: "团队",
    icon: Users,
    roles: ["Administrator", "Operator"], // 服务人员不可见
  },
  {
    href: "/app/members",
    label: "会员",
    icon: Contact,
    roles: ["Administrator", "Operator"], // 服务人员不可见
  },
  {
    href: "/app/growth",
    label: "增长",
    icon: TrendingUp,
    roles: ["Administrator"], // 仅管理员可见
  },
  {
    href: "/app/analytics",
    label: "统计",
    icon: BarChartBig,
    roles: ["Administrator", "Operator"], // 服务人员不可见
  },
  {
    href: "/app/settings",
    label: "设置",
    icon: Settings,
    roles: ["Administrator"], // 仅管理员可见
  },
];

/**
 * 规范：自定义 Hooks 命名：小驼峰（camelCase）
 *
 * useNavMenu Hook
 *
 * 职责：
 * 1. 从 useAuthStore 获取当前用户的角色。
 * 2. 根据角色权限过滤 allNavItems。
 * 3. 返回当前用户应该看到的导航菜单项数组。
 *
 * @returns INavItem[] 过滤后的导航项数组
 */
export function useNavMenu(): INavItem[] {
  const userRole = useAuthStore((state) => state.user?.role);

  if (!userRole) {
    return []; // 如果没有用户信息（例如未登录），返回空数组
  }

  // 根据角色过滤菜单项
  const filteredNavItems = allNavItems.filter(
    (item) =>
      // 检查当前用户角色是否在允许的角色列表中
      item.roles.includes(userRole as any) // 使用 'as any' 简化类型检查，假设 role 字符串有效
  );

  return filteredNavItems;
}
