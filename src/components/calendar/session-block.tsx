"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SESSION_TYPE_LABELS } from "@/lib/constants";
import type { CalendarSession } from "./types";

export interface SessionBlockProps {
  session: CalendarSession;
  onClick?: (session: CalendarSession) => void;
  variant?: "compact" | "full";
}

function getCoachStyles(coach: string) {
  if (coach === "James") {
    return "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A] border-[#0A0A0A] dark:border-[#FAFAFA]";
  }
  return "bg-[#6B6B6B] text-white dark:bg-[#999999] dark:text-[#0A0A0A] border-[#6B6B6B] dark:border-[#999999]";
}

function formatSessionTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  const displayHours = hours % 12 || 12;
  if (minutes === 0) return `${displayHours}${period}`;
  return `${displayHours}:${minutes.toString().padStart(2, "0")}${period}`;
}

export function SessionBlock({ session, onClick, variant = "full" }: SessionBlockProps) {
  const coachStyles = getCoachStyles(session.coach);

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => onClick?.(session)}
        className={cn(
          "w-full text-left rounded-md px-1.5 py-0.5 text-xs font-medium truncate transition-opacity hover:opacity-80",
          coachStyles
        )}
      >
        {formatSessionTime(session.startTime)} {session.title}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onClick?.(session)}
      className={cn(
        "w-full h-full text-left rounded-lg px-2.5 py-1.5 transition-opacity hover:opacity-80 overflow-hidden",
        coachStyles
      )}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="text-xs font-semibold">
          {formatSessionTime(session.startTime)} - {formatSessionTime(session.endTime)}
        </span>
      </div>
      <p className="text-sm font-medium truncate">{session.title}</p>
      {session.clients && session.clients.length > 0 && (
        <p className="text-xs opacity-80 truncate">
          {session.clients.join(", ")}
        </p>
      )}
      <div className="flex items-center gap-1.5 mt-1">
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] px-1.5 py-0 border-current opacity-70",
            session.coach === "James"
              ? "text-white dark:text-[#0A0A0A]"
              : "text-white dark:text-[#0A0A0A]"
          )}
        >
          {SESSION_TYPE_LABELS[session.type]}
        </Badge>
        <span className="text-[10px] opacity-70">{session.coach}</span>
      </div>
    </button>
  );
}
