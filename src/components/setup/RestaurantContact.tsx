"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import PhoneInput from "@/components/PhoneInput";
import { useRef } from "react";

export default function RestaurantContact({
  initialValue,
  accountPhone,
  onChange,
  showError, // ✅ هذا موجود بس مو مستخدم
}: {
  initialValue?: {
    useAccountNumber: boolean;
    contactNumber: string;
  };
  accountPhone: string;
  onChange?: (data: { useAccountNumber: boolean; contactNumber: string }) => void;
  showError?: boolean;
}) {
  const [useAccountNumber, setUseAccountNumber] = useState(true);
  const [contactNumber, setcontactNumber] = useState("");

  useEffect(() => {
  if (initialValue) {
    setUseAccountNumber(initialValue.useAccountNumber ?? true);
    setcontactNumber(initialValue.contactNumber ?? "");
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ← مهم جدًا نخليها فاضية عشان ما تشتغل كل ما تغير initialValue

const didMountRef = useRef(false);

useEffect(() => {
  if (!didMountRef.current) {
    didMountRef.current = true;
    return; // لا تشغّلي onChange أول مرة
  }

  onChange?.({ useAccountNumber, contactNumber });
}, [useAccountNumber, contactNumber]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-4">
        <label className="text-sm font-medium block">Phone Number</label>
        <p className="text-xs text-muted-foreground">
          Add the number you would like to use to receive your customers’ inquiries.
        </p>

        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="use-account-number"
            className="accent-primary"
            checked={useAccountNumber}
            onChange={(e) => setUseAccountNumber(e.target.checked)}
          />
          <label htmlFor="use-account-number" className="text-sm">
Use the same number registered in your account (<strong>{accountPhone}</strong>)
            <span className="ml-2 text-green-600 font-medium">✔ Verified</span>
          </label>
        </div>

        {!useAccountNumber && (
          <div className="space-y-2">
            <PhoneInput
              value={contactNumber ?? ""}
              onChange={(val) => setcontactNumber(val)}
            />

{showError && !contactNumber.trim() && (
  <p className="text-sm text-red-500">Phone number is required</p>
)}

            <Button
              className="bg-green-100 text-green-700 hover:bg-green-200"
              type="button"
            >
              Send verification code
            </Button>
          </div>
        )}
      </div>

      <div className="bg-[#f6fefe] border border-[#d7f2ec] rounded-xl p-5 text-sm">
        <h4 className="text-sm font-medium text-[#00a885] mb-4 text-center">
          Customer service channels appear in the footer of the store page
        </h4>
        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex items-start gap-3">
            <div className="text-[#00c49a] text-xl">📞</div>
            <div className="flex-1 border-b pb-1">
              <p className="text-xs text-gray-400">Phone</p>
              <p className="text-sm font-medium text-black">
                {useAccountNumber ? accountPhone : contactNumber || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-[#00c49a] text-xl">✉️</div>
            <div className="flex-1 border-b pb-1">
              <p className="text-xs text-gray-400">Email</p>
              <p className="text-sm font-medium text-black">your@email.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-[#00c49a] text-xl">💬</div>
            <div className="flex-1 border-b pb-1">
              <p className="text-xs text-gray-400">WhatsApp</p>
              <p className="text-sm font-medium text-black">+966552507077</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
