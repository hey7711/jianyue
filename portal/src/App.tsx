import { createBrowserRouter, RouterProvider } from "react-router";
import adminRouters from "@/admin/pages/index";
import appRouters from "@/app/pages/index";
import "./App.css";
import { Toaster } from "@/components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/admin",
    children: adminRouters,
  },
  {
    path: "",
    children: appRouters,
  },
]);

function App() {
  return <>
    <RouterProvider router={router} />
    <Toaster />
  
  </>
}

export default App;
