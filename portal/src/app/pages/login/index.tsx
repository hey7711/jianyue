import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./components/LoginForm";
import { SupportDialog } from "./components/SupportDialog"; // 1. 导入新组件

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-primary"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>

          <CardTitle className="text-2xl font-semibold">
            登录您的{import.meta.env.VITE_APP_NAME}商户端
          </CardTitle>
          <CardDescription>使用您的手机号和密码登录</CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm />
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            登录遇到问题？
            <SupportDialog>
              <span className="ml-1 cursor-pointer text-primary underline-offset-4 hover:underline">
                请联系您的专属顾问
              </span>
            </SupportDialog>
            。
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
