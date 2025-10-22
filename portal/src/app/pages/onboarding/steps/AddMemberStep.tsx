import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useOnboardingStore } from "@/store/onboardingStore";
import { useAuthStore } from "@/store/authStore";

import {
  completeOnboarding,
  type IOnboardingCompletePayload,
  type ILoginErrorResponse, // 复用错误类型
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
import { CardDescription, CardTitle } from "@/components/ui/card";

/**
 *
 * 定义步骤 3 (添加成员) 的校验 Schema
 *
 */
const addMemberSchema = z.object({
  // 姓名: 必填
  name: z.string().min(1, "您的姓名不能为空").max(20, "姓名不能超过 20 个字"),
});

// Zod Schema 推断出的 TS 类型
type AddMemberFormValues = z.infer<typeof addMemberSchema>;

/**
 * 步骤 3：添加第一个成员表单 (并完成)
 *
 * 职责：
 * 1. 渲染步骤 3 的 RHF + Zod 表单。
 * 2. 预填充管理员姓名。
 * 3. 提交 (点击 完成设置) 时：
 * a. 从 useOnboardingStore 收集所有步骤的数据。
 * b. 调用 authService.completeOnboarding 发起原子 API 请求。
 * c. 导航到 /onboarding/complete。
 */
export function AddMemberStep() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const setAdminMember = useOnboardingStore((state) => state.setAdminMember);
  const adminMember = useOnboardingStore((state) => state.adminMember);
  const shopInfo = useOnboardingStore((state) => state.shopInfo);
  const firstService = useOnboardingStore((state) => state.firstService);

  const form = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    // 规范：PRD 需求 "预填充商户管理员姓名"
    // 优先使用 Onboarding Store 中的暂存值，其次使用 Auth Store 中的值
    defaultValues: {
      name: adminMember.name || authUser?.name || "",
    },
  });

  // 2. 定义表单提交处理函数 (关键逻辑)
  async function onSubmit(values: AddMemberFormValues) {
    setIsLoading(true);
    form.clearErrors();

    // a. 暂存本步骤数据 (虽然马上要清空，但保持流程一致性)
    setAdminMember(values);

    // b. 规范：组合所有步骤的数据，准备原子提交
    const payload: IOnboardingCompletePayload = {
      shopInfo: shopInfo,
      firstService: firstService,
      adminMember: values, // 使用当前表单的最新值
    };

    try {
      // c. 规范：调用 Service 函数发起原子 API 请求
      const resp = await completeOnboarding(payload);
      setUser(resp.user);

      // d. 规范：PRD 需求，跳转到“完成引导”页
      navigate("/onboarding/complete");
    } catch (error) {
      // e. 规范：处理 API 异常
      setIsLoading(false);
      const apiError = error as ILoginErrorResponse;
      form.setError("root", {
        type: "api",
        message: apiError.messages || "设置失败，请稍后重试",
      });
    }
  }
  function handleGoBack() {
    navigate("/onboarding/add-service");
  }
  return (
    <div className="space-y-6">
      {/* PRD 需求：步骤标题 */}
      <div className="text-center">
        <CardTitle className="text-xl font-semibold">
          最后一步！确认您的管理员信息
        </CardTitle>
        <CardDescription className="mt-1">
          第三步：您是店铺的第一位成员
        </CardDescription>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* API 错误信息显示区 */}
          {form.formState.errors.root && (
            <FormMessage className="text-center">
              {form.formState.errors.root.message}
            </FormMessage>
          )}

          <div className="space-y-4">
            {/* PRD 需求：输入框 - 姓名 */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>您的姓名 (必填)</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入您的姓名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PRD 需求：只读 - 角色 */}
            <FormItem>
              <FormLabel>角色</FormLabel>
              <FormControl>
                <Input
                  value="商户管理员"
                  disabled // 'disabled' 提供了符合规范的视觉样式
                  readOnly // 'readOnly' 确保其值不会被提交
                  className="text-muted-foreground" // 使用柔和色
                />
              </FormControl>
            </FormItem>
          </div>
          <div className="flex w-full space-x-4">
            {/* 规范：(新增) “上一步”按钮 */}
            <Button
              type="button"
              variant="outline"
              className="w-1/3"
              onClick={handleGoBack}
              disabled={isLoading} // 在提交时也禁用
            >
              上一步
            </Button>

            <Button type="submit" className="w-2/3" disabled={isLoading}>
              {isLoading ? "保存中..." : "完成设置"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
