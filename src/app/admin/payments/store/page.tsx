"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WalletIcon, CreditCardIcon, ShoppingBagIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import BillingSettingsSection from "@/components/BillingSettingsSection";
import { ArrowRight } from "lucide-react";
import DefaultPaymentMethodModal from "@/components/restaurant-editor/modals/DefaultPaymentMethodModal";
import CreditCardMethodModal from "@/components/restaurant-editor/modals/CreditCardMethodModal";
import BankAccountModal from "@/components/restaurant-editor/modals/BankAccountModal";
import BillingEmailModal from "@/components/restaurant-editor/modals/BillingEmailModal";
import CompanyAddressModal from "@/components/restaurant-editor/modals/CompanyAddressModal";
import PurchaseInvoicesSection from "../PurchaseInvoices";


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
const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "applepay">("card");
const [withdrawOpen, setWithdrawOpen] = useState(false);
const [withdrawBank, setWithdrawBank] = useState("");
const [withdrawIban, setWithdrawIban] = useState("");
const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

const [showCardForm, setShowCardForm] = useState(false);
const [amount, setAmount] = useState("");
const [showCreditModal, setShowCreditModal] = useState(false);
const [showBankModal, setShowBankModal] = useState(false);
const [showBillingEmailModal, setShowBillingEmailModal] = useState(false);
const [showCompanyAddressModal, setShowCompanyAddressModal] = useState(false);

  return (
    <div className="space-y-6 p-6">
<button
  onClick={() => router.back()} // أو router.push("/admin/payments/store")
  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
>
  <ArrowLeft className="w-4 h-4" />
  Return
</button>
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
  onWithdraw={() => setWithdrawOpen(true)} // ✅ أضف هذا
/>
      </div>

      {/* ✅ مودال سحب الرصيد */}
<Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle>Withdraw Balance</DialogTitle>
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
          placeholder="Example: 150"
        />
      </div>

      {/* Bank Selection */}
      <div>
        <label className="text-sm font-medium">Bank</label>
        <select
          value={withdrawBank}
          onChange={(e) => setWithdrawBank(e.target.value)}
          className="w-full mt-1 border rounded px-3 py-2"
        >
          <option value="">Select a bank</option>
          <option value="alrajhi">Al Rajhi Bank</option>
          <option value="sabb">SABB</option>
          <option value="riyad">Riyad Bank</option>
          <option value="ncb">NCB (Ahli)</option>
          <option value="bankalahli">Al Ahli Bank</option>
          <option value="bankaljazira">Bank Al Jazira</option>
        </select>
      </div>

     {/* IBAN Input */}
      <div>
        <label className="text-sm font-medium">Bank IBAN</label>
        <input
          type="text"
          value={withdrawIban}
          onChange={(e) => setWithdrawIban(e.target.value)}
          className="w-full mt-1 border rounded px-3 py-2"
          placeholder="SA0000000000000000001234"
        />
      </div>

      <button className="w-full bg-primary text-white rounded py-2 hover:bg-primary/90">
        Request Withdrawal
      </button>
    </div>
  </DialogContent>
</Dialog>

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
<fieldset className="space-y-2">
  <legend className="text-sm font-medium">Payment Method</legend>

  <div className="flex flex-col gap-2 mt-2">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="payment"
        value="card"
        checked={paymentMethod === "card"}
        onChange={() => {
          setPaymentMethod("card");
          setShowCardForm(false);
        }}
      />
      <span className="flex items-center gap-2">
  Card
  <div className="flex gap-1 ml-2">
    <img src="/icons/mada.svg" alt="Mada" className="w-8 h-5 object-contain" />
    <img src="/icons/visa.svg" alt="Visa" className="w-8 h-5 object-contain" />
    <img src="/icons/mastercard.svg" alt="MasterCard" className="w-8 h-5 object-contain" />
  </div>
</span>

    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="payment"
        value="bank"
        checked={paymentMethod === "bank"}
        onChange={() => {
          setPaymentMethod("bank");
          setShowCardForm(false);
        }}
      />
      Bank Transfer
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="payment"
        value="applepay"
        checked={paymentMethod === "applepay"}
        onChange={() => {
          setPaymentMethod("applepay");
          setShowCardForm(false);
        }}
      />
      <span className="flex items-center gap-2">
  Apple Pay
  <img src="/icons/applepay.svg" alt="Apple Pay" className="w-8 h-5 object-contain" />
</span>

    </label>
  </div>
</fieldset>

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

  {/* زر الدفع حسب وسيلة الدفع */}
{paymentMethod === "applepay" ? (
<button className="w-full bg-black text-white text-base font-medium py-2 rounded hover:opacity-90 text-center">
  <span className="flex items-center justify-center gap-2">
    Pay with
    <img
      src="/icons/icons-apple-pay.svg"
      alt="Apple Pay"
      className="h-10 w-auto object-contain"
    />
  </span>
</button>
) : (
  <button className="w-full bg-primary text-white rounded py-2 hover:bg-primary/90">
    Confirm Deposit
  </button>
)}

  </div>
</DialogContent>
</Dialog>



      <div className="bg-white border rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
        <p className="text-muted-foreground text-sm">No transactions found yet.</p>
      </div>

 {/* 🟩 Billing Settings */}
<BillingSettingsSection
  onOpenDefaultPaymentModal={() => setPaymentModalOpen(true)}
  onOpenCreditModal={() => setShowCreditModal(true)}
  onOpenBankModal={() => setShowBankModal(true)}
  onOpenBillingEmailModal={() => setShowBillingEmailModal(true)}
  onOpenCompanyAddressModal={() => setShowCompanyAddressModal(true)} // ✅ هذا
/>

<h2 className="text-lg font-semibold">Purchase Invoices</h2>
<PurchaseInvoicesSection />



<DefaultPaymentMethodModal
  open={isPaymentModalOpen}
  onClose={() => setPaymentModalOpen(false)}
/>

<CreditCardMethodModal
  open={showCreditModal}
  onClose={() => setShowCreditModal(false)}
/>

<BankAccountModal
  open={showBankModal}
  onClose={() => setShowBankModal(false)}
/>

<BillingEmailModal
  open={showBillingEmailModal}
  onClose={() => setShowBillingEmailModal(false)}
/>

<CompanyAddressModal
  open={showCompanyAddressModal}
  onClose={() => setShowCompanyAddressModal(false)}
/>

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
  onWithdraw, // ✅ أضف هذا
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  actions?: boolean;
  onViewTransactions?: () => void;
  onDeposit?: () => void;
  onWithdraw?: () => void; // ✅ أضف هذا
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
<button
  className="border px-3 py-1 rounded text-sm hover:bg-muted"
  onClick={onWithdraw} // هذا لازم تمرره من StoreBalancePage
>
  Withdraw
</button>
        </div>
      )}

     <button
  className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition"
  onClick={onViewTransactions}
>
  View Transactions
  <ArrowRight className="w-4 h-4" />
</button>
    </div>
  );
}
