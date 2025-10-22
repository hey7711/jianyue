import { Outlet, useLocation } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// 假设你已安装 lucide-react (shadcn/ui 默认)
import { ChevronRight } from "lucide-react";

/**
 * Onboarding 步骤定义
 *
 */
const steps = [
  { path: "/onboarding/shop-info", name: "1. 店铺信息" },
  { path: "/onboarding/add-service", name: "2. 添加服务" },
  { path: "/onboarding/add-member", name: "3. 添加成员" },
];

/**
 *
 * OnboardingLayout
 *
 * 职责：作为 /onboarding/* 路由的共享布局。
 * 1. 渲染页面布局（垂直水平居中）。
 * 2. 渲染 PRD 要求的“步骤指示器”。
 * 3. 使用 useLocation 动态高亮当前步骤。
 * 4. 渲染 <Outlet /> 以显示当前步骤的表单组件。
 */
export function OnboardingLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  // 找到当前步骤的索引
  const currentStepIndex = steps.findIndex((step) => step.path === currentPath);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center space-x-1">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;

              return (
                <div key={step.path} className="flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-primary" // 规范：激活状态使用品牌主色
                        : isCompleted
                        ? "text-primary/70" // 已完成状态
                        : "text-muted-foreground" // 规范：未激活状态使用柔和色
                    }`}
                  >
                    {step.name}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}
