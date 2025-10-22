import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 规范：导入 Onboarding 专用的 Zustand Store
import { useOnboardingStore } from "@/store/onboardingStore";

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
 * 规范：Zod Schema 定义应与表单组件放在一起。
 *
 * 定义步骤 1 (店铺信息) 的校验 Schema
 *
 */
const shopInfoSchema = z.object({
  // 店铺名称: 必填，1-20 字符
  name: z
    .string()
    .min(1, "店铺名称不能为空")
    .max(20, "店铺名称不能超过 20 个字"),
  // 联系电话: 必填，校验手机或固话格式
  phone: z
    .string()
    .min(1, "联系电话不能为空")
    .regex(
      /^(1\d{10}|(\d{3,4}-)?\d{7,8})$/,
      "请输入正确的 11 位手机号或带区号的固话"
    ),
});

type ShopInfoFormValues = z.infer<typeof shopInfoSchema>;

/**
 * 步骤 1：店铺信息表单
 *
 * 职责：
 * 1. 渲染步骤 1 的 RHF + Zod 表单。
 * 2. 校验表单数据。
 * 3. 提交 (点击 下一步) 时：
 * a. 将数据保存到 useOnboardingStore。
 * b. 导航到步骤 2 (/onboarding/add-service)。
 */
export function ShopInfoStep() {
  const navigate = useNavigate();

  const setShopInfo = useOnboardingStore((state) => state.setShopInfo);
  const defaultValues = useOnboardingStore((state) => state.shopInfo);

  const form = useForm<ShopInfoFormValues>({
    resolver: zodResolver(shopInfoSchema),
    defaultValues: {
      name: defaultValues.name || "",
      phone: defaultValues.phone || "",
    },
  });

  // 2. 定义表单提交处理函数
  function onSubmit(values: ShopInfoFormValues) {
    setShopInfo({
      ...values,
      logoUrl: null,
    });

    // 4. 规范：导航到下一步
    navigate("/onboarding/add-service");
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CardTitle className="text-xl font-semibold">
          欢迎使用！只需三步
        </CardTitle>
        <CardDescription className="mt-1">
          第一步：完善您的店铺信息
        </CardDescription>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>店铺名称 (必填)</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入您的店铺名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>联系电话 (必填)</FormLabel>
                  <FormControl>
                    <Input placeholder="用于顾客联系您" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">
            下一步
          </Button>
        </form>
      </Form>
    </div>
  );
}
