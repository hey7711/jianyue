// 规范：导入 sidebar.tsx 提供的核心组件
// (假设你已经按照 sidebar.md 文档安装了 sidebar.tsx 到 @/components/ui/sidebar)
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// 规范：导入我们创建的动态导航 Hook
import { useNavMenu } from "@/hooks/use-nav-menu";
// 规范：使用 Link 组件进行路由跳转
import { Link, useLocation } from "react-router";
// 规范：使用 lucide-react 图标库
import { Package } from "lucide-react";

/**
 * 规范：组件（文件和目录）命名：大驼峰（PascalCase）
 *
 * AppSidebar
 *
 * 职责：渲染桌面端 (md 及以上) 的响应式侧边栏。
 * 1. 使用 sidebar.tsx 的核心组件构建 UI。
 * 2. 设置 collapsible="icon" 实现 md 断点的图标收起。
 * 3. 调用 useNavMenu 获取动态导航项。
 * 4. 根据当前路由高亮激活的菜单项。
 * 5. 在 sm 断点下隐藏。
 */
export function AppSidebar() {
  // 规范：调用 Hook 获取当前角色应看到的导航项
  const navItems = useNavMenu();
  const location = useLocation();

  return (
    // 规范：使用 hidden md:flex 确保只在 md 及以上屏幕显示
    // 规范：设置 collapsible="icon"
    //
    <Sidebar collapsible="icon" className="hidden md:flex">
      {/* 规范：侧边栏头部 - 可放置 Logo */}
      <SidebarHeader className="border-b border-sidebar-border">
        {/* 这是一个 Logo 占位符 */}
        <Link to="/app" className="flex items-center gap-2 font-semibold text-primary">
          <Package className="h-6 w-6 " />
          {/* 规范：使用 group-data-[state=collapsed]:hidden 在收起时隐藏文字 */}
          <span className="group-data-[state=collapsed]:hidden">简约</span>
        </Link>
      </SidebarHeader>

      {/* 规范：侧边栏主要内容（可滚动） */}
      <SidebarContent className="flex-1">
        {/* 规范：使用 SidebarGroup 组织菜单 */}
        <SidebarGroup>
          {/* 规范：使用 SidebarMenu 渲染导航 */}
          <SidebarMenu>
            {navItems.map((item) => {
              // 判断当前项是否应该高亮
              // (简单判断：当前路径以菜单项 href 开头)
              const isActive = location.pathname.startsWith(item.href);

              return (
                // 规范：使用 SidebarMenuItem 包裹每一项
                <SidebarMenuItem key={item.href}>
                  {/* 规范：使用 SidebarMenuButton 作为链接 */}
                  <SidebarMenuButton
                    asChild // 渲染子组件 (Link) 而不是 button
                    isActive={isActive} // 传递激活状态
                  >
                    <Link to={item.href}>
                      {/* 渲染图标 */}
                      <item.icon className="h-5 w-5" />
                      {/* 规范：使用 group-data-[state=collapsed]:hidden 在收起时隐藏文字 */}
                      <span className="group-data-[state=collapsed]:hidden">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* 规范：侧边栏底部 - 可放置用户信息、版本号等 */}
      <SidebarFooter className="mt-auto border-t border-sidebar-border p-4">
        {/* 示例：显示应用版本号 */}
        <div className="text-xs text-sidebar-foreground/60 group-data-[state=collapsed]:hidden">
          版本 v{/* TODO: 获取实际版本号 */}0.1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
