"use client";

import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RevenueSummary } from "@/components/dashboard/revenue-summary";

// -------------------------------------------------
// Quick stats (populated from database)
// -------------------------------------------------

const quickStats = {
  activeClients: 0,
  activeClientsTrend: { value: 0, direction: "up" as const },
  sessionsThisWeek: 0,
  sessionsThisWeekTrend: { value: 0, direction: "up" as const },
  todaysSessions: 0,
  outstandingInvoices: 0, // in cents
  outstandingInvoicesTrend: { value: 0, direction: "down" as const },
};

// -------------------------------------------------
// Upcoming reminders (populated from database)
// -------------------------------------------------

interface Reminder {
  id: string;
  type: "overdue_payment" | "expiring_package" | "birthday" | "follow_up";
  message: string;
  urgent: boolean;
}

const reminders: Reminder[] = [];

// -------------------------------------------------
// Page component
// -------------------------------------------------

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Welcome back. Here is your business overview for today.
        </p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active Clients"
          value={quickStats.activeClients}
          icon={Users}
          trend={quickStats.activeClientsTrend}
        />
        <StatCard
          label="Sessions This Week"
          value={quickStats.sessionsThisWeek}
          icon={Calendar}
          trend={quickStats.sessionsThisWeekTrend}
        />
        <StatCard
          label="Today's Sessions"
          value={quickStats.todaysSessions}
          icon={Clock}
        />
        <StatCard
          label="Outstanding Invoices"
          value={formatCurrency(quickStats.outstandingInvoices)}
          icon={DollarSign}
          trend={quickStats.outstandingInvoicesTrend}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-6">
          <TodaySchedule />
          <RecentActivity />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <RevenueSummary />

          {/* Upcoming reminders */}
          <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414]">
            <div className="p-6 pb-4">
              <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                Reminders
              </h2>
            </div>

            <div className="px-6 pb-6">
              {reminders.length === 0 ? (
                <p className="text-sm text-[#6B6B6B]">No reminders at this time.</p>
              ) : (
                <ul className="space-y-3">
                  {reminders.map((reminder) => (
                    <li
                      key={reminder.id}
                      className="flex items-start gap-3"
                    >
                      {reminder.urgent ? (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C23B22]" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6B6B6B]" />
                      )}
                      <p
                        className={
                          reminder.urgent
                            ? "text-sm text-[#C23B22]"
                            : "text-sm text-[#0A0A0A] dark:text-[#FAFAFA]"
                        }
                      >
                        {reminder.message}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
