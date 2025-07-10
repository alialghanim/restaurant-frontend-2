import React from "react";

interface CategoryCardProps {
  name: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function CategoryCard({ name, onClick, isSelected }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer px-4 py-2 rounded border ${
        isSelected ? "bg-primary text-white" : "bg-card border-border text-foreground"
      } hover:bg-primary/80 hover:text-white transition`}
    >
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
