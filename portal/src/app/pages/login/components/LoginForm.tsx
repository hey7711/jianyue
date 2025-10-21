import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import {
  type ILoginErrorResponse,
  type ILoginPayload,
  login,
} from "@/services/authService";
import { useAuthStore } from "@/store/authStore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "请输入手机号")
    .regex(/^1\d{10}$/, "请输入正确的11位手机号"),
  password: z.string().min(1, "请输入密码"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    form.clearErrors();

    try {
      const response = await login(values as ILoginPayload);

      loginAction(response.accessToken, response.user);

      if (response.needsOnboarding) {
        navigate("/onboarding/set-password");
      } else {
        navigate("/app/appointments");
      }
    } catch (error) {
      // 6. 规范：处理来自 Service 的 API 异常
      setIsLoading(false);
      const apiError = error as ILoginErrorResponse;

      form.setError("root", {
        type: "api",
        message: apiError.messages || "登录失败，请稍后重试",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <FormMessage className="text-center">
            {form.formState.errors.root.message}
          </FormMessage>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>手机号</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入11位手机号"
                    type="tel"
                    autoComplete="username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>密码</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入密码"
                    type="password"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "登录中..." : "登 录"}
        </Button>
      </form>
    </Form>
  );
}
