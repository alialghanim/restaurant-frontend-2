import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AddCategoryModalProps {
  show: boolean;
  categoryName: string;
  categoryDescription: string;
  onCategoryNameChange: (value: string) => void;
  onCategoryDescriptionChange: (value: string) => void;
  onClose: () => void;
  onAdd: () => void;
}

export function AddCategoryModal({
  show,
  categoryName,
  categoryDescription,
  onCategoryNameChange,
  onCategoryDescriptionChange,
  onClose,
  onAdd,
}: AddCategoryModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Category</h3>
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
            <label className="block text-sm font-medium mb-2">Category Name</label>
            <input
              type="text"
              className="w-full bg-background p-3 rounded border border-border"
              value={categoryName}
              onChange={(e) => onCategoryNameChange(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              className="w-full bg-background p-3 rounded border border-border"
              value={categoryDescription}
              onChange={(e) => onCategoryDescriptionChange(e.target.value)}
              placeholder="Enter category description"
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
              disabled={!categoryName.trim()}
              className="flex-1"
            >
              Add Category
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
