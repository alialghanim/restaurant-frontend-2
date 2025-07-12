"use client";

import {
  Home as HomeIcon,
  ShoppingBag as ShoppingBagIcon,
  Box as BoxIcon,
  Megaphone as MegaphoneIcon,
  Wifi as WifiIcon,
  UserCircle as UserCircleIcon,
  LogOut as LogOutIcon,
} from "lucide-react";
import { Utensils, Salad, Pizza, Soup } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function TopNavBar({ userName }: { userName?: string }) {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };
const router = useRouter();
const pathname = usePathname();

  return (
    <div className="bg-[#004c45] text-white px-6 py-3 shadow-md flex justify-between items-center">
      {/* يسار: الشعار والقائمة */}
      <div className="flex items-center gap-8 text-sm font-medium">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-xl">🍽️</span> <span>MyRestaurant</span>
        </div>

<div className="flex items-center gap-6">
  <button
    onClick={() => router.push("/admin/dashboard")}
    className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded ${
      pathname === "/admin/dashboard"
        ? "bg-white text-[#004c45] font-semibold"
        : "hover:bg-white/10"
    }`}
  >
    <HomeIcon className="w-4 h-4" /> Home
  </button>

  <button
    onClick={() => router.push("/admin/orders")}
    className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded ${
      pathname === "/admin/orders"
        ? "bg-white text-[#004c45] font-semibold"
        : "hover:bg-white/10"
    }`}
  >
    <ShoppingBagIcon className="w-4 h-4" /> Orders
  </button>

  <button
    onClick={() => router.push("/admin/menu")}
    className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded ${
      pathname === "/admin/menu"
        ? "bg-white text-[#004c45] font-semibold"
        : "hover:bg-white/10"
    }`}
  >
    <Utensils className="w-4 h-4" /> Menu
  </button>

  <button
    onClick={() => router.push("/admin/marketing")}
    className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded ${
      pathname === "/admin/marketing"
        ? "bg-white text-[#004c45] font-semibold"
        : "hover:bg-white/10"
    }`}
  >
    <MegaphoneIcon className="w-4 h-4" /> Marketing
  </button>

  <button
    onClick={() => router.push("/admin/channels")}
    className={`flex items-center gap-1 cursor-pointer px-3 py-1 rounded ${
      pathname === "/admin/channels"
        ? "bg-white text-[#004c45] font-semibold"
        : "hover:bg-white/10"
    }`}
  >
    <WifiIcon className="w-4 h-4" /> Channels
  </button>
</div>
      </div>

      {/* يمين: المستخدم وتسجيل الخروج */}
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <UserCircleIcon className="w-5 h-5 text-white/80" />
          <span>
            Welcome, <span className="font-semibold">{userName || "User"}</span>
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-white/80 hover:text-white transition"
        >
          <LogOutIcon className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
