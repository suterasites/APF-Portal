"use client";

import {
  Calendar,
  DollarSign,
  XCircle,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType =
  | "booking_created"
  | "payment_received"
  | "session_cancelled"
  | "client_added";

interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
}

const recentActivities: ActivityItem[] = [];

const activityConfig: Record<
  ActivityType,
  { icon: React.ElementType; color: string }
> = {
  booking_created: {
    icon: Calendar,
    color:
      "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]",
  },
  payment_received: {
    icon: DollarSign,
    color:
      "bg-[#E5E5E5] text-[#0A0A0A] dark:bg-[#2A2A2A] dark:text-[#FAFAFA]",
  },
  session_cancelled: {
    icon: XCircle,
    color: "bg-[#C23B22]/10 text-[#C23B22]",
  },
  client_added: {
    icon: UserPlus,
    color:
      "bg-[#6B6B6B]/10 text-[#6B6B6B]",
  },
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414]">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
          Recent Activity
        </h2>
        <button className="flex items-center gap-1 text-sm text-[#6B6B6B] transition-colors hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA]">
          View all
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="px-6 pb-6">
        {recentActivities.length === 0 ? (
          <p className="text-sm text-[#6B6B6B]">No recent activity.</p>
        ) : (
        <ul className="space-y-4">
          {recentActivities.map((activity) => {
            const config = activityConfig[activity.type];
            const Icon = config.icon;

            return (
              <li key={activity.id} className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    config.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0A0A0A] dark:text-[#FAFAFA]">
                    {activity.description}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6B6B6B]">
                    {activity.timestamp}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        )}
      </div>
    </div>
  );
}
