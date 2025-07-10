"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <div className="text-4xl mb-4">✨ Thank you for joining us!</div>
        <h2 className="text-lg font-medium text-gray-600 mb-6">
          Let’s set up your restaurant and get you started.
        </h2>

        <Button
          className="w-full text-white text-lg py-6 rounded-md bg-[#00C49A] hover:bg-[#00a885] transition"
onClick={() => router.push("/setup")}
        >
          Let’s get started
        </Button>
      </div>
    </div>
  );
}
