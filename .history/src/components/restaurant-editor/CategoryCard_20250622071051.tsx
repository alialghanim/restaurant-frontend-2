import React from "react";

interface CategoryCardProps {
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CategoryCard({ name, isSelected, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer px-4 py-2 rounded border transition ${
        isSelected
          ? "bg-primary text-white"
          : "bg-card border-border text-foreground hover:bg-muted"
      }`}
    >
      {name}
    </div>
  );
}
