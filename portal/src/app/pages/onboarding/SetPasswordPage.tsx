import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SetPasswordForm } from "./components/SetPasswordForm";

/**
 *
 *
 * 职责：作为 /onboarding/set-password 路由的页面级组件。
 * 1. 提供页面布局（垂直水平居中）。
 * 2. 渲染表单的 UI 框架（Card）。
 * 3. 渲染 SetPasswordForm 子组件（它将负责表单逻辑）。
 */
export default function SetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            为了您的账户安全，请设置新密码
          </CardTitle>
          <CardDescription>请输入 6-20 位，包含字母和数字</CardDescription>
        </CardHeader>

        <CardContent>
          <SetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
