"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface User {
  name: string;
  email?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data);
      setName(data.name || "");
      setEmail(data.email || "");
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      toast.error("Failed to load user info. Please login again.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      router.push("/admin/login");
    }
  };

  fetchUser();
}, []);


  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const handleUpdateName = async () => {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch("http://localhost:3000/auth/update-name", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update name");
    }

    const updatedUser = await res.json();

    // ✅ تحديث الاسم فقط داخل state و localStorage
    setUser((prev) => ({ ...prev!, name: updatedUser.name }));
    if (user) {
  localStorage.setItem("user", JSON.stringify({ ...user, name: updatedUser.name }));
}

    window.dispatchEvent(new Event("user-updated"));


    toast.success("Name updated successfully");
  } catch (err: any) {
    toast.error(err.message || "Failed to update name");
  }
};

  const handleUpdateEmail = async () => {
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch("http://localhost:3000/auth/update-email", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update email");
    }

    const updatedUser = await res.json();

    // ✅ تحديث الإيميل فقط داخل state و localStorage
    setUser((prev) => ({ ...prev!, email: updatedUser.email }));
    localStorage.setItem("user", JSON.stringify({ ...user, email: updatedUser.email }));

    toast.success("Email updated successfully");
  } catch (err: any) {
    toast.error(err.message || "Failed to update email");
  }
};


  const handleUpdatePassword = async () => {
    try {
      const res = await fetch("http://localhost:3000/auth/update-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update password");
      }

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-card text-foreground p-10">
      <h1 className="text-3xl font-bold mb-4">👤 Profile</h1>

      {user ? (
        <div className="space-y-6 bg-muted p-6 rounded-md border border-border w-full max-w-md">
          {/* الاسم */}
          <div>
            <label className="block mb-1">Name</label>
            <input
              className="w-full p-2 rounded border border-border bg-background text-foreground
"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={handleUpdateName}
              className="mt-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Update Name
            </button>
          </div>

          {/* الإيميل */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded border border-border bg-background text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleUpdateEmail}
              className="mt-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Update Email
            </button>
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block mb-1">Current Password</label>
            <input
              type="password"
              className="w-full p-2 rounded border border-border bg-background text-foreground"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">New Password</label>
            <input
              type="password"
              className="w-full p-2 rounded border border-border bg-background text-foreground"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleUpdatePassword}
              className="mt-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Change Password
            </button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">Loading user info...</p>
      )}
    </div>
  );
}
