"use client";

import { Calendar, Bell, ArrowRight, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import Link from "next/link";

// Mock data
const clientName = "Lachlan Mitchell";

const upcomingSessions = [
  {
    id: "1",
    title: "1-on-1 Speed & Agility",
    date: "2026-03-25T16:00:00+11:00",
    coach: "James Sutera",
    location: "Princes Park - Field 2",
    type: "one_on_one" as const,
  },
  {
    id: "2",
    title: "Group Skills Session",
    date: "2026-03-27T17:30:00+11:00",
    coach: "Chris Sutera",
    location: "Gosch's Paddock",
    type: "group" as const,
  },
  {
    id: "3",
    title: "1-on-1 Match Analysis Review",
    date: "2026-03-30T10:00:00+11:00",
    coach: "James Sutera",
    location: "Online - Zoom",
    type: "one_on_one" as const,
  },
];

const recentNotifications = [
  {
    id: "1",
    type: "payment_reminder",
    title: "Invoice due",
    message: "Invoice #INV-042 for $150.00 is due on 28/03/2026",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "session_reminder",
    title: "Session tomorrow",
    message: "1-on-1 Speed & Agility with James at 4:00 PM",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "booking_confirmation",
    title: "Booking confirmed",
    message: "Group Skills Session on 27/03/2026 has been confirmed",
    time: "1 day ago",
    read: true,
  },
];

const sessionTypeLabels: Record<string, string> = {
  one_on_one: "1-on-1",
  group: "Group",
};

function getNotificationIcon(type: string) {
  switch (type) {
    case "payment_reminder":
      return <CreditCard className="h-4 w-4 text-[#6B6B6B]" />;
    case "session_reminder":
      return <Calendar className="h-4 w-4 text-[#6B6B6B]" />;
    default:
      return <Bell className="h-4 w-4 text-[#6B6B6B]" />;
  }
}

export default function ClientHomePage() {
  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
          Welcome back, {clientName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-[#6B6B6B]">
          Here is what is coming up for you.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link href="/schedule">
          <Card className="cursor-pointer transition-colors hover:border-[#0A0A0A] dark:hover:border-[#FAFAFA]">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A0A0A] dark:bg-[#FAFAFA]">
                <Calendar className="h-5 w-5 text-white dark:text-[#0A0A0A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                  Book a Session
                </p>
                <p className="text-xs text-[#6B6B6B]">View available slots</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#6B6B6B]" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/progress">
          <Card className="cursor-pointer transition-colors hover:border-[#0A0A0A] dark:hover:border-[#FAFAFA]">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A0A0A] dark:bg-[#FAFAFA]">
                <TrendingUp className="h-5 w-5 text-white dark:text-[#0A0A0A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                  View Progress
                </p>
                <p className="text-xs text-[#6B6B6B]">Track your performance</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#6B6B6B]" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/payments">
          <Card className="cursor-pointer transition-colors hover:border-[#0A0A0A] dark:hover:border-[#FAFAFA]">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0A0A0A] dark:bg-[#FAFAFA]">
                <CreditCard className="h-5 w-5 text-white dark:text-[#0A0A0A]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                  Pay Invoice
                </p>
                <p className="text-xs text-[#6B6B6B]">View outstanding payments</p>
              </div>
              <ArrowRight className="h-4 w-4 text-[#6B6B6B]" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <Link href="/schedule">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-4 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-4"
                >
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
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA] truncate">
                        {session.title}
                      </p>
                      <Badge variant="secondary">
                        {sessionTypeLabels[session.type]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[#6B6B6B]">
                      {formatTime(session.date)} - {session.coach}
                    </p>
                    <p className="text-sm text-[#6B6B6B]">{session.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${
                    notification.read
                      ? "border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A]"
                      : "border-[#0A0A0A] dark:border-[#FAFAFA] bg-white dark:bg-[#0A0A0A]"
                  }`}
                >
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-[#0A0A0A] dark:bg-[#FAFAFA]" />
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-[#6B6B6B]">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-[#6B6B6B]">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
