"use client";

import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { FaFacebookF, FaYoutube, FaTiktok, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { SiVisa, SiMastercard, SiApplepay } from "react-icons/si";
import api from "@/lib/axios";
import toast from "react-hot-toast";

const socialIcons = [FaFacebookF, FaYoutube, FaTiktok, FaXTwitter, FaInstagram];
const paymentIcons = [SiVisa, SiMastercard, SiApplepay];

type Props = {
  initialValue?: {
    name: string;
    description: string;
    logo: string | null;
    storeColor: string;
  };
  nameError?: string;
  onChange?: (data: {
    name: string;
    description: string;
    logo: string | null;
    storeColor: string;
  }) => void;
  showError?: boolean;
};

const colorOptions = [
  "#f87171", "#60a5fa", "#fbbf24", "#f97316", "#ef4444",
  "#dc2626", "#047857", "#0f766e", "#1e293b", "#ffffff"
];

export default function RestaurantIdentity({ initialValue, nameError, onChange }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [storeColor, setStoreColor] = useState("#006941");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialValue) {
      setName(initialValue.name || "");
      setDescription(initialValue.description || "");
      setLogo(initialValue.logo || null);
      setStoreColor(initialValue.storeColor || "#006941");
    }
  }, [initialValue]);

  useEffect(() => {
    if (onChange) {
      onChange({ name, description, logo, storeColor });
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      if (name.trim().length < 3) return;

      try {
        await api.patch("/restaurants/me", {
          name,
          description,
          logo,
          storeColor,
        });
        toast.success("Restaurant identity saved");
      } catch (err) {
        console.error("Failed to auto save identity", err);
        toast.error("Failed to save identity");
      }
    }, 800);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [name, description, logo, storeColor]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* Left: Form */}
      <div className="space-y-4">
        <label className="text-sm font-medium block mb-1">
          Restaurant Name <span className="text-red-500 text-base">*</span>
        </label>
        <Input
          required
          placeholder="Enter your restaurant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && <p className="text-sm text-red-500">{nameError}</p>}

        <label className="text-sm font-medium block mt-4 mb-1">
          Restaurant Description <span className="text-muted-foreground text-sm">(Optional)</span>
        </label>
        <Textarea
          placeholder="Write a short description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="text-sm font-medium block mt-4 mb-2">
          Store Logo <span className="text-muted-foreground text-sm">(Optional)</span>
        </label>
        <div className="relative w-32 h-32 rounded-full border border-gray-300 bg-white overflow-hidden flex items-center justify-center group">
          {logo ? (
            <>
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              <button
                onClick={() => setLogo(null)}
                className="absolute top-6 right-1.5 bg-white text-red-600 rounded-full p-1 shadow-sm transition-opacity opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <label htmlFor="logoInput" className="flex flex-col items-center justify-center w-full h-full text-gray-400 cursor-pointer hover:text-gray-600">
              <div className="text-4xl">+</div>
              <div className="text-xs mt-1">Add Logo</div>
            </label>
          )}
          <input
            id="logoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setLogo(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>

        <label className="text-sm font-medium block mt-4 mb-2">Store Color</label>
        <div className="flex items-center gap-2 flex-wrap">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => setStoreColor(color)}
              className="w-8 h-8 rounded-full border-2"
              style={{
                backgroundColor: color,
                borderColor: storeColor === color ? "#000" : "transparent",
              }}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-2">{storeColor}</span>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="mt-4 md:mt-0 bg-[#f4f9f8] border rounded-lg p-4 text-sm w-full">
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Your store identity will appear in the header and footer of your store page
        </p>
        <div className="flex flex-col flex-1 rounded-lg overflow-hidden border bg-white p-6">
          <div className="flex items-center gap-3 px-4 py-2" style={{ backgroundColor: storeColor }}>
            <div className="text-white text-xs">yourstore.com</div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search..."
                readOnly
                className="w-full h-7 rounded-md text-sm pl-3 pr-3 placeholder:text-gray-300 text-gray-800 cursor-default"
                style={{ backgroundColor: "white", border: "none", outline: "none" }}
              />
              <div className="absolute top-1.5 right-2 text-gray-400 text-sm">🔍</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4">
            <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                  Logo
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{name || "Restaurant Name"}</h3>
            </div>
          </div>

          <p className="text-xs text-muted-foreground px-4">
            {description || "Your restaurant description will appear here."}
          </p>

          <div className="h-16 bg-gray-100 rounded w-full mt-4" />

          <div className="flex flex-wrap justify-center items-center gap-4 mt-6">
            {socialIcons.map((Icon, index) => (
              <div key={index} className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <Icon className="w-4 h-4" />
              </div>
            ))}
          </div>

          <div className="flex justify-center flex-wrap gap-3 mt-4">
            {paymentIcons.map((Icon, index) => (
              <div key={index} className="h-5 w-10 flex items-center justify-center bg-gray-200 text-gray-500 rounded">
                <Icon className="w-5 h-5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
