import { type RouteObject } from "react-router";
import LoginPage from "@/app/pages/login";

const router:RouteObject[] = [
    {
        path: "/login",
        Component:LoginPage
    }
]


export default router