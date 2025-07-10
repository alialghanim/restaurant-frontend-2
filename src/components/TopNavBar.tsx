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

export default function TopNavBar({ userName }: { userName?: string }) {
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <div className="bg-[#004c45] text-white px-6 py-3 shadow-md flex justify-between items-center">
      {/* يسار: الشعار والقائمة */}
      <div className="flex items-center gap-8 text-sm font-medium">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-xl">🍽️</span> <span>MyRestaurant</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            <HomeIcon className="w-4 h-4" /> Home
          </span>
          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            <ShoppingBagIcon className="w-4 h-4" /> Orders
          </span>
          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            <Utensils className="w-4 h-4" /> Menu
          </span>
          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            <MegaphoneIcon className="w-4 h-4" /> Marketing
          </span>
          <span className="flex items-center gap-1 hover:underline cursor-pointer">
            <WifiIcon className="w-4 h-4" /> Channels
          </span>
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
