import { Outlet } from 'react-router';
// 规范：导入 sidebar.tsx 提供的核心组件
// (假设你已经按照 sidebar.md 文档安装了 sidebar.tsx 到 @/components/ui/sidebar)
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

// 导入我们即将创建的子组件
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';

/**
 * 规范：组件（文件和目录）命名：大驼峰（PascalCase）
 *
 * AppLayout
 *
 * 职责：作为 /app/* 路由组的共享根布局。
 * 1. 使用 SidebarProvider 管理侧边栏状态。
 * 2. 渲染 AppSidebar (侧边栏 UI)。
 * 3. 使用 SidebarInset 包裹主内容区，以实现自动布局调整。
 * 4. 渲染 Header (顶部通栏)。
 * 5. 渲染 <Outlet /> 以显示当前的主应用页面。
 */
export default function AppLayout() {
  return (
    // 规范：步骤 1 - 使用 SidebarProvider 作为根
    // 它将处理侧边栏的展开/收起状态，并可能通过 Cookie 持久化
    //
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen">
        {/* 规范：步骤 2 - 渲染侧边栏组件 */}
        <AppSidebar />

        {/* 规范：步骤 3 - 使用 SidebarInset 包裹主内容区 */}
        {/* SidebarInset 会自动根据侧边栏状态调整 margin/padding */}
        {/* */}
        <SidebarInset className="flex flex-1 flex-col bg-secondary">
          {/* 规范：步骤 4 - 渲染顶部通栏 */}
          <Header />

          {/* 规范：步骤 5 - 渲染主应用页面 */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}