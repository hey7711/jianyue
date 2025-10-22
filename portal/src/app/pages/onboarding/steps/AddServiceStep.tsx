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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardDescription, CardTitle } from "@/components/ui/card";

/**
 *
 * 定义步骤 2 (添加服务) 的校验 Schema
 *
 */
const addServiceSchema = z.object({
  // 服务名称: 必填，1-20 字符
  name: z
    .string()
    .min(1, "服务名称不能为空")
    .max(20, "服务名称不能超过 20 个字"),

  // 服务价格: 必填，正数
  // 规范：使用 z.coerce.number() 将 Input (string) 转换为 number
  price: z.coerce
    .number<number>({ error: "请输入有效的价格数字" })
    .positive("服务价格必须为正数"),

  // 服务时长: 必填，正整数
  duration: z.coerce
    .number<number>({ error: "请输入有效的时长数字" })
    .int("服务时长必须为正整数")
    .positive("服务时长必须为正整数"),
});

// Zod Schema 推断出的 TS 类型
type AddServiceFormValues = z.infer<typeof addServiceSchema>;

/**
 * 步骤 2：添加第一个服务表单
 *
 * 职责：
 * 1. 渲染步骤 2 的 RHF + Zod 表单。
 * 2. 校验表单数据。
 * 3. 提交 (点击 下一步) 时：
 * a. 将数据保存到 useOnboardingStore。
 * b. 导航到步骤 3 (/onboarding/add-member)。
 */
export function AddServiceStep() {
  const navigate = useNavigate();

  const setFirstService = useOnboardingStore((state) => state.setFirstService);
  const defaultValues = useOnboardingStore((state) => state.firstService);

  const form = useForm({
    resolver: zodResolver(addServiceSchema),
    // 规范：使用 Store 中的数据作为默认值
    defaultValues: {
      name: defaultValues.name || "",
      price: defaultValues.price || 0,
      duration: defaultValues.duration || 0,
    },
  });

  // 2. 定义表单提交处理函数
  function onSubmit(values: AddServiceFormValues) {
    // 3. 规范：将数据暂存到 Zustand Store
    setFirstService(values);

    // 4. 规范：导航到下一步
    navigate("/onboarding/add-member");
  }

  function handleGoBack() {
    navigate("/onboarding/shop-info");
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CardTitle className="text-xl font-semibold">
          做得很好！现在，添加您的第一个服务
        </CardTitle>
        <CardDescription className="mt-1">
          第二步：告诉顾客您能提供什么
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
                  <FormLabel>服务名称 (必填)</FormLabel>
                  <FormControl>
                    <Input placeholder="例如：经典剪发" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>服务价格 (必填)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="例如：88" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PRD 需求：输入框 - 服务时长 */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>服务时长 (必填)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="例如：60"
                      step="1" // 必须为整数
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>请输入服务所需的总分钟数。</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full space-x-4">
            {/* 规范：(新增) “上一步”按钮 */}
            <Button
              type="button" // 必须是 type="button"，防止触发表单提交
              variant="outline" // 规范：使用次要按钮样式
              className="w-1/3" // 分配宽度
              onClick={handleGoBack}
            >
              上一步
            </Button>

            {/* PRD 需求：按钮 - [ 下一步 ] */}
            <Button type="submit" className="w-2/3">
              下一步
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
