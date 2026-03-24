"use client";

import {
  TrendingUp,
  Activity,
  Dumbbell,
  Calendar,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

// Mock data for a football player
const latestAssessment = {
  id: "1",
  date: "2026-03-15",
  coach: "James Sutera",
  metrics: [
    { name: "10m Sprint", value: "1.82", unit: "sec", previousValue: "1.89" },
    { name: "20m Sprint", value: "3.14", unit: "sec", previousValue: "3.22" },
    { name: "40m Sprint", value: "5.41", unit: "sec", previousValue: "5.58" },
    { name: "T-Test Agility", value: "9.62", unit: "sec", previousValue: "9.91" },
    { name: "Vertical Jump", value: "58", unit: "cm", previousValue: "55" },
    { name: "Yo-Yo IR1", value: "18.4", unit: "level", previousValue: "17.8" },
    { name: "Passing Accuracy", value: "82", unit: "%", previousValue: "78" },
    { name: "Shooting Accuracy", value: "71", unit: "%", previousValue: "68" },
  ],
};

const progressMetrics = [
  { name: "10m Sprint", current: 1.82, initial: 2.01, unit: "sec", lowerIsBetter: true },
  { name: "40m Sprint", current: 5.41, initial: 5.85, unit: "sec", lowerIsBetter: true },
  { name: "T-Test Agility", current: 9.62, initial: 10.45, unit: "sec", lowerIsBetter: true },
  { name: "Vertical Jump", current: 58, initial: 48, unit: "cm", lowerIsBetter: false },
  { name: "Yo-Yo IR1", current: 18.4, initial: 16.2, unit: "level", lowerIsBetter: false },
  { name: "Passing Accuracy", current: 82, initial: 70, unit: "%", lowerIsBetter: false },
];

const currentProgram = {
  id: "1",
  name: "Pre-Season Speed Development",
  coach: "James Sutera",
  status: "active" as const,
  currentPhase: "Phase 2 - Speed Development",
  durationWeeks: 8,
  currentWeek: 4,
  exercises: [
    { name: "A-Skip Drills", sets: 3, reps: "20m", category: "Speed" },
    { name: "Acceleration Sprints", sets: 5, reps: "10m", category: "Speed" },
    { name: "Lateral Shuffle", sets: 4, reps: "15m each way", category: "Agility" },
    { name: "Box Jumps", sets: 4, reps: "8", category: "Strength" },
    { name: "Ball Control Circuit", sets: 3, reps: "5 min", category: "Technical" },
  ],
};

const assessmentHistory = [
  { id: "1", date: "2026-03-15", coach: "James Sutera", metricsCount: 8 },
  { id: "2", date: "2026-02-15", coach: "James Sutera", metricsCount: 8 },
  { id: "3", date: "2026-01-10", coach: "Chris Sutera", metricsCount: 6 },
  { id: "4", date: "2025-11-20", coach: "James Sutera", metricsCount: 8 },
  { id: "5", date: "2025-10-05", coach: "James Sutera", metricsCount: 6 },
];

function getImprovementPercentage(current: number, initial: number, lowerIsBetter: boolean): number {
  if (lowerIsBetter) {
    return Math.round(((initial - current) / initial) * 100);
  }
  return Math.round(((current - initial) / initial) * 100);
}

function getProgressBarWidth(current: number, initial: number, lowerIsBetter: boolean): number {
  const improvement = getImprovementPercentage(current, initial, lowerIsBetter);
  return Math.min(Math.max(improvement, 5), 100);
}

export default function ClientProgressPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
          My Progress
        </h1>
        <p className="mt-1 text-[#6B6B6B]">
          Track your performance and improvement over time.
        </p>
      </div>

      {/* Latest Assessment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Latest Assessment
            </CardTitle>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              {formatDate(latestAssessment.date)} - Assessed by {latestAssessment.coach}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {latestAssessment.metrics.map((metric) => {
              const currentVal = parseFloat(metric.value);
              const previousVal = parseFloat(metric.previousValue);
              const isImproved =
                metric.unit === "sec"
                  ? currentVal < previousVal
                  : currentVal > previousVal;

              return (
                <div
                  key={metric.name}
                  className="rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-3"
                >
                  <p className="text-xs font-medium text-[#6B6B6B]">
                    {metric.name}
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                    {metric.value}
                    <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                      {metric.unit}
                    </span>
                  </p>
                  <p
                    className={`mt-0.5 text-xs ${
                      isImproved ? "text-[#1E7E34]" : "text-[#C23B22]"
                    }`}
                  >
                    {isImproved ? "+" : ""}
                    {metric.unit === "sec"
                      ? (previousVal - currentVal).toFixed(2)
                      : (currentVal - previousVal).toFixed(1)}
                    {metric.unit === "sec" ? "s faster" : ` ${metric.unit}`}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Progress Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Over Time
            </CardTitle>
            <p className="text-sm text-[#6B6B6B]">
              Improvement from your first assessment
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressMetrics.map((metric) => {
                const improvement = getImprovementPercentage(
                  metric.current,
                  metric.initial,
                  metric.lowerIsBetter
                );
                const barWidth = getProgressBarWidth(
                  metric.current,
                  metric.initial,
                  metric.lowerIsBetter
                );

                return (
                  <div key={metric.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                        {metric.name}
                      </span>
                      <span className="text-[#6B6B6B]">
                        {metric.current} {metric.unit}
                        <span className="ml-2 text-xs text-[#1E7E34]">
                          +{improvement}%
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                      <div
                        className="h-full rounded-full bg-[#0A0A0A] dark:bg-[#FAFAFA] transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                    <div className="mt-0.5 flex justify-between text-xs text-[#6B6B6B]">
                      <span>
                        Start: {metric.initial} {metric.unit}
                      </span>
                      <span>
                        Now: {metric.current} {metric.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Program */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5" />
                Current Program
              </CardTitle>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-sm text-[#6B6B6B]">
              {currentProgram.name}
            </p>
          </CardHeader>
          <CardContent>
            {/* Program progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                  {currentProgram.currentPhase}
                </span>
                <span className="text-[#6B6B6B]">
                  Week {currentProgram.currentWeek} of {currentProgram.durationWeeks}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                <div
                  className="h-full rounded-full bg-[#0A0A0A] dark:bg-[#FAFAFA]"
                  style={{
                    width: `${(currentProgram.currentWeek / currentProgram.durationWeeks) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Exercises */}
            <p className="mb-2 text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
              Current Exercises
            </p>
            <div className="space-y-2">
              {currentProgram.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {exercise.name}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      {exercise.sets} sets x {exercise.reps}
                    </p>
                  </div>
                  <Badge variant="secondary">{exercise.category}</Badge>
                </div>
              ))}
            </div>

            <p className="mt-3 text-xs text-[#6B6B6B]">
              Assigned by {currentProgram.coach}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assessment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Assessment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {assessmentHistory.map((assessment, index) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5F5F5] dark:bg-[#141414]">
                    <Calendar className="h-5 w-5 text-[#6B6B6B]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                      Assessment {assessmentHistory.length - index}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      {formatDate(assessment.date)} - {assessment.coach}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">
                    {assessment.metricsCount} metrics
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
