import { LoginForm } from "./components/LoginForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-secondary p-4">
        
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          {/* TODO: Replace with the actual Logo component when available */}
          <h1 className="text-3xl font-semibold tracking-tight text-primary">
            {import.meta.env.VITE_APP_NAME}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">登录您的商户端</p>
        </div>

        <div >
          <LoginForm />
        </div>

        <p className="px-8 text-center text-sm text-text-secondary">
          登录遇到问题？
          <Dialog>
            <DialogTrigger asChild>
              <span className="ml-1 cursor-pointer underline underline-offset-4 hover:text-brand-500">
                请联系您的专属顾问
              </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>联系专属顾问</DialogTitle>
                <DialogDescription>
                  请使用微信扫描下方二维码，添加您的专属顾问解决登录问题。
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div
                  className="mx-auto h-48 w-48 rounded-md bg-gray-100"
                  datatype="TODO: Replaced 二维码"
                />
              </div>
            </DialogContent>
          </Dialog>
        </p>
      </div>
    </div>
  );
}
