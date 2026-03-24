"use client";

import { useState } from "react";
import {
  DollarSign,
  FileText,
  Plus,
  Send,
  Check,
  AlertCircle,
  Download,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/components/dashboard/stat-card";
import { InvoiceModal } from "@/components/finances/invoice-modal";
import { formatCurrency, formatDate } from "@/lib/utils";

// -------------------------------------------------
// Types
// -------------------------------------------------

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  description: string;
  amount: number; // cents
  dueDate: string;
  status: InvoiceStatus;
  createdAt: string;
}

// -------------------------------------------------
// Invoice data (populated from database)
// -------------------------------------------------

const mockInvoices: Invoice[] = [];

// -------------------------------------------------
// Helpers
// -------------------------------------------------

const statusBadgeVariant: Record<
  InvoiceStatus,
  "secondary" | "default" | "success" | "destructive" | "outline"
> = {
  draft: "secondary",
  sent: "default",
  paid: "success",
  overdue: "destructive",
  cancelled: "outline",
};

const statusLabel: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

const statusIcon: Record<InvoiceStatus, React.ElementType> = {
  draft: FileText,
  sent: Send,
  paid: Check,
  overdue: AlertCircle,
  cancelled: FileText,
};

type FilterTab = "all" | InvoiceStatus;

const filterTabs: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
];

// -------------------------------------------------
// Component
// -------------------------------------------------

export default function FinancesPage() {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Computed totals
  const totalRevenueThisMonth = mockInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const outstanding = mockInvoices
    .filter((inv) => inv.status === "sent")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdue = mockInvoices
    .filter((inv) => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const paidThisMonth = mockInvoices.filter(
    (inv) => inv.status === "paid"
  ).length;

  // Filtered invoices
  const filteredInvoices = mockInvoices.filter((inv) => {
    const matchesFilter = filter === "all" || inv.status === filter;
    const matchesSearch =
      search === "" ||
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Revenue This Month"
          value={formatCurrency(totalRevenueThisMonth)}
          icon={DollarSign}
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstanding)}
          icon={Send}
        />
        <StatCard
          label="Overdue"
          value={formatCurrency(overdue)}
          icon={AlertCircle}
        />
        <StatCard
          label="Paid This Month"
          value={paidThisMonth}
          icon={Check}
        />
      </div>

      {/* Invoices Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Invoices</CardTitle>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
              <Input
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    filter === tab.value
                      ? "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]"
                      : "bg-[#F5F5F5] text-[#6B6B6B] hover:text-[#0A0A0A] dark:bg-[#141414] dark:hover:text-[#FAFAFA]"
                  }`}
                >
                  {tab.label}
                  {tab.value !== "all" && (
                    <span className="ml-1.5 text-xs opacity-70">
                      {
                        mockInvoices.filter(
                          (inv) => inv.status === tab.value
                        ).length
                      }
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Invoices Table - Desktop */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                      Invoice
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                      Client
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                      Description
                    </th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                      Amount
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                      Due Date
                    </th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                      Status
                    </th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A]">
                  {filteredInvoices.map((invoice) => {
                    const StatusIcon = statusIcon[invoice.status];
                    return (
                      <tr
                        key={invoice.id}
                        className="transition-colors hover:bg-[#F5F5F5]/50 dark:hover:bg-[#141414]/50"
                      >
                        <td className="py-4 text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                          {invoice.number}
                        </td>
                        <td className="py-4 text-sm text-[#0A0A0A] dark:text-[#FAFAFA]">
                          {invoice.clientName}
                        </td>
                        <td className="max-w-[200px] truncate py-4 text-sm text-[#6B6B6B]">
                          {invoice.description}
                        </td>
                        <td className="py-4 text-right text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="py-4 text-sm text-[#6B6B6B]">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="py-4">
                          <Badge variant={statusBadgeVariant[invoice.status]}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusLabel[invoice.status]}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {invoice.status === "draft" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Send invoice"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="More actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoices List - Mobile */}
          <div className="space-y-3 md:hidden">
            {filteredInvoices.map((invoice) => {
              const StatusIcon = statusIcon[invoice.status];
              return (
                <div
                  key={invoice.id}
                  className="rounded-lg border border-[#E5E5E5] bg-white p-4 dark:border-[#2A2A2A] dark:bg-[#0A0A0A]"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                          {invoice.number}
                        </span>
                        <Badge variant={statusBadgeVariant[invoice.status]}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusLabel[invoice.status]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {invoice.clientName}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-[#6B6B6B]">
                        {invoice.description}
                      </p>
                    </div>
                    <p className="ml-4 text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {formatCurrency(invoice.amount)}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#E5E5E5] pt-3 dark:border-[#2A2A2A]">
                    <span className="text-xs text-[#6B6B6B]">
                      Due {formatDate(invoice.dueDate)}
                    </span>
                    <div className="flex items-center gap-1">
                      {invoice.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Send invoice"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredInvoices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F5F5] dark:bg-[#141414]">
                <FileText className="h-6 w-6 text-[#6B6B6B]" />
              </div>
              <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                No invoices found
              </h3>
              <p className="mt-1.5 max-w-sm text-sm text-[#6B6B6B]">
                {search
                  ? "Try adjusting your search or filter criteria."
                  : "Create your first invoice to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Modal */}
      <InvoiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(data) => {
          // In production this would POST to the API
          console.log("Invoice saved:", data);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
