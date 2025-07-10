"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import TopNavBar from "@/components/TopNavBar"; // ✅ تأكد أنك استوردت التوب بار

interface User {
  name: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    router.push("/auth");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      handleLogout();
      return;
    }

    const fetchUser = () => {
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Failed to fetch user", err);
          handleLogout();
        });
    };

    fetchUser();
    const handleUserUpdate = () => fetchUser();
    window.addEventListener("user-updated", handleUserUpdate);
    return () => window.removeEventListener("user-updated", handleUserUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* ✅ Top Navigation Bar */}
      <TopNavBar userName={user?.name} />

      {/* ✅ Main Content */}
      <main className="max-w-7xl mx-auto py-10 px-6">{children}</main>
    </div>
  );
}
