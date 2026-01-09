import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";
import { useLogin } from "@/queries/auth/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { mutate: loginMutation, isPending, error, isError } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Log email and password
    console.log("Email:", email);
    console.log("Password:", password);

    // Call login mutation
    loginMutation({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8FDFF]">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-96 flex flex-col items-center gap-4"
      >
        <img src={logo} alt="logo" className="w-40 h-40" />

        <h2 className="text-xl font-semibold text-[#333333]">
          Login to Account
        </h2>
        <p className="text-sm text-[#333333] text-center">
          Please enter your email and password to continue
        </p>

        {isError && error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
            <strong>Error:</strong>{" "}
            {(error as any)?.response?.data?.message ||
              "Login failed. Please try again."}
          </div>
        )}

        <div className="w-full flex flex-col gap-3">
          <Label htmlFor="email" className="text-[#333333]">
            Email address
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        <div className="w-full flex flex-col gap-3">
          <Label htmlFor="password" className="text-[#333333]">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            required
          />
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(!!checked)}
              disabled={isPending}
            />
            <Label htmlFor="remember" className="text-[#333333]">
              Remember Password
            </Label>
          </div>
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forget Password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full bg-teal-500 hover:bg-teal-600"
          disabled={isPending}
        >
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
