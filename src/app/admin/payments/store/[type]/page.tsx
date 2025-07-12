"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // إذا عندك badge جاهز

interface Transaction {
  id: string;
  amount: number;
  type: "deposit" | "withdrawal";
  date: string;
  status: "completed" | "pending" | "failed";
  method: string;
  iban?: string;
  uti?: string;
  orderId?: string;
  storeName?: string;
}


const mockData: Record<string, Transaction[]> = {
  cash: [
  {
    id: "1",
    amount: 150,
    type: "deposit",
    date: "2025-07-05",
    status: "completed",
    method: "cash",
    iban: "SA0000000000000",
    uti: "UTI-CASH-001",
    orderId: "ORD-101",
    storeName: "Downtown Branch"
  },
],

  electronic: [
    {
      id: "2",
      amount: 200,
      type: "deposit",
      date: "2025-07-04",
      status: "completed",
      method: "visa",
      iban: "SA0000000000001",
      uti: "UTI-VISA-002",
    },
  ],
  wallet: [
    {
      id: "3",
      amount: 50,
      type: "withdrawal",
      date: "2025-07-03",
      status: "pending",
      method: "wallet",
      iban: "SA0000000000002",
      uti: "UTI-WALLET-003",
    },
  ],
};

export default function TransactionTypePage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;

  const transactions = mockData[type] ?? [];

  const titleMap: Record<string, string> = {
    cash: "Cash on Delivery",
    electronic: "Electronic Payment",
    wallet: "Store Wallet",
  };

  return (
    <div className="p-6 space-y-6">
<div className="mb-4">
  <button
    onClick={() => router.back()}
    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
  >
    <ArrowLeft className="w-4 h-4" />
    Return
  </button>

  <h1 className="text-xl font-bold mt-4">
    {titleMap[type] || "Transactions"} - Transaction History
  </h1>
</div>


      {transactions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-lg shadow p-4">
          <table className="w-full text-sm">
<thead>
  <tr className="text-left border-b">
    <th>#</th>
    <th>Amount</th>
    <th>Date</th>
    <th>Type</th>
    <th>Method</th>
    <th>Status</th>
    <th>IBAN</th>
    <th>UTI</th>
    <th>Order</th>       {/* 👈 هذا الجديد */}
    <th>Store</th>       {/* 👈 هذا الجديد */}
  </tr>
</thead>

            <tbody>
              {transactions.map((t, index) => (

                <tr key={t.id} className="border-b">
                <td>{index + 1}</td>
<td>SAR {t.amount}</td>
<td>{t.date}</td>
<td>{t.type}</td>
<td>{t.method}</td>
<td className="p-2">
  <Badge
    variant={
      t.status === "completed"
        ? "success"
        : t.status === "pending"
        ? "secondary"
        : "destructive"
    }
  >
    {t.status}
  </Badge>
</td>
<td>{t.iban ?? "-"}</td>
<td>{t.uti ?? "-"}</td>

<td>{t.orderId ?? "-"}</td>
<td>{t.storeName ?? "-"}</td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
