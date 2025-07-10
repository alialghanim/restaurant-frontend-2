import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Item, Category } from "@/types/restaurant";

interface ItemEditCardProps {
  item: Item;
  categories: Category[];
  restaurantId: string;
  onItemUpdate: (updater: (items: Item[]) => Item[]) => void;
  onItemDelete: (categoryId: string, itemId: string) => void;
  onFetchData: () => void;
}

export function ItemEditCard({
  item,
  categories,
  restaurantId,
  onItemUpdate,
  onItemDelete,
  onFetchData
}: ItemEditCardProps) {
  const handleSaveItem = async () => {
    try {
      if (!item.categoryIds || item.categoryIds.length === 0) {
        toast.error("لا يوجد تصنيفات مضافة لهذا المنتج");
        return;
      }

      for (const categoryId of item.categoryIds) {
        const formData = new FormData();
        formData.append("name", item.name);
        formData.append("description", item.description || "");
        formData.append("price", String(item.price));
        formData.append("quantity", item.quantity === null ? "" : String(item.quantity));
        formData.append("categoryId", categoryId);

        await api.patch(
          `/restaurants/${restaurantId}/categories/${categoryId}/items/${item.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (item.file) {
          const imageForm = new FormData();
          imageForm.append("file", item.file);
          await api.post(
            `/restaurants/${restaurantId}/categories/${categoryId}/items/${item.id}/upload-image`,
            imageForm,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }
      }

      toast.success("تم الحفظ");
      await onFetchData();
    } catch (err) {
      console.error(err);
      toast.error("فشل الحفظ");
    }
  };

  const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    
    if (selected.includes("add-new")) {
      const name = prompt("أدخل اسم التصنيف الجديد:");
      if (name) {
        try {
          const res = await api.post(`/restaurants/${restaurantId}/categories`, { name });
          await onFetchData();
          onItemUpdate((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? {
                    ...it,
                    categoryIds: [
                      ...selected.filter((id) => id !== "add-new"),
                      res.data.id,
                    ],
                  }
                : it
            )
          );
          toast.success("تمت إضافة التصنيف");
        } catch (err) {
          console.error(err);
          toast.error("فشل إضافة التصنيف");
        }
      }
    } else {
      onItemUpdate((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, categoryIds: selected } : it
        )
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-white border border-border rounded-lg shadow-md p-4 gap-4">
      {/* صورة المنتج */}
      <div className="w-full md:w-40 flex-shrink-0">
        <label className="block text-sm font-medium mb-1">صورة المنتج</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const previewUrl = URL.createObjectURL(file);
              onItemUpdate((prev) =>
                prev.map((it) =>
                  it.id === item.id ? { ...it, imageUrl: previewUrl, file } : it
                )
              );
            }
          }}
          className="w-full text-sm mb-2"
        />
        {item.imageUrl ? (
          <img
            src={
              item.imageUrl.startsWith("blob:")
                ? item.imageUrl
                : `http://localhost:3000${item.imageUrl}`
            }
            alt={item.name}
            className="w-full h-40 object-cover rounded"
          />
        ) : (
          <div className="w-full h-40 bg-muted flex items-center justify-center rounded text-sm text-muted-foreground">
            No Image
          </div>
        )}
      </div>

      {/* معلومات المنتج */}
      <div className="flex-1 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="text"
            value={item.name}
            onChange={(e) =>
              onItemUpdate((prev) =>
                prev.map((it) =>
                  it.id === item.id ? { ...it, name: e.target.value } : it
                )
              )
            }
            className="w-full bg-background border border-border p-2 rounded"
            placeholder="اسم المنتج"
          />

          <input
            type="number"
            value={item.price}
            onChange={(e) =>
              onItemUpdate((prev) =>
                prev.map((it) =>
                  it.id === item.id ? { ...it, price: Number(e.target.value) } : it
                )
              )
            }
            className="w-full bg-background border border-border p-2 rounded"
            placeholder="السعر"
          />
        </div>

        <textarea
          value={item.description || ""}
          onChange={(e) =>
            onItemUpdate((prev) =>
              prev.map((it) =>
                it.id === item.id ? { ...it, description: e.target.value } : it
              )
            )
          }
          className="w-full bg-background border border-border p-2 rounded"
          placeholder="وصف المنتج"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            type="number"
            value={item.quantity ?? ""}
            onChange={(e) =>
              onItemUpdate((prev) =>
                prev.map((it) =>
                  it.id === item.id
                    ? { ...it, quantity: Number(e.target.value) }
                    : it
                )
              )
            }
            disabled={item.quantity === null}
            className="w-full bg-background border border-border p-2 rounded disabled:opacity-50"
            placeholder="الكمية"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.quantity === null}
              onChange={(e) =>
                onItemUpdate((prev) =>
                  prev.map((it) =>
                    it.id === item.id
                      ? { ...it, quantity: e.target.checked ? null : 1 }
                      : it
                  )
                )
              }
            />
            <label className="text-sm">كمية غير محدودة</label>
          </div>
        </div>

        <select
          multiple
          value={item.categoryIds}
          onChange={handleCategoryChange}
          className="w-full bg-background border border-border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
          <option value="add-new">➕ إضافة تصنيف جديد</option>
        </select>

        <div className="flex justify-between pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveItem}
          >
            حفظ
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => {
              if (item.categoryIds && item.categoryIds.length > 0) {
                onItemDelete(item.categoryIds[0], item.id);
              } else {
                toast.error("لا يوجد تصنيف لحذف المنتج منه");
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
