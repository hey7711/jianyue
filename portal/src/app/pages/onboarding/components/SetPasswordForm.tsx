import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  setPassword,
  type ILoginErrorResponse,
  type ISetPasswordPayload,
} from "@/services/authService";

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
import { useAuthStore } from "@/store/authStore";

/**
 *
 * 定义设置新密码表单的校验 Schema
 * 1. 密码强度：符合 PRD 要求的 "6-20位，字母与数字组合"
 * 2. 密码一致性：符合 PRD 要求的 "两次输入的密码不一致"
 */
const setPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "密码必须至少为 6 位")
      .max(20, "密码不能超过 20 位")
      // 规范：使用 Regex 匹配 PRD 强度要求
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/,
        "密码必须是 6-20 位，且包含字母和数字"
      ),
    confirmPassword: z.string().min(1, "请再次输入新密码"),
  })
  // 规范：使用 .refine() 进行跨字段校验，实现你的要求
  .refine((data) => data.newPassword === data.confirmPassword, {
    // PRD 要求的错误信息
    message: "两次输入的密码不一致。",
    // 将此错误附加到 confirmPassword 字段上
    path: ["confirmPassword"],
  });

// Zod Schema 推断出的 TS 类型
type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;

/**
 * SetPasswordForm 组件
 *
 * 职责：
 * 1. 实现 RHF + Zod 表单校验 (含跨字段校验)。
 * 2. 渲染 shadcn/ui 表单 UI。
 * 3. 调用 authService.setPassword 处理表单提交。
 * 4. 处理成功/失败的 UI 状态和路由跳转。
 */
export function SetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // 2. 定义表单提交处理函数
  async function onSubmit(values: SetPasswordFormValues) {
    setIsLoading(true);
    form.clearErrors(); // 清除之前的 API 错误

    try {
      const resp = await setPassword({
        newPassword: values.newPassword,
      } as ISetPasswordPayload);
      setUser(resp.user);

      navigate("/onboarding/bind-wechat"); // (约定路由)
    } catch (error) {
      setIsLoading(false);
      const apiError = error as ILoginErrorResponse;

      // 在表单顶部显示 API 错误
      form.setError("root", {
        type: "api",
        message: apiError.messages || "设置失败，请稍后重试",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* API 错误信息显示区 */}
        {form.formState.errors.root && (
          <FormMessage className="text-center">
            {form.formState.errors.root.message}
          </FormMessage>
        )}

        <div className="space-y-4">
          {/* PRD 需求：输入框 - 新密码 */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>新密码</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请输入 6-20 位，包含字母和数字"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                {/* Zod 强度校验错误信息会显示在这里 */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PRD 需求：输入框 - 确认新密码 */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>确认新密码</FormLabel>
                <FormControl>
                  <Input
                    placeholder="请再次输入新密码"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                {/* Zod .refine() 校验错误信息会显示在这里 */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* PRD 需求：按钮 - [ 确认并继续 ] */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading} // 规范：在 isLoading 状态下禁用按钮
        >
          {isLoading ? "保存中..." : "确认并继续"}
        </Button>
      </form>
    </Form>
  );
}
