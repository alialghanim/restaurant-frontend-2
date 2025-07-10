"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { Label } from "@/components/ui/label";

type Props = {
  initialValue?: string;
  onChange?: (val: string) => void;
  onValidChange?: (isValid: boolean) => void; // ✅ أضف هذا
  showError?: boolean;
};

export default function RestaurantDomain({
  initialValue = "",
  onChange,
  onValidChange,
  showError,
}: Props) {
  const [domain, setDomain] = useState(initialValue);
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setDomain(initialValue || "");
  }, [initialValue]);

  // 🟢 تحقق من توفر الدومين بعد 500ms من التوقف عن الكتابة
  useEffect(() => {
    const timeout = setTimeout(() => {
      checkDomainAvailability(domain);
    }, 500);

    return () => clearTimeout(timeout);
  }, [domain]);

  useEffect(() => {
  onValidChange?.(domainAvailable === true);
}, [domainAvailable]);

  // 🟢 إبلاغ الأب بأي تغييرات
  useEffect(() => {
    onChange?.(domain);
  }, [domain]);

  // ✅ التحقق من توفر الدومين
  const checkDomainAvailability = async (domain: string) => {
  if (!domain) return setDomainAvailable(null);
  setChecking(true);

  try {
    await api.get(`/restaurants/check-domain/${domain}`);
    setDomainAvailable(true); // ✅ متاح إذا ما رجع خطأ
  } catch (err: any) {
    if (err.response?.status === 409) {
      setDomainAvailable(false); // ❌ موجود فعلاً
    } else {
      console.error("Failed to check domain", err);
      setDomainAvailable(null);
    }
  } finally {
    setChecking(false);
  }
};

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">🌐 Restaurant Domain</Label>
      <p className="text-sm text-muted-foreground">
        This will be used as your store's public address.
      </p>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">yourapp.com/</span>
        <Input
          placeholder="your-restaurant"
          className="max-w-xs"
          value={domain}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^a-zA-Z0-9-_]/g, "");
            setDomain(cleaned);
          }}
        />
      </div>

      {domain && (
        <p className="text-sm mt-1">
          {checking ? (
            <span className="text-gray-500">Checking availability...</span>
          ) : domainAvailable === true ? (
            <span className="text-green-600">✅ Domain is available!</span>
          ) : domainAvailable === false ? (
            <span className="text-red-600">❌ This domain is already taken.</span>
          ) : null}
        </p>
      )}

      {/* Preview box */}
      <div className="mt-4 bg-white border rounded-lg shadow-sm text-sm w-full overflow-hidden">
        <div className="p-4 border-b text-center text-muted-foreground">
          This domain will appear in the browser tab and when sharing the store
        </div>

        <div className="bg-[#004c45] px-4 py-2 flex items-center gap-2">
          <span className="text-white text-sm">🌐</span>
          <div className="flex items-center bg-[#ffffff22] rounded-md px-2 py-1 text-white text-sm gap-1 overflow-hidden">
            <span className="whitespace-nowrap">https://yourapp.com/</span>
            <span className="font-semibold truncate">
              {domain || "your-store-name"}
            </span>
          </div>
        </div>

        {/* Dummy search + products */}
        <div className="p-4 bg-gray-50">
          <div className="bg-white rounded-md border px-3 py-2 flex items-center gap-2 mb-4">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <div className="flex-1 h-4 bg-gray-200 rounded" />
            <div className="w-6 h-6 bg-gray-300 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="border rounded-lg bg-white flex flex-col items-center justify-center p-4 text-center text-xs text-gray-400 h-32"
              >
                <div className="w-12 h-12 bg-gray-100 rounded mb-2 flex items-center justify-center">
                  🖼️
                </div>
                Product Name
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <div className="w-20 h-4 bg-gray-200 rounded" />
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}