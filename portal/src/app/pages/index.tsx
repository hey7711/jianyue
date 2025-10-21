import { type RouteObject } from "react-router";
import LoginPage from "@/app/pages/login";
import SetPasswordPage from "./onboarding/SetPasswordPage";

const router: RouteObject[] = [
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/onboarding/set-password",
    Component: SetPasswordPage,
  },
];

export default router;
