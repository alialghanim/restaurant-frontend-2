"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}


interface Category {
  id: string;
  name: string;
  menuId: string;
}

interface Item {
  id: string;
  name: string;
  price: number;
  quantity?: number | null;
  isUnlimited: boolean;
  isAvailable?: boolean;
  description?: string;
  imageUrl?: string;
  categoryId: string;
}

export default function RestaurantBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;
const isNew = restaurantId === "new";

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedImages, setSelectedImages] = useState<{ [key: string]: File | null }>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);


  
useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    router.push("/admin/login");
    return;
  }

  if (isNew) {
    // إعداد مبدئي فارغ
    setRestaurant({ id: "new", name: "", description: "" });
    
    setCategories([]);
    setItems([]);
    return;
  }

const fetchData = async () => {
  try {
    setIsLoading(true);
    setLoadingError(null);
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch restaurant
    const restaurantRes = await api.get(`/restaurants/${restaurantId}`, { headers });
    setRestaurant(restaurantRes.data);

    // Fetch categories
    const categoriesRes = await api.get(`/restaurants/${restaurantId}/categories`, { headers });
    const categoriesData = Array.isArray(categoriesRes.data)
      ? categoriesRes.data
      : categoriesRes.data.data || [];
    setCategories(categoriesData);
// Fetch items for each category
const allItems: Item[] = [];

if (Array.isArray(categoriesData) && categoriesData.length > 0) {
  for (const category of categoriesData) {
    try {
      const res = await api.get(`/restaurants/${restaurantId}/items/for-category/${category.id}`, { headers });

      const categoryItems = Array.isArray(res.data) ? res.data : [];

// ✅ أضف categoryId لأن السيرفر لا يرجعه
const normalizedItems = categoryItems.map((item: any) => ({
  ...item,
  categoryId: category.id,
}));

allItems.push(...normalizedItems);

    } catch (itemsErr: any) {
      console.log(`No items found for category ${category.id}`);
    }
  }
}

setItems(allItems);
setIsLoading(false);

  } catch (err: any) {
    console.error("Error fetching restaurant data:", err);
    setIsLoading(false);
    if (err.response?.status === 404) {
      setLoadingError("Restaurant not found");
      toast.error("Restaurant not found");
      router.push("/admin/dashboard");
    } else if (err.response?.status === 401) {
      setLoadingError("Session expired");
      toast.error("Session expired. Please login again.");
      router.push("/admin/login");
    } else {
      setLoadingError("Failed to load restaurant data");
      toast.error("Failed to load restaurant data. Please try again.");
    }
  }
    };

  fetchData();
}, [restaurantId]);


const fetchItems = async () => {
  const token = localStorage.getItem("access_token");
  if (!token || !selectedCategoryId) return;

  try {
    const res = await api.get(
      `/restaurants/${restaurantId}/items/for-category/${selectedCategoryId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const itemsData = Array.isArray(res.data) ? res.data : [];

    // 🟡 Normalize
    const normalizedItems = itemsData.map((item: any) => ({
  ...item,
  categoryId: item.categories?.[0]?.id ?? selectedCategoryId, // ← هذا مهم
}));


    setItems(normalizedItems);
  } catch (err) {
    console.log("No items found for this category");
    setItems([]);
  }
};


const handleUploadImage = async (itemId: string, file: File) => {
  const token = localStorage.getItem("access_token");
  if (!token || !file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    await api.post(`/restaurants/${restaurantId}/items/${itemId}/upload-image`, formData, {

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Image uploaded");
    fetchItems();
  } catch {
    toast.error("Upload failed");
  }
};

const handleDeleteItem = async (id: string) => {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  try {
    await api.delete(`/restaurants/${restaurantId}/items/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});

    toast.success("Item deleted");
    fetchItems();
  } catch (err) {
    toast.error("Failed to delete item");
  }
};

const handleSaveItem = async (item: Item) => {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  const isNewItem = !item.id || item.id.startsWith("temp-");
 // أو أي شرط منطقي حسب حالتك

  try {
  if (isNewItem) {
    // POST لإنشاء منتج جديد
    const res = await api.post(
      `/restaurants/${restaurantId}/items`,
      {
        name: item.name,
        price: item.price,
        description: item.description,
        quantity: item.isUnlimited ? null : item.quantity,
        isUnlimited: item.isUnlimited,
        isAvailable: item.isAvailable,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const newItem = {
      ...res.data,
      categoryId: item.categoryId, // ضروري
    };

    // ضف العنصر الجديد بدون حذف بقية العناصر
    setItems((prev) => [newItem, ...prev.filter((i) => i.id !== item.id)]);
  } else {
    // PATCH لتحديث منتج موجود
    await api.patch(
      `/menu-items/${item.id}`,
      {
        name: item.name,
        price: item.price,
        description: item.description,
        quantity: item.isUnlimited ? null : item.quantity,
        isUnlimited: item.isUnlimited,
        isAvailable: item.isAvailable,
        categoryId: item.categoryId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // حدث العنصر داخل المصفوفة مباشرة
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...item } : i))
    );
  }

  toast.success("Item saved");
} catch (err) {
  toast.error("Failed to save item");
}



const updateItem = (itemId: string, field: keyof Item, value: any) => {
  setItems((prev) =>
    prev.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    )
  );
};

const handleAddItem = async () => {
  const token = localStorage.getItem("access_token");
  if (!token || !selectedCategoryId) return;

  try {
    const newItem: Item = {
  id: `temp-${Date.now()}`,
  name: "",
  price: 0,
  description: "",
  isUnlimited: false,
  quantity: 1,
  isAvailable: true,
  categoryId: selectedCategoryId,
};


    setItems((prev) => Array.isArray(prev) ? [newItem, ...prev] : [newItem]);
  } catch {
    toast.error("Failed to add item");
  }
};

return (
  <div className="min-h-screen bg-card text-foreground p-8">
    <div className="max-w-6xl mx-auto space-y-6">
      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading restaurant data...</p>
        </div>
      ) : loadingError ? (
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{loadingError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary hover:bg-primary/90 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      ) : isNew ? (
        <p className="text-muted-foreground text-center text-lg mt-10">
          🚧 Start building your restaurant by adding menus and categories.
        </p>
      ) : (
        <>
          {/* ✅ اسم المطعم */}
          <h1 className="text-3xl font-bold">
            {restaurant?.name || "My Restaurant"}
          </h1>

<div className="space-y-2">
  <h2 className="text-xl font-semibold">Categories</h2>
  {categories.length === 0 ? (
    <div className="bg-card p-6 rounded-lg border border-border text-center">
      <p className="text-muted-foreground mb-4">No categories found.</p>
      <p className="text-sm text-muted-foreground">
        Create categories to organize your menu items.
      </p>
    </div>
  ) : (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={cat.id === selectedCategoryId ? "default" : "outline"}
          onClick={() => setSelectedCategoryId(cat.id)}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  )}
</div>


          {selectedCategoryId && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Items</h2>
                <Button onClick={handleAddItem}>Add Item</Button>
              </div>

              {!Array.isArray(items) || items.filter((item) => item.categoryId === selectedCategoryId).length === 0 ? (
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <p className="text-muted-foreground mb-4">
                    No items found in this category yet.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click "Add Item" to create your first menu item.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items
                    .filter((item) => item.categoryId === selectedCategoryId)
                    .map((item) => (
                    <div key={item.id} className="bg-muted p-4 rounded space-y-2">
                      <input
                        className="w-full bg-muted p-2 rounded border border-border"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, "name", e.target.value)
                        }
                        placeholder="Item name"
                      />

                      <input
                        type="number"
                        className="w-full bg-muted p-2 rounded border border-border"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(item.id, "price", parseFloat(e.target.value))
                        }
                        placeholder="Price"
                      />

                      <textarea
                        className="w-full bg-muted p-2 rounded border border-border"
                        value={item.description || ""}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Description"
                      />

                      <div className="flex items-center gap-2">
                        <label>
                          <input
                            type="checkbox"
                            checked={item.isUnlimited}
                            onChange={(e) =>
                              updateItem(item.id, "isUnlimited", e.target.checked)
                            }
                          />{" "}
                          Unlimited
                        </label>
                        {!item.isUnlimited && (
                          <input
                            type="number"
                            className="bg-muted p-2 rounded w-20"
                            value={item.quantity ?? ""}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", parseInt(e.target.value))
                            }
                            placeholder="Qty"
                          />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <label>
                          <input
                            type="checkbox"
                            checked={item.isAvailable ?? true}
                            onChange={(e) =>
                              updateItem(item.id, "isAvailable", e.target.checked)
                            }
                          />{" "}
                          Available
                        </label>
                      </div>

                      <input
                        type="file"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleUploadImage(item.id, e.target.files[0])
                        }
                        className="text-sm"
                      />
                      {item.imageUrl && (
                        <img
                          src={`http://localhost:3000${item.imageUrl}`}
                          alt={item.name}
                          className="rounded w-full h-32 object-cover"
                        />
                      )}

                      <div className="flex justify-between gap-2">
                        <Button className="flex-1" onClick={() => handleSaveItem(item)}>
                          Save
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
}
}