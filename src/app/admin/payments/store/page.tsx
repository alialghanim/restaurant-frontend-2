"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WalletIcon, CreditCardIcon, ShoppingBagIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
  id: string;
  amount: number;
  type: "deposit" | "withdrawal";
  date: string;
  status: "completed" | "pending" | "failed";
  method: string;
  iban?: string;
  uti?: string;
  referenceNumber?: string;
}

export default function StoreBalancePage() {

  const router = useRouter();
  const [depositOpen, setDepositOpen] = useState(false);
const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
const [showCardForm, setShowCardForm] = useState(false);
const [amount, setAmount] = useState("");

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-xl font-bold">Store Balance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BalanceCard
          title="Cash on Delivery Balance"
          value="SAR 0.00"
          icon={<ShoppingBagIcon className="w-6 h-6" />}
          onViewTransactions={() => router.push("/admin/payments/store/cash")}
        />
        <BalanceCard
          title="Electronic Payment Balance"
          value="SAR 0.00"
          icon={<CreditCardIcon className="w-6 h-6" />}
          onViewTransactions={() => router.push("/admin/payments/store/electronic")}
        />
        <BalanceCard
          title="Store Wallet"
          value="SAR 0.00"
          icon={<WalletIcon className="w-6 h-6" />}
          actions
          onViewTransactions={() => router.push("/admin/payments/store/wallet")}
          onDeposit={() => setDepositOpen(true)}
        />
      </div>

      {/* ✅ مودال إضافة الرصيد */}
  <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
  <DialogContent className="max-w-md">
  <DialogHeader>
    <DialogTitle>Add Balance</DialogTitle>
  </DialogHeader>

  <div className="space-y-4">
    {/* Amount */}
    <div>
      <label className="text-sm font-medium">Amount</label>
      <input
        type="number"
        min={0}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full mt-1 border rounded px-3 py-2"
        placeholder="Example: 200"
      />
    </div>

    {/* Payment Method */}
    <div>
      <label className="text-sm font-medium">Payment Method</label>
      <div className="flex flex-col gap-2 mt-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "card"}
            onChange={() => {
              setPaymentMethod("card");
              setShowCardForm(false);
            }}
          />
          Card (Mada / Visa)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "bank"}
            onChange={() => {
              setPaymentMethod("bank");
              setShowCardForm(false);
            }}
          />
          Bank Transfer
        </label>
      </div>
    </div>

    {/* Card Form */}
    {paymentMethod === "card" && (
      <>
        {!showCardForm ? (
          <button
            onClick={() => setShowCardForm(true)}
            className="text-sm text-primary border border-primary px-3 py-1 rounded hover:bg-primary hover:text-white transition"
          >
            + Add New Card
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Card Number"
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                className="w-1/2 border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="CVC"
                className="w-1/2 border rounded px-3 py-2"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" /> Save this card
            </label>
          </div>
        )}
      </>
    )}

    {/* Bank Transfer Info */}
    {paymentMethod === "bank" && (
      <div className="space-y-3 bg-gray-50 p-4 rounded border text-sm">
        <div className="text-yellow-800 bg-yellow-100 p-2 rounded">
          Bank transfers are reviewed manually from Sunday to Thursday during working hours (9:00 AM - 5:00 PM).
        </div>
        <div className="space-y-1">
          <p><strong>Bank:</strong> Al Rajhi Bank</p>
          <p><strong>Account Holder:</strong> Restaurant Management Company</p>
          <p><strong>Account Number:</strong> 1234567890123456</p>
          <p><strong>IBAN:</strong> SA0000000000000000001234</p>
        </div>
        <div>
          <label className="text-sm font-medium">Upload Transfer Receipt</label>
          <input type="file" className="mt-1" />
        </div>
      </div>
    )}

    {/* Submit */}
    <button className="w-full bg-primary text-white rounded py-2 hover:bg-primary/90">
      Confirm Deposit
    </button>
  </div>
</DialogContent>
</Dialog>



      <div className="bg-white border rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <p className="text-muted-foreground text-sm">No transactions found yet.</p>
      </div>
    </div>
  );
}

// بطاقة الرصيد
function BalanceCard({
  title,
  value,
  icon,
  actions = false,
  onViewTransactions,
  onDeposit,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  actions?: boolean;
  onViewTransactions?: () => void;
  onDeposit?: () => void;
}) {
  return (
    <div className="bg-white border rounded-lg shadow p-6 flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted p-2 rounded-full text-primary">{icon}</div>
          <div>
            <h3 className="font-medium text-sm">{title}</h3>
            <p className="font-semibold text-lg">{value}</p>
          </div>
        </div>
      </div>

      {actions && (
        <div className="flex gap-3">
          <button
            className="border px-3 py-1 rounded text-sm hover:bg-muted"
            onClick={onDeposit}
          >
            Deposit
          </button>
          <button className="border px-3 py-1 rounded text-sm hover:bg-muted">Withdraw</button>
        </div>
      )}

      <button
        className="text-sm text-blue-600 underline self-start"
        onClick={onViewTransactions}
      >
        View Transactions
      </button>
    </div>
  );
}
