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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setFieldErrors({});

 if (!form.name || !form.email || !form.password || !form.confirmPassword) {
  setError("Please fill in all required fields.");
  return;
}

  const isStrongPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.password);
  if (!isStrongPassword) {
    setError("Password must be at least 8 characters long and include both letters and numbers.");
    return;
  }

if (!phone) {
    setFieldErrors((prev) => ({ ...prev, phone: true }));
    setError("Phone number is required");
    setIsLoading(false);
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
  const messages = Array.isArray(rawMessage)
    ? rawMessage.map((msg) => msg.toLowerCase?.())
    : [rawMessage?.toLowerCase?.() || ""];

  let shown = false;
  for (const msg of messages) {
    if (msg.includes("email")) {
      setFieldErrors((prev) => ({ ...prev, email: true }));
      shown = true;
    } else if (msg.includes("phone")) {
      setFieldErrors((prev) => ({ ...prev, phone: true }));
      shown = true;
    } else if (msg.includes("name")) {
      setFieldErrors((prev) => ({ ...prev, name: true }));
      shown = true;
    }
  }

  if (!shown && messages[0]) {
    setError(messages[0]);
  }
} finally {
  setIsLoading(false);
}
};

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
      {error && <div className="p-2 bg-red-500 text-white text-center rounded">{error}</div>}

      <Input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
        value={form.name}
        required
        className={fieldErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
      />

     <div className={fieldErrors.phone ? "border border-red-500 p-1 rounded-md" : ""}>
  <PhoneInput
    value={phone}
    onChange={(val) => {
      setPhone(val);
      setFieldErrors((prev) => ({ ...prev, phone: false }));
    }}
  />
</div>
{fieldErrors.phone && !error && (
  <p className="text-sm text-red-500 mt-1">Phone number is already in use</p>
)}

     <Input
  name="email"
  type="email"
  placeholder="Email Address"
  onChange={handleChange}
  value={form.email}
  required
  className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
/>
{fieldErrors.email && (
  <p className="text-sm text-red-500 mt-1">Email is already in use</p>
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
