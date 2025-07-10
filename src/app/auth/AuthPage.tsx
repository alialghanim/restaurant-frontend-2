"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Image from "next/image";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
<main className="min-h-screen flex flex-col md:flex-row bg-muted">
      {/* Left Content (Visual/Marketing) */}
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-12">
        <div className="space-y-6">
          <Image
            src="/auth/auth-placeholder-banner.png"
            alt="Auth Banner"
            width={500}
            height={500}
            className="rounded-xl shadow-lg"
          />

          <h2 className="text-xl font-semibold text-center text-muted-foreground">
           {tab === "login"
  ? "Welcome back! Sign in to continue"
  : "Join us and start your journey"}
          </h2>
        </div>
      </div>

      {/* Right Content (Form) */}
      <div className="w-full md:w-1/2 bg-background flex flex-col justify-center px-8 py-12">
        <div className="mb-8 flex justify-center space-x-2">
          <button
  type="button"
  onClick={() => setTab("login")}
  className={`focus:outline-none focus:ring-2 ring-primary px-6 py-2 rounded-full text-sm font-medium ${
    tab === "login"
      ? "bg-primary text-white"
      : "bg-muted text-muted-foreground"
  }`}
>
  Login
</button>
          <button
            onClick={() => setTab("register")}
            className={`px-6 py-2 rounded-full text-sm font-medium ${
              tab === "register"
                ? "bg-primary text-white"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        {tab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </main>
  );
}
