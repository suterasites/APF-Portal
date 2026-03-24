"use client";

import { Clock, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ScheduleSession {
  id: string;
  startTime: string;
  endTime: string;
  clientNames: string[];
  type: "one_on_one" | "group";
  location: string;
  coachName: string;
}

const todaySessions: ScheduleSession[] = [];

function SessionTypeBadge({ type }: { type: "one_on_one" | "group" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        type === "one_on_one"
          ? "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]"
          : "bg-[#E5E5E5] text-[#0A0A0A] dark:bg-[#2A2A2A] dark:text-[#FAFAFA]"
      )}
    >
      {type === "one_on_one" ? "1-on-1" : "Group"}
    </span>
  );
}

function CoachBadge({ name }: { name: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        name === "James"
          ? "bg-[#0A0A0A]/10 text-[#0A0A0A] dark:bg-[#FAFAFA]/10 dark:text-[#FAFAFA]"
          : "bg-[#6B6B6B]/10 text-[#6B6B6B]"
      )}
    >
      {name}
    </span>
  );
}

export function TodaySchedule() {
  return (
    <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414]">
      <div className="flex items-center justify-between p-6 pb-4">
        <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
          Today&apos;s Schedule
        </h2>
        <Link
          href="/calendar"
          className="flex items-center gap-1 text-sm text-[#6B6B6B] transition-colors hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA]"
        >
          View calendar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {todaySessions.length === 0 ? (
        <div className="px-6 pb-6">
          <p className="text-sm text-[#6B6B6B]">No sessions scheduled for today.</p>
        </div>
      ) : (
        <div className="px-6 pb-6">
          <ul className="space-y-3">
            {todaySessions.map((session) => (
              <li
                key={session.id}
                className="rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-4 transition-colors hover:border-[#0A0A0A]/20 dark:hover:border-[#FAFAFA]/20"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {session.clientNames.length <= 2
                          ? session.clientNames.join(", ")
                          : `${session.clientNames[0]} + ${session.clientNames.length - 1} others`}
                      </span>
                      <SessionTypeBadge type={session.type} />
                      <CoachBadge name={session.coachName} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#6B6B6B]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {session.startTime} - {session.endTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {session.location}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
