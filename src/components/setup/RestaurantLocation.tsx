"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios"; // تأكد من وجود هذا المسار الصحيح
import { OpenStreetMapProvider } from 'leaflet-geosearch';

function ClickHandler({
  setCoords,
  fetchAddress,
}: {
  setCoords: (coords: { lat: number; lng: number }) => void;
  fetchAddress: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });
      fetchAddress(lat, lng);
    },
  });
  return null;
}

// أيقونة المؤشر
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({
  position,
  setPosition,
  fetchAddress,
}: {
  position: { lat: number; lng: number } | null;
  setPosition: (coords: { lat: number; lng: number }) => void;
  fetchAddress: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  return position &&
    typeof position.lat === "number" &&
    typeof position.lng === "number" &&
    !isNaN(position.lat) &&
    !isNaN(position.lng) ? (
    <Marker position={position} icon={markerIcon} />
  ) : null;
}

function LocateButton({ onClick }: { onClick: () => void }) {
  const map = useMap();

  useEffect(() => {
    if (!map || document.getElementById("locate-btn")) return;

    const controlDiv = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    controlDiv.id = "locate-btn";
    controlDiv.innerHTML = "📍";
    controlDiv.title = "Use my current location";
    Object.assign(controlDiv.style, {
      backgroundColor: "#fff",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
      borderRadius: "4px",
      cursor: "pointer",
      marginBottom: "10px",
    });

    controlDiv.onclick = onClick;

    const customControl = new L.Control({ position: "bottomright" });
    customControl.onAdd = () => controlDiv;
    customControl.addTo(map);
  }, [map, onClick]);

  return null;
}

function MapRefSaver({ setMap }: { setMap: (map: L.Map) => void }) {
  const map = useMap();

  useEffect(() => {
    setMap(map);
  }, [map]);

  return null;
}

type RestaurantLocationProps = {
  initialValue?: {
    lat: number;
    lng: number;
    address1: string;
    address2: string;
    city: string;
    country: string;
    postcode: string;
  };
  onChange?: (location: {
    lat: number;
    lng: number;
    address1: string;
    address2: string;
    city: string;
    country: string;
    postcode: string;
  }) => void;
  showError?: boolean;
};

export default function RestaurantLocation({ initialValue, onChange }: RestaurantLocationProps) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [formAddress, setFormAddress] = useState({
    address1: "",
    address2: "",
    city: "",
    country: "",
    postcode: "",
  });

  const mapRef = useRef<L.Map | null>(null);

  // ✅ Notify parent with every change
useEffect(() => {
  if (!coords || !onChange) return;

  onChange({
    lat: coords.lat,
    lng: coords.lng,
    ...formAddress,
  });
}, [coords, formAddress]);

  useEffect(() => {
  if (
    !coords &&
    initialValue &&
    !isNaN(initialValue.lat) &&
    !isNaN(initialValue.lng)
  ) {
    setCoords({ lat: initialValue.lat, lng: initialValue.lng });
    setFormAddress({
      address1: initialValue.address1,
      address2: initialValue.address2,
      city: initialValue.city,
      country: initialValue.country,
      postcode: initialValue.postcode,
    });
  }
}, [coords, initialValue]);

const fetchAddress = async (lat: number, lng: number) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    const { address } = data;

    const newAddress = {
      address1: `${address.road || ""} ${address.house_number || ""}`.trim(),
      address2: "",
      city: address.city || address.town || address.village || "",
      country: address.country || "",
      postcode: address.postcode || "",
    };

    setFormAddress(newAddress);

    if (onChange) {
      onChange({
        lat,
        lng,
        ...newAddress,
      });
    }
  } catch (err) {
    console.error("Failed to fetch address", err);
  }
};

  
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCoords = { lat: latitude, lng: longitude };
        setCoords(newCoords);
        fetchAddress(latitude, longitude);
        mapRef.current?.flyTo([latitude, longitude], 16, { duration: 1.5 });
      },
      (err) => {
        console.error(err);
        alert("Could not get location");
      }
    );
  };

  // ✅ Auto save when coords or formAddress changes
  useEffect(() => {
    if (!coords) return;

    const save = async () => {
      try {
        await api.put("/restaurants/me/location", {
          lat: coords.lat,
          lng: coords.lng,
          ...formAddress,
        });
        // Optional: Show toast or feedback
      } catch (err) {
        console.error("Failed to auto save location", err);
      }
    };

    save();
  }, [coords, formAddress]);

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium flex items-center gap-2">
        📍 Restaurant Location
      </Label>
      <p className="text-sm text-muted-foreground mb-2">
        Click on the map or use your current location to select your restaurant location.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: Address Form */}
        <div className="space-y-3">
          <div>
            <Label>Address Line 1</Label>
            <Input
              value={formAddress.address1}
              onChange={(e) =>
                setFormAddress({ ...formAddress, address1: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Address Line 2 (Optional)</Label>
            <Input
              value={formAddress.address2}
              onChange={(e) =>
                setFormAddress({ ...formAddress, address2: e.target.value })
              }
            />
          </div>
          <div>
            <Label>City</Label>
            <Input
              value={formAddress.city}
              onChange={(e) =>
                setFormAddress({ ...formAddress, city: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input
              value={formAddress.country}
              onChange={(e) =>
                setFormAddress({ ...formAddress, country: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Post Code</Label>
            <Input
              value={formAddress.postcode}
              onChange={(e) =>
                setFormAddress({ ...formAddress, postcode: e.target.value })
              }
            />
          </div>
        </div>

       {/* Right side: Map */}
<div>
  {/* 🔍 Search Field */}
  <div className="mb-3">
    <Input
      type="text"
      placeholder="Search for a location..."
   onKeyDown={async (e) => {
  if (e.key === "Enter") {
    const value = (e.target as HTMLInputElement).value;
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: value });

    const result = results[0];
    if (
      result &&
      typeof result.y === "number" &&
      typeof result.x === "number" &&
      !isNaN(result.y) &&
      !isNaN(result.x)
    ) {
      const newCoords = { lat: result.y, lng: result.x };
      setCoords(newCoords);
      fetchAddress(result.y, result.x);
      mapRef.current?.flyTo([result.y, result.x], 16, { duration: 1.5 });
    } else {
      alert("No valid location found.");
    }
  }
}}
    />
  </div>
  
<MapContainer
  center={
    coords &&
    typeof coords.lat === "number" &&
    typeof coords.lng === "number" &&
    !isNaN(coords.lat) &&
    !isNaN(coords.lng)
      ? [coords.lat, coords.lng]
      : [24.7136, 46.6753] // fallback
  }
  zoom={16}
  scrollWheelZoom={true}
  style={{ height: 300, borderRadius: 10 }}
>
  <MapRefSaver setMap={(mapInstance) => (mapRef.current = mapInstance)} />
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution="© OpenStreetMap contributors"
  />

  <LocateButton onClick={handleUseMyLocation} />

  {/* ✅ الكليك يشتغل دائمًا */}
  <ClickHandler
    setCoords={(newCoords) => {
      setCoords(newCoords);
      fetchAddress(newCoords.lat, newCoords.lng);
    }}
    fetchAddress={fetchAddress}
  />

  {/* ✅ الماركر يظهر فقط إذا في احداثيات */}
  {coords &&
    typeof coords.lat === "number" &&
    typeof coords.lng === "number" &&
    !isNaN(coords.lat) &&
    !isNaN(coords.lng) && (
      <Marker position={coords} icon={markerIcon} />
  )}
</MapContainer>
          {coords && (
            <p className="text-sm mt-2">
              <span className="font-medium">Selected:</span>{" "}
              {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} —{" "}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Open in Google Maps
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
