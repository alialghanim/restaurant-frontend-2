import { ArrowRight, Banknote, Building2, CreditCard, Mail, Wallet } from "lucide-react";

interface BillingSettingsSectionProps {
  onOpenDefaultPaymentModal: () => void;
  onOpenCreditModal: () => void;
  onOpenBankModal: () => void;
  onOpenBillingEmailModal: () => void;
  onOpenCompanyAddressModal: () => void;
}

export default function BillingSettingsSection({
  onOpenDefaultPaymentModal,
  onOpenCreditModal,
  onOpenBankModal,
  onOpenBillingEmailModal,
  onOpenCompanyAddressModal,
}: BillingSettingsSectionProps) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Billing Settings</h2>
      <div className="divide-y rounded-xl border bg-white">

        {/* Default Payment Method */}
        <button
          onClick={onOpenDefaultPaymentModal}
          className="w-full flex items-center justify-between gap-4 px-4 py-4 hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-800">Default Payment Method</div>
              <div className="text-xs text-muted-foreground">Used for refunds and balance payouts</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>

        {/* Credit Card */}
        <button
          onClick={onOpenCreditModal}
          className="w-full flex items-center justify-between gap-4 px-4 py-4 hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-800">Credit Card</div>
              <div className="text-xs text-muted-foreground">No card added yet</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>

        {/* Bank Account */}
        <button
          onClick={onOpenBankModal}
          className="w-full flex items-center justify-between gap-4 px-4 py-4 hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
              <Banknote className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-800">Bank Account for Payouts</div>
              <div className="text-xs text-muted-foreground">Add a bank account to receive payments</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>

        {/* Billing Email */}
        <button
          onClick={onOpenBillingEmailModal}
          className="w-full flex items-center justify-between gap-4 px-4 py-4 hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-800">Billing Email</div>
              <div className="text-xs text-muted-foreground">your@email.com</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>

        {/* Company Address */}
        <button
          onClick={onOpenCompanyAddressModal}
          className="w-full flex items-center justify-between gap-4 px-4 py-4 hover:bg-muted/50"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-muted p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-800">Company Address</div>
              <div className="text-xs text-muted-foreground">Riyadh, Saudi Arabia</div>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>

      </div>
    </div>
  );
}
