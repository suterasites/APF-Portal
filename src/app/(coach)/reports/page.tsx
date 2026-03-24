"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Download,
  DollarSign,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/stat-card";
import { formatCurrency } from "@/lib/utils";

// -------------------------------------------------
// Report data (populated from database)
// -------------------------------------------------

const monthlyRevenue: { month: string; amount: number }[] = [];

const maxRevenue = monthlyRevenue.length > 0 ? Math.max(...monthlyRevenue.map((m) => m.amount)) : 0;

const newClientsPerMonth: { month: string; count: number }[] = [];

const maxNewClients = newClientsPerMonth.length > 0 ? Math.max(...newClientsPerMonth.map((m) => m.count)) : 0;

const attendanceData: { label: string; value: number; color: string }[] = [];

const revenueByCoach: { name: string; amount: number; percentage: number }[] = [];

const revenueByService: { name: string; amount: number; percentage: number }[] = [];

const totalRevenueYTD = 0;

// -------------------------------------------------
// Bar Chart Component
// -------------------------------------------------

function HorizontalBar({
  label,
  value,
  max,
  displayValue,
  colorClass = "bg-[#0A0A0A] dark:bg-[#FAFAFA]",
}: {
  label: string;
  value: number;
  max: number;
  displayValue: string;
  colorClass?: string;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#0A0A0A] dark:text-[#FAFAFA]">{label}</span>
        <span className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
          {displayValue}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-[#F5F5F5] dark:bg-[#141414]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function VerticalBarChart({
  data,
  maxValue,
  formatValue,
}: {
  data: { label: string; value: number }[];
  maxValue: number;
  formatValue: (value: number) => string;
}) {
  return (
    <div className="flex items-end gap-3">
      {data.map((item) => {
        const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
              {formatValue(item.value)}
            </span>
            <div className="relative h-40 w-full">
              <div className="absolute bottom-0 w-full overflow-hidden rounded-t-md bg-[#F5F5F5] dark:bg-[#141414]"
                style={{ height: '100%' }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-t-md bg-[#0A0A0A] transition-all duration-500 dark:bg-[#FAFAFA]"
                  style={{ height: `${heightPercentage}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-[#6B6B6B]">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------
// Component
// -------------------------------------------------

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Revenue YTD"
          value={formatCurrency(totalRevenueYTD)}
          icon={DollarSign}
        />
        <StatCard
          label="Total Sessions YTD"
          value="0"
          icon={Calendar}
        />
        <StatCard
          label="Avg Sessions / Week"
          value="0"
          icon={TrendingUp}
        />
        <StatCard
          label="Client Retention"
          value="0%"
          icon={UserCheck}
        />
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      {/* Revenue Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#6B6B6B]" />
            <CardTitle>Monthly Revenue</CardTitle>
          </div>
          <p className="text-sm text-[#6B6B6B]">
            Revenue over the last 6 months
          </p>
        </CardHeader>
        <CardContent>
          <VerticalBarChart
            data={monthlyRevenue.map((m) => ({
              label: m.month,
              value: m.amount,
            }))}
            maxValue={maxRevenue}
            formatValue={(v) => formatCurrency(v)}
          />
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue by Coach */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#6B6B6B]" />
              <CardTitle>Revenue by Coach</CardTitle>
            </div>
            <p className="text-sm text-[#6B6B6B]">
              Current month
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByCoach.map((coach) => (
                <HorizontalBar
                  key={coach.name}
                  label={coach.name}
                  value={coach.percentage}
                  max={100}
                  displayValue={formatCurrency(coach.amount)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Service Type */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#6B6B6B]" />
              <CardTitle>Revenue by Service</CardTitle>
            </div>
            <p className="text-sm text-[#6B6B6B]">
              Current month
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByService.map((service) => (
                <HorizontalBar
                  key={service.name}
                  label={service.name}
                  value={service.percentage}
                  max={100}
                  displayValue={formatCurrency(service.amount)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Client Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-[#6B6B6B]" />
              <CardTitle>New Clients per Month</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-[#F5F5F5] p-4 dark:bg-[#141414]">
                <p className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                  0
                </p>
                <p className="text-sm text-[#6B6B6B]">Active clients</p>
              </div>
              <div className="rounded-lg bg-[#F5F5F5] p-4 dark:bg-[#141414]">
                <p className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                  0
                </p>
                <p className="text-sm text-[#6B6B6B]">Inactive clients</p>
              </div>
            </div>
            <div className="space-y-4">
              {newClientsPerMonth.map((item) => (
                <HorizontalBar
                  key={item.month}
                  label={item.month}
                  value={item.count}
                  max={maxNewClients}
                  displayValue={`${item.count} new`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#6B6B6B]" />
              <CardTitle>Session Attendance</CardTitle>
            </div>
            <p className="text-sm text-[#6B6B6B]">
              Last 30 days
            </p>
          </CardHeader>
          <CardContent>
            {/* Summary stats */}
            <div className="mb-6 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-[#F5F5F5] p-3 text-center dark:bg-[#141414]">
                <p className="text-xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                  0%
                </p>
                <p className="text-xs text-[#6B6B6B]">Attendance</p>
              </div>
              <div className="rounded-lg bg-[#F5F5F5] p-3 text-center dark:bg-[#141414]">
                <p className="text-xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                  0%
                </p>
                <p className="text-xs text-[#6B6B6B]">Cancelled</p>
              </div>
              <div className="rounded-lg bg-[#F5F5F5] p-3 text-center dark:bg-[#141414]">
                <p className="text-xl font-bold text-[#C23B22]">
                  0%
                </p>
                <p className="text-xs text-[#6B6B6B]">No-show</p>
              </div>
            </div>

            {/* Attendance breakdown bars */}
            <div className="space-y-4">
              {attendanceData.map((item) => (
                <HorizontalBar
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  max={100}
                  displayValue={`${item.value}%`}
                  colorClass={item.color}
                />
              ))}
            </div>

            {/* Popular times */}
            <div className="mt-6 border-t border-[#E5E5E5] pt-4 dark:border-[#2A2A2A]">
              <h4 className="mb-3 text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                Most Popular Times
              </h4>
              <p className="text-sm text-[#6B6B6B]">No data available yet.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
