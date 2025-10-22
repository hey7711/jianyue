import { useEffect } from "react";
import { useNavigate } from "react-router";
import useSWR from "swr"; // 规范：使用 SWR
import { getWechatBindQr, getWechatBindStatus } from "@/services/authService";

// 规范：使用 shadcn/ui 组件
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// 规范：使用 lucide-react 图标
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"; // 引入 RefreshCw 图标
import { useAuthStore } from "@/store/authStore";

/**
 *
 *
 * 职责：
 * 1. 渲染一个强制的、不可关闭的模态框。
 * 2. 使用 SWR 获取微信绑定二维码。
 * 3. 使用 SWR (带 refreshInterval) 轮询绑定状态。
 * 4. 绑定成功后自动跳转到下一步。
 * 5. 在二维码过期时提供刷新功能。
 */
export default function BindWechatPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  // 1. Hook 1: 获取二维码和 ticket
  const {
    data: qrData,
    error: qrError,
    isLoading: isQrLoading,
    mutate: qrMutate, // 用于重试或刷新
  } = useSWR(
    "/api/v1/auth/wechat-bind-qr", // SWR key
    getWechatBindQr, // Fetcher
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  // 2. Hook 2: 轮询绑定状态
  const { data: statusData } = useSWR(
    qrData ? qrData.ticket : null, // 条件性 key
    getWechatBindStatus, // Fetcher
    {
      refreshInterval: 2000,
      revalidateOnFocus: true,
    }
  );

  // 3. 监听轮询结果并跳转
  useEffect(() => {
    if (statusData?.status === "SUCCESS") {
      // (基于 阶段 0 的确认) 跳转到三步引导流程的第一步
      setUser(statusData.user);
      navigate("/onboarding/shop-info");
    }
  }, [statusData, navigate]);

  // 渲染二维码或加载/错误/过期状态
  const renderQrContent = () => {
    // 状态 1：二维码加载中
    if (isQrLoading) {
      return (
        <div className="flex h-48 w-48 flex-col items-center justify-center rounded-lg bg-muted/50">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">二维码加载中...</p>
        </div>
      );
    }

    // 状态 2：二维码加载失败
    if (qrError) {
      return (
        <div className="flex h-48 w-48 flex-col items-center justify-center rounded-lg bg-destructive/10 p-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="mt-2 text-center text-sm text-destructive">
            二维码加载失败
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => qrMutate()} // SWR 手动重试
            className="mt-4"
          >
            点击重试
          </Button>
        </div>
      );
    }

    // 状态 3：二维码已过期 (来自轮询 hook)
    if (statusData?.status === "EXPIRED") {
      return (
        <div className="flex h-48 w-48 flex-col items-center justify-center rounded-lg bg-muted/50 p-4">
          <RefreshCw className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-center text-sm text-muted-foreground">
            二维码已过期
          </p>
          <Button
            variant="default" // 使用默认（非品牌色）按钮
            size="sm"
            onClick={() => qrMutate()} // 规范：调用 qrMutate 刷新二维码
            className="mt-4"
          >
            获取新二维码
          </Button>
        </div>
      );
    }

    // 状态 4：成功加载二维码
    if (qrData) {
      return (
        <img
          src={`${qrData.qrCodeUrl}`}
          alt="微信绑定二维码"
          className="h-48 w-48 rounded-lg"
        />
      );
    }

    return null; // 默认空状态
  };

  return (
    <Dialog open={true} modal={true}>
      <DialogContent className="sm:max-w-xs" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center">绑定您的个人微信</DialogTitle>
          <DialogDescription className="text-center">
            为了您的账户安全，并能及时接收新预约等重要通知，请使用微信扫码完成绑定。
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full justify-center p-4">
          {renderQrContent()}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {statusData?.status === "PENDING" && "等待扫码..."}
          {statusData?.status === "SCANNED" && "已扫码，请在手机上确认..."}
          {statusData?.status === "EXPIRED" && "二维码已过期，请刷新页面重试"}
        </div>
      </DialogContent>
    </Dialog>
  );
}
