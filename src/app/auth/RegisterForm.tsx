"use client";

import { useState } from "react";
console.log("🔁 IS APP ROUTER:", typeof window !== "undefined");
import { useRouter } from "next/navigation"; // ✅ هذا الصح في App Router
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhoneInput from "@/components/PhoneInput";
import toast from "react-hot-toast"; // ✅ تأكد أنك أضفته

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ name?: boolean; email?: boolean; phone?: boolean }>({});
const [fieldMessages, setFieldMessages] = useState<{ name?: string; email?: string; phone?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setFieldErrors({});

 const errors: typeof fieldErrors = {};

if (!form.name) errors.name = true;
if (!form.email) errors.email = true;
if (!phone) errors.phone = true;
if (!form.password) setError("Password is required.");
if (!form.confirmPassword) setError("Please confirm your password.");

if (Object.keys(errors).length > 0) {
  setFieldErrors(errors);
  setError("Please fill in all required fields.");
  return;
}

const isStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.password);
if (!isStrongPassword) {
  setError("Password must be at least 8 characters long and include both letters and numbers.");
  return;
}

if (form.password !== form.confirmPassword) {
  setError("Passwords do not match.");
  return;
}

  setIsLoading(true);

 try {
  const res = await api.post("/auth/register", {
    name: form.name,
    email: form.email,
    password: form.password,
    phone: phone,
  });

  const token = res.data.access_token;
  if (token) {
    localStorage.setItem("access_token", token);

    const userRes = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    localStorage.setItem("user", JSON.stringify(userRes.data));

    setForm({ name: "", email: "", password: "", confirmPassword: "" });
setPhone("");
setFieldErrors({});
console.log("✅ Going to /welcome now");
window.location.href = "/welcome";
  }
} catch (err: any) {
  const rawMessage = err?.response?.data?.message;

  const newFieldErrors: typeof fieldErrors = {};
  const newFieldMessages: typeof fieldMessages = {};
  let fallbackMessage = "";

  if (Array.isArray(rawMessage) && typeof rawMessage[0] === "object") {
    rawMessage.forEach((msgObj: { field: string; message: string }) => {
      if (msgObj.field in fieldErrors) {
        newFieldErrors[msgObj.field as keyof typeof fieldErrors] = true;
        newFieldMessages[msgObj.field as keyof typeof fieldMessages] = msgObj.message;
      } else {
        fallbackMessage = msgObj.message;
      }
    });
  } else {
    const messages = Array.isArray(rawMessage)
      ? rawMessage.map((msg) => typeof msg === "string" ? msg.toLowerCase() : "")
      : [typeof rawMessage === "string" ? rawMessage.toLowerCase() : ""];

    for (const msg of messages) {
      if (msg.includes("email")) {
        newFieldErrors.email = true;
        newFieldMessages.email = "Email is already in use";
      } else if (msg.includes("phone")) {
        newFieldErrors.phone = true;
        newFieldMessages.phone = "Phone number is already in use";
      } else if (msg.includes("name")) {
        newFieldErrors.name = true;
        newFieldMessages.name = "Name is already in use";
      } else {
        fallbackMessage = msg;
      }
    }
  }

  setFieldErrors(newFieldErrors);
  setFieldMessages(newFieldMessages);
  if (fallbackMessage) setError(fallbackMessage);
} finally {
  setIsLoading(false);
}
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
    <Input
  name="name"
  placeholder="Full Name"
  onChange={(e) => {
    handleChange(e);
    setFieldErrors((prev) => ({ ...prev, name: false }));
    setFieldMessages((prev) => ({ ...prev, name: "" }));
  }}
  value={form.name}
  required
  className={fieldErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
/>
{fieldMessages.name && (
  <p className="text-sm text-red-500 mt-1">{fieldMessages.name}</p>
)}

   <div className={fieldErrors.phone ? "border border-red-500 p-1 rounded-md" : ""}>
  <PhoneInput
    value={phone}
    onChange={(val) => {
      setPhone(val);
      setFieldErrors((prev) => ({ ...prev, phone: false }));
      setFieldMessages((prev) => ({ ...prev, phone: "" }));
    }}
  />
</div>
{fieldMessages.phone && (
  <p className="text-sm text-red-500 mt-1">{fieldMessages.phone}</p>
)}

   <Input
  name="email"
  type="email"
  placeholder="Email Address"
  onChange={(e) => {
    handleChange(e);
    setFieldErrors((prev) => ({ ...prev, email: false }));
    setFieldMessages((prev) => ({ ...prev, email: "" }));
  }}
  value={form.email}
  required
  className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
/>
{fieldMessages.email && (
  <p className="text-sm text-red-500 mt-1">{fieldMessages.email}</p>
)}

      <div>
        <Input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Must be at least 8 characters and include both letters and numbers.
        </p>
      </div>

      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        onChange={handleChange}
        value={form.confirmPassword}
        required
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By registering, you agree to our terms and privacy policy.
      </p>
        </form>
  );
}
