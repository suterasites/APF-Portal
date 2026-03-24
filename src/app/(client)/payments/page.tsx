"use client";

import {
  DollarSign,
  CreditCard,
  FileText,
  Check,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

// Data placeholders - amounts in cents (AUD)
const outstandingBalance = 0;

const invoices: {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issuedDate: string;
}[] = [];

const paymentHistory: {
  id: string;
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
}[] = [];

const statusConfig: Record<
  string,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Unpaid", variant: "warning" },
  paid: { label: "Paid", variant: "success" },
  overdue: { label: "Overdue", variant: "destructive" },
  cancelled: { label: "Cancelled", variant: "secondary" },
};

function getStatusIcon(status: string) {
  switch (status) {
    case "paid":
      return <Check className="h-4 w-4" />;
    case "overdue":
      return <AlertCircle className="h-4 w-4" />;
    case "sent":
      return <Clock className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

export default function ClientPaymentsPage() {
  const unpaidInvoices = invoices.filter(
    (inv) => inv.status === "sent" || inv.status === "overdue"
  );
  const paidInvoices = invoices.filter((inv) => inv.status === "paid");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
          Payments
        </h1>
        <p className="mt-1 text-[#6B6B6B]">
          View your invoices and payment history.
        </p>
      </div>

      {/* Outstanding Balance */}
      <Card className="border-[#0A0A0A] dark:border-[#FAFAFA]">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A0A0A] dark:bg-[#FAFAFA]">
              <DollarSign className="h-6 w-6 text-white dark:text-[#0A0A0A]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#6B6B6B]">
                Outstanding Balance
              </p>
              <p className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                {formatCurrency(outstandingBalance)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6B6B6B]">
              {unpaidInvoices.length} unpaid invoice{unpaidInvoices.length !== 1 ? "s" : ""}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Unpaid Invoices */}
      {unpaidInvoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Unpaid Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unpaidInvoices.map((invoice) => {
                const config = statusConfig[invoice.status];
                return (
                  <div
                    key={invoice.id}
                    className={`flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between ${
                      invoice.status === "overdue"
                        ? "border-[#C23B22]/30 bg-[#FDECEB]/30 dark:bg-[#2E1A1A]/30"
                        : "border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getStatusIcon(invoice.status)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                            {invoice.id}
                          </p>
                          <Badge variant={config.variant}>{config.label}</Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-[#6B6B6B]">
                          {invoice.description}
                        </p>
                        <p className="mt-0.5 text-xs text-[#6B6B6B]">
                          Due: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
                      <p className="text-lg font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {formatCurrency(invoice.amount)}
                      </p>
                      <Button size="sm">
                        <CreditCard className="mr-1.5 h-4 w-4" />
                        Pay Now
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Invoices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                    Invoice
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                    Description
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                    Due Date
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                    Amount
                  </th>
                  <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                    Status
                  </th>
                  <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A]">
                {invoices.map((invoice) => {
                  const config = statusConfig[invoice.status];
                  return (
                    <tr key={invoice.id}>
                      <td className="py-3 text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {invoice.id}
                      </td>
                      <td className="py-3 text-sm text-[#6B6B6B]">
                        {invoice.description}
                      </td>
                      <td className="py-3 text-sm text-[#6B6B6B]">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="py-3 text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="py-3">
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </td>
                      <td className="py-3 text-right">
                        {(invoice.status === "sent" ||
                          invoice.status === "overdue") && (
                          <Button size="sm">
                            <CreditCard className="mr-1.5 h-4 w-4" />
                            Pay
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="space-y-3 sm:hidden">
            {invoices.map((invoice) => {
              const config = statusConfig[invoice.status];
              return (
                <div
                  key={invoice.id}
                  className="rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {invoice.id}
                    </p>
                    <Badge variant={config.variant}>{config.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-[#6B6B6B]">
                    {invoice.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-[#6B6B6B]">
                      Due: {formatDate(invoice.dueDate)}
                    </p>
                    <p className="text-sm font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {formatCurrency(invoice.amount)}
                    </p>
                  </div>
                  {(invoice.status === "sent" ||
                    invoice.status === "overdue") && (
                    <Button size="sm" className="mt-3 w-full">
                      <CreditCard className="mr-1.5 h-4 w-4" />
                      Pay Now
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentHistory.length === 0 ? (
            <p className="text-sm text-[#6B6B6B]">No payment history yet.</p>
          ) : (
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E6F4EA] dark:bg-[#1A2E1A]">
                    <Check className="h-5 w-5 text-[#1E7E34] dark:text-[#6FCF7C]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {payment.invoiceId}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      {formatDate(payment.date)} - {payment.method}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-[#1E7E34] dark:text-[#6FCF7C]">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
