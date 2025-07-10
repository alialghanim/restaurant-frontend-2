"use client";

import { useEffect, useState } from "react";
import {
  CreditCardIcon,
  ShoppingBagIcon,
  EyeIcon,
  WalletIcon,
  ArrowRightIcon,
} from "lucide-react";
import PageTabs from "@/components/PageTabs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import Link from "next/link";

export default function DashboardHomePage() {
  const [userName, setUserName] = useState("User");
  const [summaryType, setSummaryType] = useState<"daily" | "monthly">("monthly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserName(parsed.name || "User");
    }
  }, []);

  useEffect(() => {
    if (summaryType === "daily") {
      setSelectedDate(new Date());
    } else {
      const now = new Date();
      setSelectedDate(new Date(now.getFullYear(), now.getMonth(), 1));
    }
  }, [summaryType]);

  return (
    <div className="space-y-8">
      {/* الترحيب */}
      <div>
        <h1 className="text-2xl font-bold">Welcome, {userName} </h1>
        <p className="text-muted-foreground">Wishing you a successful day!</p>
      </div>

      {/* التبويبات */}
      <PageTabs />

      {/* التاريخ + نوع التقرير */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-sm font-medium">
          {summaryType === "daily"
            ? `Summary for ${format(selectedDate, "EEEE, d MMMM yyyy")}`
            : `Summary for ${format(selectedDate, "MMMM yyyy")}`}
        </div>

        <div className="flex items-center gap-4">
          <SummaryTabs selected={summaryType} onChange={setSummaryType} />
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              if (date) setSelectedDate(date);
            }}
            dateFormat={summaryType === "daily" ? "dd/MM/yyyy" : "MM/yyyy"}
            showMonthYearPicker={summaryType === "monthly"}
            showMonthDropdown
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={30}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* الإحصائيات + Quick Nav */}
      <div className="md:flex md:gap-6">
        {/* الإحصائيات والطلبات الأخيرة */}
        <div className="md:w-2/3 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <StatCard icon={<EyeIcon />} label="Visits" value="0" />
            <StatCard icon={<ShoppingBagIcon />} label="Orders" value="0" />
            <StatCard icon={<CreditCardIcon />} label="Sales" value="SAR 0.00" />
            <StatCard icon={<WalletIcon />} label="Balance" value="SAR 0.00" />
          </div>

          <div className="bg-white border rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <p className="text-muted-foreground">No recent orders yet.</p>
          </div>
        </div>

        {/* ✅ Quick Nav */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow space-y-3">
  <h2 className="text-lg font-semibold mb-2">Quick Nav</h2>
  <QuickNavItem
  label="Store Balance"
  value="SAR 0.00"
  icon={<WalletIcon className="w-5 h-5" />}
  href="/admin/payments/store"
/>
<QuickNavItem
  label="Electronic Payment Balance"
  value="SAR 0.00"
  icon={<CreditCardIcon className="w-5 h-5" />}
  href="/admin/payments/electronic"
/>
<QuickNavItem
  label="Cash on Delivery Payment Balance"
  value="SAR 0.00"
  icon={<ShoppingBagIcon className="w-5 h-5" />}
  href="/admin/payments/cash"
/>
<QuickNavItem
  label="Q&A and Ratings"
  value="0"
  icon={<EyeIcon className="w-5 h-5" />}
  hasAlert
  href="/admin/ratings"
/>
<QuickNavItem
  label="Discount Coupons"
  value="0"
  icon={<CreditCardIcon className="w-5 h-5" />}
  href="/admin/coupons"
/>
<QuickNavItem
  label="Special Offers"
  value="0"
  icon={<ShoppingBagIcon className="w-5 h-5" />}
  href="/admin/offers"
/>

</div>

        </div>
      </div>
    </div>
  );
}

// مكون Quick Nav

function QuickNavItem({
  label,
  value,
  icon,
  href = "#",
  hasAlert = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  href?: string;
  hasAlert?: boolean;
}) {
  return (
<Link href={href} className="block mb-2">
      <div className="flex items-center justify-between border rounded-lg p-4 hover:shadow transition bg-white">
        <div className="flex items-center gap-4">
          <div className="bg-muted p-2 rounded-full text-primary">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{value}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasAlert && (
            <span className="bg-red-500 text-white rounded-full text-xs px-2 py-0.5">0</span>
          )}
          <ArrowRightIcon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </Link>
  );
}


// مكون كرت إحصائي
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow flex items-center gap-4">
      <div className="text-2xl text-primary">{icon}</div>
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="font-semibold text-lg">{value}</p>
      </div>
    </div>
  );
}

// مكون تبويبات daily/monthly
function SummaryTabs({
  selected,
  onChange,
}: {
  selected: "daily" | "monthly";
  onChange: (value: "daily" | "monthly") => void;
}) {
  return (
    <div className="flex gap-4 text-sm font-medium text-muted-foreground">
      <button
        className={selected === "daily" ? "text-primary underline" : "hover:text-primary"}
        onClick={() => onChange("daily")}
      >
        Daily
      </button>
      <button
        className={selected === "monthly" ? "text-primary underline" : "hover:text-primary"}
        onClick={() => onChange("monthly")}
      >
        Monthly
      </button>
    </div>
  );
}
