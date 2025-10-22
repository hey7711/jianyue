import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

/**
 * 规范：组件（文件和目录）命名：大驼峰（PascalCase）
 *
 * OnboardingCompletePage
 *
 * 职责：作为 /onboarding/complete 路由的页面级组件。
 * 1. 显示 PRD 要求的“完成引导”祝贺信息。
 * 2. 停留 3 秒。
 * 3. 自动跳转到后台主页 (/app/appointments)。
 */
export default function OnboardingCompletePage() {
  const navigate = useNavigate();

  // 规范：使用 useEffect 处理副作用（自动跳转）
  useEffect(() => {
    // PRD 需求：页面停留 3 秒
    const timer = setTimeout(() => {
      // PRD 需求：自动跳转至后台主页（默认为“预约”日历页）
      //
      navigate('/app/appointments', { replace: true }); // 使用 replace 避免用户“后退”回此页面
    }, 3000); // 3000 毫秒

    // 规范：组件卸载时清除定时器，防止内存泄漏
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
      {/* 规范：卡片宽度与 Onboarding 流程保持一致 (max-w-md)
      */}
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          {/* PRD 需求：[庆祝性图标] 
            
            我们使用代表“成功”的图标，颜色使用 'success-500'
          */}
          <CheckCircle className="h-16 w-16 text-success" />

          {/* PRD 需求：标题 */}
          <h1 className="mt-4 text-2xl font-semibold">
            恭喜您，基础设置已全部完成！
          </h1>

          {/* PRD 需求：说明 */}
          <p className="mt-2 text-muted-foreground">
            您的“增长伙伴”已准备就绪。
          </p>

          <p className="mt-6 text-sm text-muted-foreground">
            正在跳转到您的专属后台...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}