import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QrCode } from 'lucide-react'; 

interface ISupportDialogProps {
  children: React.ReactNode;
}

/**
 * 规范：组件（文件和目录）命名：大驼峰（PascalCase）
 *
 * SupportDialog
 *
 * 职责：
 * 1. 封装一个用于显示客服二维码的 Dialog 模态框。
 * 2. 接收 children 作为 Dialog 的触发器 (Trigger)。
 */
export function SupportDialog({ children }: ISupportDialogProps) {
  return (
    <Dialog>
      {/* 规范：使用 asChild
        这允许我们将触发器 (Trigger) 的功能附加到子组件 (children) 上，
        而不是渲染一个新的 <button> 元素。
      */}
      <DialogTrigger asChild>{children}</DialogTrigger>
      
      {/* 规范：使用 shadcn/ui DialogContent
        并限制最大宽度，以确保在桌面上不会过宽。
      */}
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          {/* PRD 需求：弹出框标题 */}
          <DialogTitle className="text-center">联系专属顾问</DialogTitle>
          {/* PRD 需求：引导用户扫码 */}
          <DialogDescription className="text-center">
            请使用微信扫码添加您的专属顾问
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex w-full justify-center p-4">
          {/* PRD 需求：二维码
            
            这是一个占位符。
            后续请将此 <div> 替换为真实的二维码图片：
            <img src="/path/to/your/qr-code.png" alt="客服二维码" className="h-48 w-48" />
          */}
          <div
            className="flex h-48 w-48 items-center justify-center 
                       rounded-lg border-2 border-dashed border-border 
                       bg-muted/50"
          >
            <QrCode className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}