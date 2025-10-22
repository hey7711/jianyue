import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";

// 规范：使用 shadcn/ui 组件
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// 规范：使用 lucide-react 图标库
import { User, Settings, Lock, LogOut, MessageCircle } from "lucide-react";

/**
 * 规范：组件（文件和目录）命名：大驼峰（PascalCase）
 *
 * UserNav
 *
 * 职责：渲染顶部通栏右侧的用户头像下拉菜单。
 * 1. 从 useAuthStore 获取用户信息显示头像和名称。
 * 2. 提供个人设置相关操作的链接。
 * 3. 提供退出登录功能。
 */
export function UserNav() {
  // 规范：从 Zustand Store 获取用户信息和登出 action

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // 获取用户姓名首字母作为 Avatar Fallback
  const getInitials = (name: string | undefined): string => {
    if (!name) return "?";
    // 简单取第一个字
    return name.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    // 规范：使用硬跳转确保完全重置状态
    window.location.href = "/login";
    // navigate('/login', { replace: true }); // 或者使用 navigate
  };

  return (
    <DropdownMenu>
      {/* 规范：触发器是一个包含 Avatar 的 Button */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            {/* TODO: 未来可以添加用户真实头像 */}
            <AvatarImage
              src={user?.avatarUrl /* 假设未来有头像字段 */}
              alt={user?.name}
            />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* 规范：下拉菜单内容 */}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* 显示用户姓名和角色 */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.role} {/* TODO: 可能需要将角色 Key 转换为中文 */}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* 规范：菜单项组 */}
        <DropdownMenuGroup>
          {/* PRD 需求：修改我的资料 */}
          <DropdownMenuItem asChild>
            <Link to="/app/settings/profile">
              {" "}
              {/* 暂定路径 */}
              <User className="mr-2 h-4 w-4" />
              <span>个人资料</span>
            </Link>
          </DropdownMenuItem>
          {/* PRD 需求：修改密码 */}
          <DropdownMenuItem asChild>
            <Link to="/app/settings/password">
              {" "}
              {/* 暂定路径 */}
              <Lock className="mr-2 h-4 w-4" />
              <span>修改密码</span>
            </Link>
          </DropdownMenuItem>
          {/* PRD 需求：管理微信绑定 */}
          <DropdownMenuItem asChild>
            <Link to="/app/settings/wechat">
              {" "}
              {/* 暂定路径 */}
              <MessageCircle className="mr-2 h-4 w-4" />
              <span>微信绑定</span>
            </Link>
          </DropdownMenuItem>
          {/* 其他通用设置（如果需要） */}
          <DropdownMenuItem asChild>
            <Link to="/app/settings">
              {" "}
              {/* 指向设置主页 */}
              <Settings className="mr-2 h-4 w-4" />
              <span>设置</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {/* PRD 需求：退出登录 */}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
