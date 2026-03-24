"use client";

import { useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { SessionBlock } from "./session-block";
import type { CalendarSession } from "./types";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface MonthViewProps {
  currentDate: Date;
  sessions: CalendarSession[];
  onSessionClick: (session: CalendarSession) => void;
}

export function MonthView({ currentDate, sessions, onSessionClick }: MonthViewProps) {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, CalendarSession[]>();
    for (const session of sessions) {
      const existing = map.get(session.date) || [];
      existing.push(session);
      map.set(session.date, existing);
    }
    return map;
  }, [sessions]);

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  return (
    <div className="flex flex-col h-full">
      {/* Day of week headers */}
      <div className="grid grid-cols-7 border-b border-[#E5E5E5] dark:border-[#2A2A2A]">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-xs font-medium text-[#6B6B6B] uppercase"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-rows-[repeat(auto-fill,minmax(0,1fr))]">
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="grid grid-cols-7 border-b border-[#E5E5E5] dark:border-[#2A2A2A] last:border-b-0"
          >
            {week.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const daySessions = sessionsByDay.get(dateKey) || [];
              const inCurrentMonth = isSameMonth(day, currentDate);
              const today = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[100px] p-1.5 border-r border-[#E5E5E5] dark:border-[#2A2A2A] last:border-r-0",
                    !inCurrentMonth && "bg-[#FAFAFA] dark:bg-[#0F0F0F]",
                    today && "bg-[#F5F5F5] dark:bg-[#141414]"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-sm font-medium inline-flex items-center justify-center w-6 h-6 rounded-full",
                        !inCurrentMonth && "text-[#6B6B6B]",
                        inCurrentMonth && "text-[#0A0A0A] dark:text-[#FAFAFA]",
                        today &&
                          "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  <div className="space-y-0.5 overflow-hidden">
                    {daySessions.slice(0, 3).map((session) => (
                      <SessionBlock
                        key={session.id}
                        session={session}
                        onClick={onSessionClick}
                        variant="compact"
                      />
                    ))}
                    {daySessions.length > 3 && (
                      <p className="text-xs text-[#6B6B6B] font-medium px-1">
                        +{daySessions.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
