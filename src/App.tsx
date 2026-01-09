import { AuthProvider } from "@/providers/AuthProvider";
import { RouterProvider } from "react-router";
import router from "@/routes/index";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
