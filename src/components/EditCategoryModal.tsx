// components/EditCategoryModal.tsx
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "./ui/button";

export default function EditCategoryModal({ isOpen, onClose, onEdit, initialName }: {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (name: string) => void;
  initialName: string;
}) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) setName(initialName); // Reset name when modal opens
  }, [isOpen, initialName]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 space-y-4">
          <Dialog.Title className="text-lg font-bold">Edit Category</Dialog.Title>
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline">Cancel</Button>
            <Button onClick={() => onEdit(name)}>Save</Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
