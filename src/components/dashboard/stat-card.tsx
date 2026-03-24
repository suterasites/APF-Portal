"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E5E5E5] dark:bg-[#2A2A2A]">
          <Icon className="h-5 w-5 text-[#0A0A0A] dark:text-[#FAFAFA]" />
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              trend.direction === "up"
                ? "bg-[#E5E5E5] dark:bg-[#2A2A2A] text-[#0A0A0A] dark:text-[#FAFAFA]"
                : "bg-[#C23B22]/10 text-[#C23B22]"
            )}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
          {value}
        </p>
        <p className="mt-1 text-sm text-[#6B6B6B]">{label}</p>
      </div>
    </div>
  );
}
