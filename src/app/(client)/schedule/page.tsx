"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";

// Data placeholders
const upcomingSessions: {
  id: string;
  title: string;
  date: string;
  endTime: string;
  coach: string;
  location: string;
  type: "one_on_one" | "group";
  status: "scheduled" | "completed" | "cancelled" | "no_show";
}[] = [];

const pastSessions: {
  id: string;
  title: string;
  date: string;
  endTime: string;
  coach: string;
  location: string;
  type: "one_on_one" | "group";
  status: "scheduled" | "completed" | "cancelled" | "no_show";
}[] = [];

const availableSlots: {
  id: string;
  title: string;
  date: string;
  endTime: string;
  coach: string;
  location: string;
  type: "one_on_one" | "group";
  spotsLeft?: number;
}[] = [];

const sessionTypeLabels: Record<string, string> = {
  one_on_one: "1-on-1",
  group: "Group",
};

const statusBadgeVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  scheduled: "default",
  completed: "success",
  cancelled: "destructive",
  no_show: "warning",
};

const statusLabels: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

type Tab = "upcoming" | "past" | "book";

export default function ClientSchedulePage() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
            Schedule
          </h1>
          <p className="mt-1 text-[#6B6B6B]">
            View your sessions and book new ones.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-1">
        {[
          { key: "upcoming" as Tab, label: "Upcoming", icon: Calendar },
          { key: "past" as Tab, label: "Past Sessions", icon: Clock },
          { key: "book" as Tab, label: "Book Session", icon: Plus },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-white dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#FAFAFA] shadow-sm"
                : "text-[#6B6B6B] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA]"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Upcoming Sessions */}
      {activeTab === "upcoming" && (
        <div className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-[#6B6B6B]" />
                <p className="mt-4 text-lg font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                  No upcoming sessions
                </p>
                <p className="mt-1 text-sm text-[#6B6B6B]">
                  Book a session to get started.
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("book")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Book Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-[#0A0A0A] dark:bg-[#FAFAFA] px-3 py-2 text-center">
                      <span className="text-xs font-medium text-white dark:text-[#0A0A0A]">
                        {new Date(session.date).toLocaleDateString("en-AU", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-lg font-bold text-white dark:text-[#0A0A0A]">
                        {new Date(session.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                          {session.title}
                        </p>
                        <Badge variant="secondary">
                          {sessionTypeLabels[session.type]}
                        </Badge>
                        <Badge variant={statusBadgeVariant[session.status]}>
                          {statusLabels[session.status]}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:gap-4">
                        <span className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(session.date)} - {formatTime(session.endTime)}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                          <MapPin className="h-3.5 w-3.5" />
                          {session.location}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#6B6B6B]">
                        Coach: {session.coach}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Past Sessions */}
      {activeTab === "past" && (
        <div className="space-y-4">
          {pastSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-[#6B6B6B]" />
                <p className="mt-4 text-lg font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                  No past sessions
                </p>
                <p className="mt-1 text-sm text-[#6B6B6B]">
                  Your completed sessions will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            pastSessions.map((session) => (
              <Card key={session.id} className="opacity-80">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-[#6B6B6B] px-3 py-2 text-center">
                      <span className="text-xs font-medium text-white">
                        {new Date(session.date).toLocaleDateString("en-AU", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-lg font-bold text-white">
                        {new Date(session.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                          {session.title}
                        </p>
                        <Badge variant="secondary">
                          {sessionTypeLabels[session.type]}
                        </Badge>
                        <Badge variant={statusBadgeVariant[session.status]}>
                          {statusLabels[session.status]}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:gap-4">
                        <span className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(session.date)} - {formatTime(session.endTime)}
                        </span>
                        <span className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                          <MapPin className="h-3.5 w-3.5" />
                          {session.location}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#6B6B6B]">
                        Coach: {session.coach}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Book Session */}
      {activeTab === "book" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Available Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableSlots.length === 0 ? (
                <p className="text-sm text-[#6B6B6B]">No available slots at this time. Check back later.</p>
              ) : (
              <>
              <p className="mb-4 text-sm text-[#6B6B6B]">
                Select an available slot below to book your session.
              </p>
              <div className="space-y-3">
                {availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col gap-3 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center justify-center rounded-lg bg-[#0A0A0A] dark:bg-[#FAFAFA] px-3 py-2 text-center">
                        <span className="text-xs font-medium text-white dark:text-[#0A0A0A]">
                          {new Date(slot.date).toLocaleDateString("en-AU", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-lg font-bold text-white dark:text-[#0A0A0A]">
                          {new Date(slot.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                            {slot.title}
                          </p>
                          <Badge variant="secondary">
                            {sessionTypeLabels[slot.type]}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:gap-3">
                          <span className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                            <Clock className="h-3.5 w-3.5" />
                            {formatTime(slot.date)} - {formatTime(slot.endTime)}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-[#6B6B6B]">
                            <MapPin className="h-3.5 w-3.5" />
                            {slot.location}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#6B6B6B]">
                          Coach: {slot.coach}
                          {"spotsLeft" in slot &&
                            ` - ${slot.spotsLeft} spots left`}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" className="shrink-0">
                      <Check className="mr-1.5 h-4 w-4" />
                      Book
                    </Button>
                  </div>
                ))}
              </div>
              </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
