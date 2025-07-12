"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Globe, Phone, ShieldCheck, Store, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { MapPin } from "lucide-react";import PhoneInput from "@/components/PhoneInput";
import TopNavBar from "@/components/TopNavBar";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import RestaurantIdentity from "@/components/setup/RestaurantIdentity";
import RestaurantContact from "@/components/setup/RestaurantContact";
import RestaurantDomain from "@/components/setup/RestaurantDomain";
import dynamic from "next/dynamic";
import { useCallback } from "react"; 

const RestaurantLocation = dynamic(() => import("@/components/setup/RestaurantLocation"), {
  ssr: false,
});

const Section = ({
  title,
  icon,
  children,
}: {
  title: React.ReactNode | (() => React.ReactNode);
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("rounded-xl border shadow transition-all duration-300", open ? "bg-[#f9f9f9]" : "bg-white")}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-lg font-semibold"
      >
        <div className="flex items-center gap-2">
          {icon}
          {typeof title === "function" ? title() : title}
        </div>
        {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <div className={cn("border-t px-6 pb-6 pt-2 space-y-4", open ? "block" : "hidden")}>
        {children}
      </div>
    </div>
  );
};


export default function SetupPage() {
const [userName, setUserName] = useState<string>("");
const [restaurantLocation, setRestaurantLocation] = useState<{
  lat: number;
  lng: number;
  address1: string;
  address2: string;
  city: string;
  country: string;
  postcode: string;
} | null>(null);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [storeColor, setStoreColor] = useState("#006941");
  const [logo, setLogo] = useState<string | null>(null);
const [domainName, setDomainName] = useState("");
const [useAccountNumber, setUseAccountNumber] = useState(false);
const [contactNumber, setcontactNumber] = useState("");
const [accountPhone, setAccountPhone] = useState("");
const router = useRouter();
const params = useParams();
const [showDomainError, setShowDomainError] = useState(false);
const [showPhoneError, setShowPhoneError] = useState(false);
const [showLocationError, setShowLocationError] = useState(false);
const [isDomainValid, setIsDomainValid] = useState(false);
const [isRestaurantReady, setIsRestaurantReady] = useState(false);

const restaurantId = params?.restaurantId;

const handleContactChange = useCallback(
  ({ useAccountNumber, contactNumber }: { useAccountNumber: boolean; contactNumber: string }) => {
    setUseAccountNumber(useAccountNumber);
    setcontactNumber(contactNumber);
  },
  []
);

useEffect(() => {
  const storedData = localStorage.getItem("restaurant_identity");
  if (storedData) {
    const parsed = JSON.parse(storedData);
    setRestaurantName(parsed.name || "");
    setRestaurantDescription(parsed.description || "");
    setLogo(parsed.logo || null);
    setStoreColor(parsed.storeColor || "#006941");
  }
}, []);

useEffect(() => {
  
const fetchRestaurantData = async () => {
  try {
    const authRes = await api.get("/auth/me");
    const user = authRes.data;

    let restaurantData;

    try {
      const res = await api.get(`/restaurants/me`);
      restaurantData = res.data;
      
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.log("No restaurant found. Creating new one...");

        const createRes = await api.post("/restaurants");
        restaurantData = createRes.data;
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
localStorage.setItem("user", JSON.stringify({
  ...storedUser,
  restaurantId: restaurantData.id,
}));
      } else {
        throw err;
      }
    }

    // ✅ بعد ما تأكدنا إن عندنا مطعم، نحدث الـ state
    setRestaurantName(restaurantData.name || "");
    setRestaurantDescription(restaurantData.description || "");
    setLogo(restaurantData.logo || "");
    setStoreColor(restaurantData.storeColor || "#006941");
    setDomainName(restaurantData.domainName || "");
    setDomainNameFromAPI(restaurantData.domainName || "");
    setcontactNumber(restaurantData.contactNumber || "");
    setUseAccountNumber(restaurantData.useAccountNumber ?? false);
    setRestaurantLocation(restaurantData.restaurantLocation || null);
    setIsRestaurantReady(true);
  } catch (err) {
    console.error("Failed to load user or restaurant data", err);
  }
};
  fetchRestaurantData();
}, []);

useEffect(() => {
  const identityData = {
    name: restaurantName,
    description: restaurantDescription,
    logo,
    storeColor,
  };
  localStorage.setItem("restaurant_identity", JSON.stringify(identityData));
}, [restaurantName, restaurantDescription, logo, storeColor]);

const stepsCompleted = [
  restaurantName,
  useAccountNumber || contactNumber,
  domainName,
restaurantLocation,
].filter(Boolean).length;

const totalSteps = 4;
const progressPercentage = (stepsCompleted / totalSteps) * 100;

const isIdentityComplete = !!restaurantName;
const isSupportComplete = useAccountNumber || !!contactNumber;
const isDomainComplete = isDomainValid;
const [isLocationComplete, setIsLocationComplete] = useState(false);
const [isSaving, setIsSaving] = useState(false);
const [domainNameFromAPI, setDomainNameFromAPI] = useState("");
const isDomainAlreadySet = !!domainNameFromAPI && domainNameFromAPI === domainName;
const [domainNameInput, setDomainNameInput] = useState(domainName);

const isValid = () => {
  let valid = true;

  if (!restaurantName.trim()) {
    setNameError("Restaurant name is required.");
    valid = false;
  } else {
    setNameError("");
  }

  if (!useAccountNumber && !contactNumber.trim()) {
    setShowPhoneError(true);
    valid = false;
  } else {
    setShowPhoneError(false);
  }

  if (!domainNameInput.trim()) {
    setShowDomainError(true);
    valid = false;
  } else {
    setShowDomainError(false);
  }

  if (
    !restaurantLocation ||
    !restaurantLocation.address1?.trim() ||
    !restaurantLocation.city?.trim() ||
    !restaurantLocation.country?.trim() ||
    !restaurantLocation.postcode?.trim()
  ) {
    setShowLocationError(true);
    valid = false;
  } else {
    setShowLocationError(false);
  }

  return valid;
};

useEffect(() => {
  const complete = [
  restaurantLocation?.address1,
  restaurantLocation?.city,
  restaurantLocation?.country,
  restaurantLocation?.postcode,
].every(val => !!val?.trim());

  setIsLocationComplete(complete);
}, [restaurantLocation]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || "");
      } catch {}
    }
  }, []);

    useEffect(() => {
  const supportData = {
    useAccountNumber,
    contactNumber,
  };
  localStorage.setItem("restaurant_support", JSON.stringify(supportData));
}, [useAccountNumber, contactNumber]);

useEffect(() => {
  if (domainNameInput) {
    localStorage.setItem("restaurant_domain", domainNameInput);
  }
}, [domainNameInput]);


useEffect(() => {
  const storedDomain = localStorage.getItem("restaurant_domain");
  if (storedDomain) {
    setDomainName(storedDomain);
  }
}, []);

useEffect(() => {
  if (restaurantLocation) {
    localStorage.setItem("restaurant_location", JSON.stringify(restaurantLocation));
  }
}, [restaurantLocation]);

useEffect(() => {
  const storedLocation = localStorage.getItem("restaurant_location");
  if (storedLocation) {
    try {
      const parsed = JSON.parse(storedLocation);
      setRestaurantLocation(parsed);
    } catch {}
  }
}, []);

  // اجلب رقم الهاتف من API عند تحميل الصفحة
useEffect(() => {
  const fetchPhone = async () => {
    try {
      const res = await api.get("/auth/me");
      setAccountPhone(res.data.phone);
    } catch (err) {
      console.error("Error loading phone", err);
    }
  };

  fetchPhone();
}, []);

const handleSave = () => {
   if (!isValid()) return;
    console.log({
      restaurantName,
      restaurantDescription,
      storeColor,
      logo,
    });
  };

return isRestaurantReady ? (
      <main className="min-h-screen bg-[#f9fafb]">
      {/* ✅ الشريط الأخضر (TopNavBar) */}
      <TopNavBar userName={userName} />

    {/* باقي الصفحة */}
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
<h2 className="text-xl font-semibold text-[#1f2937]">
  🧾 Restaurant Setup Overview
</h2>

<div className="mb-6">
    <div className="flex justify-between items-center mb-2">
    <h3 className="font-semibold text-lg text-gray-800">
      Compelete <span className="font-semibold text-black">the steps below </span> to launch your restaurant successfully 🚀
    </h3>
    <span className="text-sm text-muted-foreground">{stepsCompleted} / 4</span>
  </div>

  <div className="w-full h-2 bg-gray-200 rounded">
    <div
      className="h-full bg-[#00c49a] rounded transition-all"
      style={{ width: `${progressPercentage}%` }}
    />
  </div>
</div>

<Section
  title={
    <div className="flex items-center gap-2">
      Restaurant Identity
      {isIdentityComplete ? (
        <span className="text-green-500">✔️</span>
      ) : (
        <span className="text-red-500">❗</span>
      )}
    </div>
  }
  icon={<Store className="w-5 h-5 text-primary" />}
>
<RestaurantIdentity
  initialValue={
    isRestaurantReady ? {
      name: restaurantName,
      description: restaurantDescription,
      logo,
      storeColor,
    } : undefined
  }
  nameError={nameError}
  onChange={({ name, description, logo, storeColor }) => {
    setRestaurantName(name);
    setRestaurantDescription(description);
    setLogo(logo);
    setStoreColor(storeColor);
  }}
/>
</Section>

<Section
  title={
    <div className="flex items-center gap-2">
      Customer Support
      {isSupportComplete ? (
        <span className="text-green-500">✔️</span>
      ) : (
        <span className="text-red-500">❗</span>
      )}
    </div>
  }
  icon={<Phone className="w-5 h-5 text-primary" />}
>
  <RestaurantContact
    initialValue={{ useAccountNumber, contactNumber }}
    accountPhone={accountPhone}
    onChange={handleContactChange}
    showError={showPhoneError}
  />
</Section>

<Section
  title={
    <div className="flex items-center gap-2">
      Restaurant Domain
      {isDomainComplete ? (
        <span className="text-green-500">✔️</span>
      ) : (
        <span className="text-red-500">❗</span>
      )}
    </div>
  }
  icon={<Globe className="w-5 h-5 text-primary" />}
>
<RestaurantDomain
  initialValue={domainName}
  onChange={(val) => setDomainNameInput(val)}
  onValidChange={(isValid) => setIsDomainValid(isValid)} // ✅
  showError={showDomainError}
/>
</Section>

<Section
  title={() => (
    <div className="flex items-center gap-2">
      Restaurant Location
      {isLocationComplete ? (
        <span className="text-green-500">✔️</span>
      ) : (
        <span className="text-red-500">❗</span>
      )}
    </div>
  )}
  icon={<MapPin className="w-5 h-5 text-primary" />}
>
<RestaurantLocation
  initialValue={restaurantLocation || undefined}
  onChange={(updated) => {
    setRestaurantLocation(updated);
  }}
  showError={showLocationError}
/>
</Section>

        <div className="border-t pt-6 mt-8 flex flex-col items-center gap-4">
  <div className="flex gap-4 w-full max-w-sm">

<Button
  disabled={isSaving}
  onClick={async () => {
    if (!isValid()) return;

    if (!useAccountNumber && !contactNumber.trim()) {
  setShowPhoneError(true);
  return;
}
setShowPhoneError(false);

    if (!domainNameInput.trim()) {
  setShowDomainError(true);
  return;
}
setShowDomainError(false);

if (
  !restaurantLocation ||
  !restaurantLocation.address1?.trim() ||
  !restaurantLocation.city?.trim() ||
  !restaurantLocation.country?.trim() ||
  !restaurantLocation.postcode?.trim()
) {
  setShowLocationError(true);
  return;
}
setShowLocationError(false);

    try {
      setIsSaving(true);

console.log("Sending data:", {
  name: restaurantName,
  description: restaurantDescription,
  storeColor,
  logo,
  domainName,
  useAccountNumber,
  contactNumber,
  restaurantLocation,
});

const nameAvailable = await api.get(`/restaurants/check-name/${encodeURIComponent(restaurantName)}`);
if (nameAvailable.data.taken) {
  setNameError("This restaurant name is already taken.");
  return;
}

     // 1. الهوية
await api.patch("/restaurants/me/identity", {
  name: restaurantName,
  description: restaurantDescription,
  storeColor,
  logo,
});

// 2. التواصل
await api.patch("/restaurants/me/contact", {
  useAccountNumber,
  contactNumber,
});

// 3. الدومين (فقط لو لم يتم حفظه من قبل)
if (domainNameInput) {
  try {
    await api.patch("/restaurants/me/domain", {
  domainName: domainNameInput,
});
  } catch (err: any) {
    if (err.response?.status === 403) {
      console.warn("Domain already set and cannot be changed");
    } else {
      throw err;
    }
  }
}

// 4. الموقع
if (restaurantLocation) {
  await api.put("/restaurants/me/location", restaurantLocation);
}

// ✅ امسح البيانات المؤقتة من localStorage
localStorage.removeItem("restaurant_identity");
localStorage.removeItem("restaurant_support");
localStorage.removeItem("restaurant_domain");
localStorage.removeItem("restaurant_location");

      const res = await api.get("/restaurants/me");
      const id = res.data?.id;

      if (id) {
        router.push(`/admin/dashboard`);
      } else {
        alert("Failed to retrieve restaurant ID");
      }
    } catch (err) {
      console.error("Failed to complete setup", err);
      alert("Something went wrong during setup");
    } finally {
      setIsSaving(false);
    }
  }}
  className="flex-1 bg-[#1e293b] hover:bg-[#111827] text-white px-6 py-3 text-base font-semibold rounded-md shadow-sm transition"
>
  {isSaving ? "Saving..." : "Finish"}
</Button>
  </div>
</div>

      </div>
    </main>
) : (
  <div className="min-h-screen flex items-center justify-center text-gray-500">
    Loading setup...
  </div>
);
}
