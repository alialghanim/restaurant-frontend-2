"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const accessToken = res.data.access_token;

if (accessToken) {
  localStorage.setItem("access_token", accessToken);

  const userRes = await api.get("/auth/me", {
  headers: { Authorization: `Bearer ${accessToken}` },
});

const user = userRes.data;
const restaurantId = user?.restaurant?.id;

if (!restaurantId) {
  throw new Error("No restaurant associated with user.");
}
  localStorage.setItem("restaurantId", restaurantId);
  localStorage.setItem("user", JSON.stringify({ ...user, restaurantId }));

  router.push("/admin/dashboard");
}

    } catch (err: any) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      // ❗ استخدم الرسالة من axios مباشرة
      const errorMessage = err?.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى";
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
      {loginError && (
        <div
          role="alert"
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4 text-center"
        >
          {loginError}
        </div>
      )}

      <div>
        <label className="block mb-1 text-sm"> Email Address</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          autoComplete="email"
          required
        />
      </div>

      <div>
  <label className="block mb-1 text-sm">Password</label>
  <Input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    autoComplete="current-password"
    required
  />
</div>

      <Button type="submit" className="w-full" disabled={isLoading}>
  {isLoading ? "Logging in..." : "Log in"}
</Button>
    </form>
  );
}