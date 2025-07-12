import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";

export default function DefaultPaymentMethodModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [primaryMethod, setPrimaryMethod] = useState<"wallet" | "card" | null>(null);
  const [fallbackMethod, setFallbackMethod] = useState<"wallet" | "card" | null>(null);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-6">
        <DialogHeader>
          <DialogTitle>Default Payment Method</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 text-sm bg-yellow-100 text-yellow-800 p-3 rounded">
          <TriangleAlert className="w-4 h-4" />
          If the balance is not enough in the default method, the fallback method will be used instead.
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Payment Method</label>
          <div className="space-y-2">
            <label className={`flex items-center border rounded px-4 py-2 gap-3 cursor-pointer ${primaryMethod === "wallet" ? "border-primary ring-1 ring-primary" : ""}`}>
              <input
                type="radio"
                name="primary"
                value="wallet"
                checked={primaryMethod === "wallet"}
                onChange={() => setPrimaryMethod("wallet")}
              />
              <span>Store Wallet</span>
            </label>

            <label className={`flex items-center border rounded px-4 py-2 gap-3 cursor-pointer ${primaryMethod === "card" ? "border-primary ring-1 ring-primary" : ""}`}>
              <input
                type="radio"
                name="primary"
                value="card"
                checked={primaryMethod === "card"}
                onChange={() => setPrimaryMethod("card")}
              />
              <span>Credit Card</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fallback Payment Method</label>
          <div className="space-y-2">
            <label className={`flex items-center border rounded px-4 py-2 gap-3 cursor-pointer ${fallbackMethod === "wallet" ? "border-primary ring-1 ring-primary" : ""}`}>
              <input
                type="radio"
                name="fallback"
                value="wallet"
                checked={fallbackMethod === "wallet"}
                onChange={() => setFallbackMethod("wallet")}
              />
              <span>Store Wallet</span>
            </label>

            <label className={`flex items-center border rounded px-4 py-2 gap-3 cursor-pointer ${fallbackMethod === "card" ? "border-primary ring-1 ring-primary" : ""}`}>
              <input
                type="radio"
                name="fallback"
                value="card"
                checked={fallbackMethod === "card"}
                onChange={() => setFallbackMethod("card")}
              />
              <span>Credit Card</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm border rounded hover:bg-muted">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90">
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
