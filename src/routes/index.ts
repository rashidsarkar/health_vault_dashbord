import { createBrowserRouter } from "react-router";
import MainLayout from "@/layout/MainLayout";
import Login from "@/page/Login/Login";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     Component: App,
//     children: [
//       {
//         path: "login",
//         Component: Login,
//       },
//       {
//         path: "dashboard",
//         Component: ProtectedRoute,
//         children: [
//           {
//             path: "",
//             Component: DashboardLayout,
//             children: [
//               {
//                 path: "",
//                 Component: Dashboard,
//               },
//               {
//                 path: "users",
//                 Component: Users,
//               },
//               {
//                 path: "settings",
//                 Component: Settings,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ]);

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        path: "/login",
        // index: true,
        Component: Login,
      },
    ],
  },
  //   {
  //     path: "/home",
  //     Component: Home,
  //     // element: <div> Home Page</div>,
  //   },
]);

export default router;
