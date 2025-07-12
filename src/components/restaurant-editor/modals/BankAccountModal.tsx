import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function BankAccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [accountName, setAccountName] = useState("");
  const [iban, setIban] = useState("");
const [bankName, setBankName] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Account Holder Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
              placeholder="e.g. Restaurant Co."
            />
          </div>

<div className="space-y-1">
  <label className="text-sm font-medium">Bank Name</label>
  <select
    value={bankName}
    onChange={(e) => setBankName(e.target.value)}
    className="w-full mt-1 border rounded px-3 py-2"
  >
    <option value="">Select a bank</option>
    <option value="alrajhi">Al Rajhi Bank</option>
    <option value="riyad">Riyad Bank</option>
    <option value="ncb">NCB (Ahli)</option>
    <option value="sabb">SABB</option>
    <option value="bankalahli">Al Ahli Bank</option>
    <option value="bankaljazira">Bank Al Jazira</option>
  </select>
</div>

          <div>
            <label className="text-sm font-medium">IBAN</label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
              placeholder="SA0000000000000000001234"
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
