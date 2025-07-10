import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { NewItem, Category } from "@/types/restaurant";

interface AddItemModalProps {
  show: boolean;
  newItem: NewItem;
  categories: Category[];
  restaurantId: string;
  onNewItemChange: (item: NewItem) => void;
  onClose: () => void;
  onAdd: () => void;
  onFetchData: () => void;
}

export function AddItemModal({
  show,
  newItem,
  categories,
  restaurantId,
  onNewItemChange,
  onClose,
  onAdd,
  onFetchData,
}: AddItemModalProps) {
  if (!show) return null;

  const handleCategoryChange = async (value: string) => {
    if (value === "add-new") {
      const name = prompt("Enter new category name:");
      if (name) {
        try {
          const res = await api.post(`/restaurants/${restaurantId}/categories`, { name });
          await onFetchData();
          onNewItemChange({ ...newItem, categoryId: res.data.id });
          toast.success("Category added");
        } catch (err) {
          console.error(err);
          toast.error("Failed to add category");
        }
      }
    } else {
      onNewItemChange({ ...newItem, categoryId: value });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Item</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Item Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const previewUrl = URL.createObjectURL(file);
                  onNewItemChange({
                    ...newItem,
                    imageUrl: previewUrl,
                    file,
                  });
                }
              }}
              className="w-full bg-background p-3 rounded border border-border"
            />
            
            {newItem.imageUrl && (
              <img
                src={newItem.imageUrl}
                alt="Preview"
                className="mt-4 rounded w-full h-40 object-cover"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Item Name</label>
            <input
              type="text"
              className="w-full bg-background p-3 rounded border border-border"
              value={newItem.name}
              onChange={(e) => onNewItemChange({ ...newItem, name: e.target.value })}
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full bg-background p-3 rounded border border-border"
              value={newItem.categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              <option value="add-new">➕ Add New Category</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              step="1"
              min="0"
              className="w-full bg-background p-3 rounded border border-border"
              value={newItem.price}
              onChange={(e) =>
                onNewItemChange({
                  ...newItem,
                  price: e.target.valueAsNumber || 0,
                })
              }
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              className="w-full bg-background p-3 rounded border border-border"
              value={newItem.description}
              onChange={(e) => onNewItemChange({ ...newItem, description: e.target.value })}
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onAdd}
              disabled={!newItem.name.trim() || !newItem.categoryId}
              className="flex-1"
            >
              Add Item
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
