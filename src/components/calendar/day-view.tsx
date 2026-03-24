"use client";

import { useMemo, useState, useCallback } from "react";
import { format, isToday } from "date-fns";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { SessionBlock } from "./session-block";
import type { CalendarSession } from "./types";

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6am to 9pm
const HOUR_HEIGHT = 80; // h-20 = 5rem = 80px

function formatHour(hour: number): string {
  const period = hour >= 12 ? "pm" : "am";
  const displayHour = hour % 12 || 12;
  return `${displayHour}${period}`;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Draggable session wrapper
// ---------------------------------------------------------------------------

function DraggableSession({
  session,
  topPercent,
  heightPercent,
  onSessionClick,
}: {
  session: CalendarSession;
  topPercent: number;
  heightPercent: number;
  onSessionClick: (session: CalendarSession) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: session.id,
    data: { session },
  });

  return (
    <div
      ref={setNodeRef}
      className="absolute left-1 right-1 md:left-2 md:right-2"
      style={{
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
        minHeight: "32px",
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 0 : 1,
        cursor: "grab",
      }}
      {...attributes}
      {...listeners}
    >
      <SessionBlock session={session} onClick={onSessionClick} variant="full" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Droppable day area
// ---------------------------------------------------------------------------

function DroppableDayArea({
  dateKey,
  isTodayFlag,
  children,
}: {
  dateKey: string;
  isTodayFlag: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: dateKey });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 relative border-l border-[#E5E5E5] dark:border-[#2A2A2A]",
        isTodayFlag && !isOver && "bg-[#FAFAFA] dark:bg-[#111111]",
        isOver && "bg-[#F0F0F0] dark:bg-[#181818]"
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DayView
// ---------------------------------------------------------------------------

interface DayViewProps {
  currentDate: Date;
  sessions: CalendarSession[];
  onSessionClick: (session: CalendarSession) => void;
  onSessionMove?: (
    sessionId: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string
  ) => void;
}

export function DayView({
  currentDate,
  sessions,
  onSessionClick,
  onSessionMove,
}: DayViewProps) {
  const dateKey = format(currentDate, "yyyy-MM-dd");
  const today = isToday(currentDate);
  const [activeSession, setActiveSession] = useState<CalendarSession | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const daySessions = useMemo(
    () => sessions.filter((s) => s.date === dateKey),
    [sessions, dateKey]
  );

  const startHour = HOURS[0];
  const totalMinutes = HOURS.length * 60;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const session = event.active.data.current
      ?.session as CalendarSession | undefined;
    setActiveSession(session || null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event;
      setActiveSession(null);

      if (!onSessionMove) return;

      const session = active.data.current
        ?.session as CalendarSession | undefined;
      if (!session) return;

      // Calculate time offset from vertical delta (snap to 15min)
      const minutesDelta =
        Math.round(((delta.y / HOUR_HEIGHT) * 60) / 15) * 15;

      if (minutesDelta === 0) return;

      const originalStart = timeToMinutes(session.startTime);
      const originalEnd = timeToMinutes(session.endTime);
      const duration = originalEnd - originalStart;

      let newStart = originalStart + minutesDelta;
      const minMinutes = HOURS[0] * 60;
      const maxMinutes = (HOURS[HOURS.length - 1] + 1) * 60;
      newStart = Math.max(
        minMinutes,
        Math.min(newStart, maxMinutes - duration)
      );
      const newEnd = newStart + duration;

      onSessionMove(
        session.id,
        session.date,
        minutesToTime(newStart),
        minutesToTime(newEnd)
      );
    },
    [onSessionMove]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full">
        {/* Day header */}
        <div
          className={cn(
            "text-center py-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] sticky top-0 z-10 bg-white dark:bg-[#0A0A0A]",
            today && "bg-[#F5F5F5] dark:bg-[#141414]"
          )}
        >
          <p className="text-xs font-medium text-[#6B6B6B] uppercase">
            {format(currentDate, "EEEE")}
          </p>
          <p className="mt-1">
            <span
              className={cn(
                "inline-flex items-center justify-center w-10 h-10 rounded-full text-xl font-semibold",
                today
                  ? "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]"
                  : "text-[#0A0A0A] dark:text-[#FAFAFA]"
              )}
            >
              {format(currentDate, "d")}
            </span>
          </p>
          <p className="text-sm text-[#6B6B6B] mt-0.5">
            {format(currentDate, "MMMM yyyy")}
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-1 overflow-y-auto">
          {/* Time labels */}
          <div className="w-16 flex-shrink-0">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-20 relative border-b border-[#E5E5E5] dark:border-[#2A2A2A]"
              >
                <span className="absolute -top-2.5 right-2 text-xs text-[#6B6B6B] font-medium">
                  {formatHour(hour)}
                </span>
              </div>
            ))}
          </div>

          {/* Session area */}
          <DroppableDayArea dateKey={dateKey} isTodayFlag={today}>
            {/* Hour grid lines */}
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-20 border-b border-[#E5E5E5] dark:border-[#2A2A2A]"
              />
            ))}

            {/* Session blocks */}
            {daySessions.map((session) => {
              const startMin =
                timeToMinutes(session.startTime) - startHour * 60;
              const endMin = timeToMinutes(session.endTime) - startHour * 60;
              const duration = endMin - startMin;

              if (startMin < 0 || startMin >= totalMinutes) return null;

              const topPercent = (startMin / totalMinutes) * 100;
              const heightPercent = (duration / totalMinutes) * 100;

              return (
                <DraggableSession
                  key={session.id}
                  session={session}
                  topPercent={topPercent}
                  heightPercent={heightPercent}
                  onSessionClick={onSessionClick}
                />
              );
            })}
          </DroppableDayArea>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeSession ? (
          <div className="w-[250px] opacity-90 pointer-events-none">
            <SessionBlock session={activeSession} variant="full" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
