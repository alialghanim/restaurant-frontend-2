"use client";

import { useState } from "react";

const PurchaseInvoicesSection = () => {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="mt-8 rounded-lg border bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-base font-semibold">Purchase Invoices</h2>
      </div>

      <div className="px-6">
        {/* Tabs */}
        <div className="flex gap-6 border-b pt-4">
          <button
            className={`pb-2 text-sm font-medium transition-all ${
              activeTab === "current"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("current")}
          >
            Current Invoices
          </button>
          <button
            className={`pb-2 text-sm font-medium transition-all ${
              activeTab === "previous"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("previous")}
          >
            Previous Invoices
          </button>
        </div>

        {/* Empty State */}
        <div className="py-12 text-center text-sm text-muted-foreground">
          No invoices found.
        </div>
      </div>
    </div>
  );
};

export default PurchaseInvoicesSection;
