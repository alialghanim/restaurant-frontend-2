"use client";

import { Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} as={Fragment}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Dialog.Panel className="bg-card max-w-md w-full p-6 rounded-lg shadow-xl text-foreground">
          <div className="flex items-center gap-3 mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
            <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>
          </div>

          <Dialog.Description className="text-sm text-muted-foreground mb-4">
            {message}
          </Dialog.Description>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-white rounded-md text-sm"
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
