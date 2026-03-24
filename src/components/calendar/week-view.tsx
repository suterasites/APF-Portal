"use client";

import { useMemo, useState, useCallback } from "react";
import { format, addDays, startOfWeek, isToday } from "date-fns";
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
const HOUR_HEIGHT = 64; // h-16 = 4rem = 64px

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
  variant,
}: {
  session: CalendarSession;
  topPercent: number;
  heightPercent: number;
  onSessionClick: (session: CalendarSession) => void;
  variant: "compact" | "full";
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: session.id,
    data: { session },
  });

  return (
    <div
      ref={setNodeRef}
      className="absolute left-0.5 right-0.5"
      style={{
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
        minHeight: "24px",
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 0 : 1,
        cursor: "grab",
      }}
      {...attributes}
      {...listeners}
    >
      <SessionBlock
        session={session}
        onClick={onSessionClick}
        variant={variant}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Droppable day column
// ---------------------------------------------------------------------------

function DroppableDay({
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
        "flex-1 min-w-[120px] relative border-l border-[#E5E5E5] dark:border-[#2A2A2A]",
        isTodayFlag && !isOver && "bg-[#FAFAFA] dark:bg-[#111111]",
        isOver && "bg-[#F0F0F0] dark:bg-[#181818]"
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// WeekView
// ---------------------------------------------------------------------------

interface WeekViewProps {
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

export function WeekView({
  currentDate,
  sessions,
  onSessionClick,
  onSessionMove,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
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

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, CalendarSession[]>();
    for (const day of weekDays) {
      const key = format(day, "yyyy-MM-dd");
      map.set(
        key,
        sessions.filter((s) => s.date === key)
      );
    }
    return map;
  }, [sessions, weekDays]);

  const startHour = HOURS[0];
  const totalMinutes = HOURS.length * 60;

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const session = event.active.data.current
        ?.session as CalendarSession | undefined;
      setActiveSession(session || null);
    },
    []
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over, delta } = event;
      setActiveSession(null);

      if (!over || !onSessionMove) return;

      const session = active.data.current
        ?.session as CalendarSession | undefined;
      if (!session) return;

      const newDate = over.id as string;

      // Calculate time offset from vertical delta (snap to 15min)
      const minutesDelta =
        Math.round(((delta.y / HOUR_HEIGHT) * 60) / 15) * 15;

      const originalStart = timeToMinutes(session.startTime);
      const originalEnd = timeToMinutes(session.endTime);
      const duration = originalEnd - originalStart;

      let newStart = originalStart + minutesDelta;
      // Clamp to grid bounds
      const minMinutes = HOURS[0] * 60;
      const maxMinutes = (HOURS[HOURS.length - 1] + 1) * 60;
      newStart = Math.max(
        minMinutes,
        Math.min(newStart, maxMinutes - duration)
      );
      const newEnd = newStart + duration;

      const newStartTime = minutesToTime(newStart);
      const newEndTime = minutesToTime(newEnd);

      if (newDate !== session.date || newStartTime !== session.startTime) {
        onSessionMove(session.id, newDate, newStartTime, newEndTime);
      }
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
        {/* Day headers */}
        <div className="flex border-b border-[#E5E5E5] dark:border-[#2A2A2A] sticky top-0 z-10 bg-white dark:bg-[#0A0A0A]">
          {/* Time gutter */}
          <div className="w-16 flex-shrink-0" />

          {weekDays.map((day) => {
            const today = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "flex-1 min-w-[120px] text-center py-3 border-l border-[#E5E5E5] dark:border-[#2A2A2A]",
                  today && "bg-[#F5F5F5] dark:bg-[#141414]"
                )}
              >
                <p className="text-xs font-medium text-[#6B6B6B] uppercase">
                  {format(day, "EEE")}
                </p>
                <p
                  className={cn(
                    "text-lg font-semibold mt-0.5",
                    "text-[#0A0A0A] dark:text-[#FAFAFA]"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full",
                      today &&
                        "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="flex flex-1 overflow-y-auto overflow-x-auto">
          {/* Time labels */}
          <div className="w-16 flex-shrink-0">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-16 relative border-b border-[#E5E5E5] dark:border-[#2A2A2A]"
              >
                <span className="absolute -top-2.5 right-2 text-xs text-[#6B6B6B] font-medium">
                  {formatHour(hour)}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const daySessions = sessionsByDay.get(dateKey) || [];
            const todayFlag = isToday(day);

            return (
              <DroppableDay
                key={day.toISOString()}
                dateKey={dateKey}
                isTodayFlag={todayFlag}
              >
                {/* Hour grid lines */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-[#E5E5E5] dark:border-[#2A2A2A]"
                  />
                ))}

                {/* Session blocks */}
                {daySessions.map((session) => {
                  const startMin =
                    timeToMinutes(session.startTime) - startHour * 60;
                  const endMin =
                    timeToMinutes(session.endTime) - startHour * 60;
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
                      variant={duration <= 30 ? "compact" : "full"}
                    />
                  );
                })}
              </DroppableDay>
            );
          })}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeSession ? (
          <div className="w-[160px] opacity-90 pointer-events-none">
            <SessionBlock session={activeSession} variant="full" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
