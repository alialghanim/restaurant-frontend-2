"use client";

import { useState, Fragment } from "react";
import { Dialog } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export function AddCategoryModal({ isOpen, onClose, onAdd }: AddCategoryModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim() !== "") {
      onAdd(name.trim());
      setName("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
  <Dialog open={isOpen} onClose={onClose} as={Fragment}>
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* ✅ Overlay بالخلفية السوداء */}
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />

      {/* ✅ المودال نفسه */}
      <Dialog.Panel className="bg-card max-w-md w-full p-6 rounded-lg shadow-xl text-foreground z-10">
        <Dialog.Title className="text-lg font-bold">Add New Category</Dialog.Title>

        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add</Button>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
);
