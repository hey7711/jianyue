import { type RouteObject } from "react-router";
import LoginPage from "@/app/pages/login";
import SetPasswordPage from "./onboarding/SetPasswordPage";
import BindWechatPage from "./onboarding/BindWechatPage";

const router: RouteObject[] = [
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/onboarding/set-password",
    Component: SetPasswordPage,
  },
  {
    path: "/onboarding/bind-wechat",
    Component: BindWechatPage,
  },
];

export default router;
