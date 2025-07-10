import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types/restaurant";

interface RestaurantFormProps {
  restaurant: Restaurant;
  isNew: boolean;
  isSaving: boolean;
  onSubmit: (e: FormEvent) => void;
  onUpdate: (field: keyof Restaurant, value: string) => void;
  onImageUpload: (file: File) => void;
}

export function RestaurantForm({
  restaurant,
  isNew,
  isSaving,
  onSubmit,
  onUpdate,
  onImageUpload,
}: RestaurantFormProps) {
  const [restaurantImagePreview, setRestaurantImagePreview] = useState<string | null>(null);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-muted p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">Restaurant Information</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">Restaurant Name</label>
          <input
            type="text"
            className="w-full bg-background p-3 rounded border border-border"
            value={restaurant.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            placeholder="Enter restaurant name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <input
            type="text"
            className="w-full bg-background p-3 rounded border border-border"
            value={restaurant.location || ""}
            onChange={(e) => onUpdate("location", e.target.value)}
            placeholder="Enter restaurant location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            className="w-full bg-background p-3 rounded border border-border"
            value={restaurant.description || ""}
            onChange={(e) => onUpdate("description", e.target.value)}
            placeholder="Enter restaurant description"
            rows={4}
          />
        </div>

        {!isNew && (
          <div>
            <label className="block text-sm font-medium mb-2">Restaurant Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImageUpload(file);
                  const previewUrl = URL.createObjectURL(file);
                  setRestaurantImagePreview(previewUrl);
                }
              }}
              className="w-full bg-background p-3 rounded border border-border"
            />

            {(restaurantImagePreview || restaurant.imageUrl) && (
              <div className="mt-4">
                <img
                  src={
                    restaurantImagePreview
                      ? restaurantImagePreview
                      : `http://localhost:3000${restaurant.imageUrl}`
                  }
                  alt={restaurant.name}
                  className="rounded w-full max-w-md h-48 object-cover"
                />
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSaving || !restaurant?.name}
          className="w-full"
        >
          {isSaving ? "Saving..." : isNew ? "Create Restaurant" : "Update Restaurant"}
        </Button>
      </div>
    </form>
  );
}
