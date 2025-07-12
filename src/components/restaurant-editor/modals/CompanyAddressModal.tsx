"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CompanyAddressModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [taxNumber, setTaxNumber] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Company Address</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <input
              type="text"
              className="w-full mt-1 border rounded px-3 py-2"
              placeholder="e.g. Restaurant Co."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <input
              type="text"
              className="w-full mt-1 border rounded px-3 py-2"
              placeholder="e.g. Olaya Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">City</label>
            <input
              type="text"
              className="w-full mt-1 border rounded px-3 py-2"
              placeholder="e.g. Riyadh"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tax Number</label>
            <input
              type="text"
              className="w-full mt-1 border rounded px-3 py-2"
              placeholder="e.g. 1234567890"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
