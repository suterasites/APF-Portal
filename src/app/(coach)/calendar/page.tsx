"use client";

import { useState, useMemo, useCallback } from "react";
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeekView } from "@/components/calendar/week-view";
import { MonthView } from "@/components/calendar/month-view";
import { DayView } from "@/components/calendar/day-view";
import { SessionModal } from "@/components/calendar/session-modal";
import type { CalendarSession } from "@/components/calendar/types";

// ---------------------------------------------------------------------------
// View types
// ---------------------------------------------------------------------------

type CalendarView = "day" | "week" | "month";

type CoachFilter = "all" | "James" | "Chris";

// ---------------------------------------------------------------------------
// Session data (populated from database)
// ---------------------------------------------------------------------------

function generateMockSessions(): CalendarSession[] {
  return [];
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("week");
  const [coachFilter, setCoachFilter] = useState<CoachFilter>("all");
  const [sessions, setSessions] = useState<CalendarSession[]>(generateMockSessions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<CalendarSession | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Filter sessions by coach
  const filteredSessions = useMemo(() => {
    if (coachFilter === "all") return sessions;
    return sessions.filter((s) => s.coach === coachFilter);
  }, [sessions, coachFilter]);

  // Navigation
  function goToday() {
    setCurrentDate(new Date());
  }

  function goPrevious() {
    if (view === "day") setCurrentDate((d) => subDays(d, 1));
    else if (view === "week") setCurrentDate((d) => subWeeks(d, 1));
    else setCurrentDate((d) => subMonths(d, 1));
  }

  function goNext() {
    if (view === "day") setCurrentDate((d) => addDays(d, 1));
    else if (view === "week") setCurrentDate((d) => addWeeks(d, 1));
    else setCurrentDate((d) => addMonths(d, 1));
  }

  // Current date range label
  const dateLabel = useMemo(() => {
    if (view === "day") {
      return format(currentDate, "EEEE, d MMMM yyyy");
    }
    if (view === "week") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      const startMonth = format(weekStart, "MMM");
      const endMonth = format(weekEnd, "MMM");
      if (startMonth === endMonth) {
        return `${format(weekStart, "d")} - ${format(weekEnd, "d")} ${format(weekEnd, "MMMM yyyy")}`;
      }
      return `${format(weekStart, "d MMM")} - ${format(weekEnd, "d MMM yyyy")}`;
    }
    return format(currentDate, "MMMM yyyy");
  }, [currentDate, view]);

  // Session click handler
  const handleSessionClick = useCallback((session: CalendarSession) => {
    setEditingSession(session);
    setModalOpen(true);
  }, []);

  // Create new session
  function handleNewSession() {
    setEditingSession(null);
    setModalOpen(true);
  }

  // Move session (drag-and-drop)
  const handleSessionMove = useCallback(
    (sessionId: string, newDate: string, newStartTime: string, newEndTime: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, date: newDate, startTime: newStartTime, endTime: newEndTime }
            : s
        )
      );
    },
    []
  );

  // Save session (create or update)
  function handleSaveSession(sessionData: Omit<CalendarSession, "id"> & { id?: string }) {
    if (sessionData.id) {
      // Update existing
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionData.id ? { ...s, ...sessionData } as CalendarSession : s
        )
      );
    } else {
      // Create new
      const newSession: CalendarSession = {
        ...sessionData,
        id: `new-${Date.now()}`,
      } as CalendarSession;
      setSessions((prev) => [...prev, newSession]);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A]">
        {/* Left section - Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>

          <div className="flex items-center">
            <button
              onClick={goPrevious}
              className="p-1.5 rounded-lg text-[#6B6B6B] hover:bg-[#F5F5F5] dark:hover:bg-[#141414] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="p-1.5 rounded-lg text-[#6B6B6B] hover:bg-[#F5F5F5] dark:hover:bg-[#141414] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <h1 className="text-lg sm:text-xl font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
            {dateLabel}
          </h1>
        </div>

        {/* Right section - View toggle, filter, add */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] overflow-hidden">
            {(["day", "week", "month"] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={
                  view === v
                    ? "px-3 py-1.5 text-sm font-medium bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]"
                    : "px-3 py-1.5 text-sm font-medium text-[#6B6B6B] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] hover:bg-[#F5F5F5] dark:hover:bg-[#141414] transition-colors"
                }
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Coach filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterMenuOpen((prev) => !prev)}
              className="gap-1.5"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">
                {coachFilter === "all" ? "All Coaches" : coachFilter}
              </span>
            </Button>

            {filterMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setFilterMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] shadow-lg overflow-hidden">
                  {(["all", "James", "Chris"] as CoachFilter[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setCoachFilter(option);
                        setFilterMenuOpen(false);
                      }}
                      className={
                        coachFilter === option
                          ? "w-full text-left px-3 py-2 text-sm font-medium bg-[#F5F5F5] dark:bg-[#141414] text-[#0A0A0A] dark:text-[#FAFAFA]"
                          : "w-full text-left px-3 py-2 text-sm text-[#6B6B6B] hover:bg-[#F5F5F5] dark:hover:bg-[#141414] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] transition-colors"
                      }
                    >
                      {option === "all" ? "All Coaches" : option}
                      {option !== "all" && (
                        <span
                          className={`ml-2 inline-block w-2.5 h-2.5 rounded-full ${
                            option === "James"
                              ? "bg-[#0A0A0A] dark:bg-[#FAFAFA]"
                              : "bg-[#6B6B6B] dark:bg-[#999999]"
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Add session */}
          <Button size="sm" onClick={handleNewSession} className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Session</span>
          </Button>
        </div>
      </div>

      {/* Calendar view */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-[#0A0A0A]">
        {view === "week" && (
          <WeekView
            currentDate={currentDate}
            sessions={filteredSessions}
            onSessionClick={handleSessionClick}
            onSessionMove={handleSessionMove}
          />
        )}
        {view === "month" && (
          <MonthView
            currentDate={currentDate}
            sessions={filteredSessions}
            onSessionClick={handleSessionClick}
          />
        )}
        {view === "day" && (
          <DayView
            currentDate={currentDate}
            sessions={filteredSessions}
            onSessionClick={handleSessionClick}
            onSessionMove={handleSessionMove}
          />
        )}
      </div>

      {/* Session modal */}
      <SessionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSession(null);
        }}
        session={editingSession}
        onSave={handleSaveSession}
      />
    </div>
  );
}
