import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "@/layout/MainLayout";
import Login from "@/page/Login/Login";
import Dashboard from "@/page/Dashboard/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
