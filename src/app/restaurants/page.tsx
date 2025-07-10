"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Restaurant {
  id: string;
  name: string;
  location?: string;
  image?: string;
  phone?: string;
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/public/restaurants");
        setRestaurants(res.data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  if (loading) return <p className="text-foreground p-6">Loading...</p>;

  return (
    <main className="min-h-screen p-6 bg-background text-foreground space-y-8">
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Link href="/">
          <Button variant="ghost" className="text-blue-400 hover:underline">
            ← Back to Home
          </Button>
        </Link>
      </div>

      {/* Restaurants Grid */}
      <section>
        <h1 className="text-3xl font-bold mb-6">🏪 Restaurants</h1>
        {restaurants.length === 0 ? (
          <p className="text-muted-foreground">No restaurants found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-card p-6 rounded-lg border border-border"
              >
<div className="bg-card rounded-xl shadow-md border border-border flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
  {/* Image */}
  <div className="w-full h-44 bg-muted border-b border-border flex items-center justify-center">
    {restaurant.image ? (
      <img
        src={`http://localhost:3000${restaurant.image}`}
        alt={restaurant.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          if (img.src.startsWith("http://localhost:3000") && restaurant.image) {
            img.src = restaurant.image;
          }
        }}
      />
    ) : (
      <div className="text-sm text-muted-foreground">No image uploaded</div>
    )}
  </div>

  {/* Content */}
  <div className="p-4 flex-1 flex flex-col justify-between">
    <div className="space-y-1">
      <h2 className="text-lg font-semibold text-foreground truncate">{restaurant.name}</h2>

      {restaurant.phone && (
        <p className="text-sm text-muted-foreground">📞 {restaurant.phone}</p>
      )}

      {restaurant.location && (
        <p className="text-sm text-muted-foreground">📍 {restaurant.location}</p>
      )}
    </div>

    <Link href={`/restaurants/${restaurant.id}`} className="mt-4">
      <Button variant="outline" className="w-full">View Restaurant</Button>
    </Link>
  </div>
</div>


              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
