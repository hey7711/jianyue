import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";

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

/**
 * @description Zod Schema for login form validation.
 * This is the single source of truth for our form's validation rules.
 */
const loginFormSchema = z.object({
  phone: z
    .string()
    .length(11, { message: "请输入 11 位的手机号码" })
    .regex(/^1\d{10}$/, { message: "请输入有效的手机号码格式" }),
  password: z
    .string()
    .min(6, { message: "密码长度不能少于 6 位" })
    .max(20, { message: "密码长度不能超过 20 位" }),
});

// Infer the form values type from the Zod schema
// This ensures our form data type is always in sync with our validation rules.
type LoginFormValues = z.infer<typeof loginFormSchema>;

/**
 * @description The login form component.
 * It encapsulates all form-related logic, including state management, validation, and submission.
 */
export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define the form.
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true);
    console.log("Form submitted with values:", values);
    // TODO: Implement the actual API call for authentication here.
    // e.g., const response = await authApi.login(values);
    // Handle success or error cases based on the response.

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 15000));

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机号</FormLabel>
              <FormControl>
                <Input placeholder="请输入您的手机号" {...field} />
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
                  type="password"
                  placeholder="请输入您的密码"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}登 录
        </Button>
      </form>
    </Form>
  );
}
