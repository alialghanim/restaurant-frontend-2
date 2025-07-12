// src/components/restaurant-editor/modals/CreditCardMethodModal.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CreditCardMethodModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [agree, setAgree] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Credit Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <p>
            The card will be used for automatic plan renewals without needing
            manual purchase. It will be charged when your plan expires.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Used for automatic subscription renewals</li>
            <li>You can add two cards: primary and fallback</li>
            <li>If the primary fails, fallback will be used</li>
          </ul>

          <hr className="my-2" />

          <div className="space-y-2">
            <label className="block text-sm font-medium">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="1234 5678 9012 3456"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium">CVC</label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="123"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">Expiry</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="MM/YY"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I agree to the Terms of Use and Privacy Policy
          </label>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!agree}>Add Card</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
