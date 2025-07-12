"use client";

import { usePathname, useRouter } from "next/navigation";

export default function PageTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { label: "Restaurant Summary", path: "/admin/dashboard" },
    { label: "Restaurant Performance", path: "/admin/dashboard/performance" },
    { label: "Smart Analytics", path: "/admin/dashboard/analytics" },
    { label: "Reports", path: "/admin/dashboard/reports" },
  ];

  return (
    <div className="flex gap-6 border-b pb-2 text-sm font-medium text-muted-foreground">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => router.push(tab.path)}
          className={`pb-1 transition ${
            pathname === tab.path
              ? "text-primary border-b-2 border-primary"
              : "hover:text-primary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
