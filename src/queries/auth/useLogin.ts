import { useMutation } from "@tanstack/react-query";
import axiosInstancePublic from "@/api/axiosInstancePublic";
import { useAuth } from "@/providers/useAuth";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

interface LoginApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    accessToken: string;
  };
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ErrorResponse {
  message: string;
}

interface DecodedToken {
  id: string;
  profileId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const useLogin = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const response = await axiosInstancePublic.post<LoginApiResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      const accessToken = data.data.accessToken;

      // Decode token to extract user info
      try {
        const decodedToken = jwtDecode<DecodedToken>(accessToken);

        const userData = {
          id: decodedToken.id,
          profileId: decodedToken.profileId,
          email: decodedToken.email,
          role: decodedToken.role,
        };

        // Login to auth context with user data and token
        authLogin(userData, accessToken);

        // Redirect to dashboard
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      console.error("Login error:", message);
    },
  });
};
