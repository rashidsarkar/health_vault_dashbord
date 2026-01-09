import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/providers/useAuth";
import { useNavigate } from "react-router";

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      // If you have a logout endpoint on your API, call it here
      // await axiosInstanceSecure.post("/auth/logout");
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear authentication state
      logout();

      // Redirect to login
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Still logout even if API call fails
      logout();
      navigate("/login", { replace: true });
    },
  });
};
