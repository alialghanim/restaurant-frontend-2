import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Category } from "@/types/restaurant";

interface CategoryCardProps {
  category: Category;
  onDelete: (categoryId: string) => void;
}

export function CategoryCard({ category, onDelete }: CategoryCardProps) {
  return (
    <div className="bg-background p-4 rounded-lg border border-border shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-base font-semibold mb-1">{category.name}</h4>
        {category.description && (
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(category.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
