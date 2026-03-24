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

// Data placeholders
const latestAssessment = {
  id: "",
  date: "",
  coach: "",
  metrics: [] as { name: string; value: string; unit: string; previousValue: string }[],
};

const progressMetrics: { name: string; current: number; initial: number; unit: string; lowerIsBetter: boolean }[] = [];

const currentProgram = {
  id: "",
  name: "",
  coach: "",
  status: "active" as const,
  currentPhase: "",
  durationWeeks: 0,
  currentWeek: 0,
  exercises: [] as { name: string; sets: number; reps: string; category: string }[],
};

const assessmentHistory: { id: string; date: string; coach: string; metricsCount: number }[] = [];

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
            {latestAssessment.date && (
              <p className="mt-1 text-sm text-[#6B6B6B]">
                {formatDate(latestAssessment.date)} - Assessed by {latestAssessment.coach}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {latestAssessment.metrics.length === 0 ? (
            <p className="text-sm text-[#6B6B6B]">No assessments recorded yet.</p>
          ) : (
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
          )}
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
            {progressMetrics.length === 0 ? (
              <p className="text-sm text-[#6B6B6B]">No progress data available yet.</p>
            ) : (
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
            )}
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
              {currentProgram.name && <Badge variant="success">Active</Badge>}
            </div>
            {currentProgram.name && (
              <p className="text-sm text-[#6B6B6B]">
                {currentProgram.name}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!currentProgram.name ? (
              <p className="text-sm text-[#6B6B6B]">No program assigned yet.</p>
            ) : (
              <>
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
                        width: `${currentProgram.durationWeeks > 0 ? (currentProgram.currentWeek / currentProgram.durationWeeks) * 100 : 0}%`,
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
              </>
            )}
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
          {assessmentHistory.length === 0 ? (
            <p className="text-sm text-[#6B6B6B]">No assessment history available.</p>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
