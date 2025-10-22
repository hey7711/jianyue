// 规范：导入 sidebar.tsx 提供的核心组件
import { SidebarTrigger } from "@/components/ui/sidebar";
// 规范：使用 shadcn/ui 的 Breadcrumb (可选，但推荐)
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// 规范：导入即将创建的用户导航组件
import { UserNav } from "./UserNav";
// 规范：(新增) 导入 shadcn/ui Button
// 规范：使用 Link 组件进行路由跳转
import { Link } from "react-router";
// 规范：使用 lucide-react 图标库
import { PanelLeft } from "lucide-react"; // 汉堡菜单图标

/**
 * 规范：组件（文件和目录）命名：大驼峰（PascalCase）
 *
 * Header
 *
 * 职责：渲染应用顶部的通栏。
 * 1. 在移动端显示 SidebarTrigger (汉堡菜单)。
 * 2. (可选) 显示面包屑导航。
 * 3. 显示用户菜单 (UserNav)。
 * 4. 保持在页面顶部固定。
 */
export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b  px-4 sm:h-16 sm:px-6">
      {/* 规范：移动端侧边栏触发器 (汉堡菜单) */}
      {/* 使用 md:hidden 确保只在 sm 屏幕显示 */}
      {/* (修改) 使用 shadcn/ui Button 作为 asChild 的子组件 */}
      <SidebarTrigger
        className="rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
        // 我们可以直接给 SidebarTrigger 添加 className
        // 它内部应该会渲染一个 <button> 并应用这些样式
      >
        <PanelLeft className="h-6 w-6" />
        <span className="sr-only">Toggle Sidebar</span>
      </SidebarTrigger>

      {/* 规范：(可选) 面包屑导航 */}
      <div className="hidden md:flex md:flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/app">首页</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {/* TODO: 根据当前路由动态显示 */}
              <BreadcrumbPage>预约管理</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 规范：用户菜单 */}
      <div className="ml-auto">
        <UserNav />
      </div>
    </header>
  );
}
