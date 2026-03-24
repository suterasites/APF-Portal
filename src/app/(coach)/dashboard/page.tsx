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
// Mock data - quick stats
// -------------------------------------------------

const quickStats = {
  activeClients: 42,
  activeClientsTrend: { value: 8, direction: "up" as const },
  sessionsThisWeek: 27,
  sessionsThisWeekTrend: { value: 12, direction: "up" as const },
  todaysSessions: 5,
  outstandingInvoices: 387500, // in cents
  outstandingInvoicesTrend: { value: 5, direction: "down" as const },
};

// -------------------------------------------------
// Mock data - upcoming reminders
// -------------------------------------------------

interface Reminder {
  id: string;
  type: "overdue_payment" | "expiring_package" | "birthday" | "follow_up";
  message: string;
  urgent: boolean;
}

const reminders: Reminder[] = [
  {
    id: "1",
    type: "overdue_payment",
    message: "Marcus Thompson - invoice #1042 overdue by 14 days ($300.00)",
    urgent: true,
  },
  {
    id: "2",
    type: "overdue_payment",
    message: "Riley Anderson - invoice #1038 overdue by 7 days ($150.00)",
    urgent: true,
  },
  {
    id: "3",
    type: "expiring_package",
    message: "Ethan Cooper - 10-Session Pack expires in 5 days (2 sessions left)",
    urgent: false,
  },
  {
    id: "4",
    type: "expiring_package",
    message: "Zoe Richards - Speed Program expires in 12 days (4 sessions left)",
    urgent: false,
  },
  {
    id: "5",
    type: "birthday",
    message: "Oliver Chen turns 16 on 28 Mar - send a birthday message",
    urgent: false,
  },
  {
    id: "6",
    type: "follow_up",
    message: "Harper Wilson - new client, follow up after intro session",
    urgent: false,
  },
];

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
          Welcome back, James. Here is your business overview for today.
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
