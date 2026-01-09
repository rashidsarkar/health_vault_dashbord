import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email: #5C5C5C", email);
    console.log("Password:", password);
    console.log("Remember:", remember);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8FDFF]">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8  w-96 flex flex-col items-center gap-4"
      >
        <img src={logo} alt="logo" className="w-40 h-40" />

        <h2 className="text-xl font-semibold text-[#333333]">
          Login to Account
        </h2>
        <p className="text-sm text-[#333333] text-center">
          Please enter your email and password to continue
        </p>

        <div className="w-full flex flex-col gap-3">
          <Label htmlFor="email" className="text-[#333333]">
            Email address
          </Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-3">
          <Label htmlFor="password" className="text-[#333333]">
            Password
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(!!checked)}
            />
            <Label htmlFor="remember" className="text-[#333333]">
              Remember Password
            </Label>
          </div>
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Forget Password?
          </a>
        </div>

        <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600">
          Sign in
        </Button>
      </form>
    </div>
  );
}
