"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Restaurant {
  id: string;
  name: string;
  location?: string;
  image?: string;
}

export default function PublicRestaurantPage() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await api.get(`/public/restaurants/${restaurantId}`);
        setRestaurant(res.data);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  if (loading) return <p className="text-foreground p-6">Loading...</p>;
  if (!restaurant) return <p className="text-red-500 p-6">Restaurant not found</p>;

  return (
    <main className="min-h-screen p-6 bg-background text-foreground space-y-8">
      {/* العودة للوحة التحكم */}
      <Link href="/admin/dashboard">
        <Button variant="ghost" className="text-blue-400 hover:underline">
          ← Return to Admin Panel
        </Button>
      </Link>
      
      <h1 className="text-3xl font-bold">{restaurant.name}</h1>
      {restaurant.location && <p className="text-muted-foreground mb-6">{restaurant.location}</p>}

      {restaurant.image && (
        <div className="w-full h-64 overflow-hidden rounded border border-border bg-muted flex items-center justify-center mb-4">
          <img
            src={`http://localhost:3000${restaurant.image}`}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <section>
        <p className="text-lg text-muted-foreground">
          Restaurant information and details will be displayed here.
        </p>
      </section>
    </main>
  );
}
