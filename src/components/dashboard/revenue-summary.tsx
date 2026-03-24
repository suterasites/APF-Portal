"use client";

import { DollarSign, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

// Mock data - revenue figures in cents (AUD)
const revenueData = {
  currentMonth: 1245000, // $12,450.00
  previousMonth: 1089000, // $10,890.00
  outstandingInvoices: 387500, // $3,875.00
  overdueInvoices: 155000, // $1,550.00
};

export function RevenueSummary() {
  const percentageChange =
    revenueData.previousMonth > 0
      ? (
          ((revenueData.currentMonth - revenueData.previousMonth) /
            revenueData.previousMonth) *
          100
        ).toFixed(1)
      : "0";

  const isPositiveChange = revenueData.currentMonth >= revenueData.previousMonth;

  return (
    <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414]">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
          Revenue Summary
        </h2>
        <Link
          href="/finances"
          className="flex items-center gap-1 text-sm text-[#6B6B6B] transition-colors hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA]"
        >
          View finances
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="px-6 pb-6 space-y-5">
        {/* This month */}
        <div>
          <p className="text-sm text-[#6B6B6B]">This month (March)</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
              {formatCurrency(revenueData.currentMonth)}
            </span>
            <div
              className={
                isPositiveChange
                  ? "flex items-center gap-1 text-sm text-[#0A0A0A] dark:text-[#FAFAFA]"
                  : "flex items-center gap-1 text-sm text-[#C23B22]"
              }
            >
              {isPositiveChange ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-medium">
                {isPositiveChange ? "+" : ""}
                {percentageChange}%
              </span>
              <span className="text-[#6B6B6B]">vs last month</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Previous month: {formatCurrency(revenueData.previousMonth)}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E5E5] dark:border-[#2A2A2A]" />

        {/* Outstanding and overdue */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#6B6B6B]" />
              <p className="text-sm text-[#6B6B6B]">Outstanding</p>
            </div>
            <p className="mt-1 text-xl font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
              {formatCurrency(revenueData.outstandingInvoices)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#C23B22]" />
              <p className="text-sm text-[#C23B22]">Overdue</p>
            </div>
            <p className="mt-1 text-xl font-semibold text-[#C23B22]">
              {formatCurrency(revenueData.overdueInvoices)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
