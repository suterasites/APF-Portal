"use client";

import { useState } from "react";
import {
  Dumbbell,
  Plus,
  ChevronRight,
  ChevronDown,
  Clock,
  Users,
  Calendar,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

// -------------------------------------------------
// Types
// -------------------------------------------------

interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  rest?: string;
  notes?: string;
}

interface Phase {
  name: string;
  exercises: Exercise[];
}

interface Program {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  category: string;
  clientsAssigned: number;
  createdAt: string;
  status: "active" | "completed" | "archived";
  phases: Phase[];
}

// -------------------------------------------------
// Program data (populated from database)
// -------------------------------------------------

const mockPrograms: Program[] = [];

const categoryColors: Record<string, string> = {
  Speed: "default",
  Technical: "secondary",
  Endurance: "outline",
  Agility: "default",
};

// -------------------------------------------------
// Component
// -------------------------------------------------

export default function ProgramsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  function toggleExpanded(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
            Training Programs
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Build and assign structured training plans to your clients.
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Program
        </Button>
      </div>

      {/* Programs List */}
      {mockPrograms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] py-16">
          <Dumbbell className="h-10 w-10 text-[#6B6B6B] mb-3" />
          <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">No programs yet</p>
          <p className="mt-1 text-xs text-[#6B6B6B]">Create your first training program to get started.</p>
        </div>
      ) : (
      <div className="space-y-4">
        {mockPrograms.map((program) => {
          const isExpanded = expandedId === program.id;
          return (
            <Card key={program.id}>
              <CardHeader>
                <button
                  onClick={() => toggleExpanded(program.id)}
                  className="flex w-full items-start justify-between text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-base">
                        {program.name}
                      </CardTitle>
                      <Badge
                        variant={
                          (categoryColors[program.category] as
                            | "default"
                            | "secondary"
                            | "outline") || "secondary"
                        }
                      >
                        {program.category}
                      </Badge>
                      {program.status === "archived" && (
                        <Badge variant="secondary">Archived</Badge>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-[#6B6B6B]">
                      {program.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#6B6B6B]">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {program.durationWeeks} weeks
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {program.clientsAssigned} client
                        {program.clientsAssigned !== 1 ? "s" : ""}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Created {formatDate(program.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Dumbbell className="h-3.5 w-3.5" />
                        {program.phases.length} phase
                        {program.phases.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 mt-1 flex-shrink-0">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-[#6B6B6B]" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-[#6B6B6B]" />
                    )}
                  </div>
                </button>
              </CardHeader>

              {/* Expanded content - phases and exercises */}
              {isExpanded && (
                <CardContent>
                  <div className="space-y-6">
                    {program.phases.map((phase, phaseIndex) => (
                      <div key={phaseIndex}>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                          <Play className="h-3.5 w-3.5" />
                          {phase.name}
                        </h4>
                        <div className="ml-5 space-y-2">
                          {phase.exercises.map((exercise, exIndex) => (
                            <div
                              key={exIndex}
                              className="rounded-lg border border-[#E5E5E5] bg-white p-3 dark:border-[#2A2A2A] dark:bg-[#0A0A0A]"
                            >
                              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                                  {exercise.name}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B6B6B]">
                                  {exercise.sets && (
                                    <span className="rounded bg-[#F5F5F5] px-2 py-0.5 dark:bg-[#141414]">
                                      {exercise.sets} sets
                                    </span>
                                  )}
                                  {exercise.reps && (
                                    <span className="rounded bg-[#F5F5F5] px-2 py-0.5 dark:bg-[#141414]">
                                      {exercise.reps}
                                    </span>
                                  )}
                                  {exercise.duration && (
                                    <span className="rounded bg-[#F5F5F5] px-2 py-0.5 dark:bg-[#141414]">
                                      {exercise.duration}
                                    </span>
                                  )}
                                  {exercise.rest && (
                                    <span className="rounded bg-[#F5F5F5] px-2 py-0.5 dark:bg-[#141414]">
                                      Rest: {exercise.rest}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {exercise.notes && (
                                <p className="mt-1.5 text-xs text-[#6B6B6B]">
                                  {exercise.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
      )}

      {/* Create Program Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Program"
      >
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setCreateModalOpen(false);
          }}
        >
          <Input
            label="Program Name"
            placeholder="e.g. Pre-Season Speed Development"
          />
          <Textarea
            label="Description"
            placeholder="Describe the goals and structure of this program..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (weeks)"
              type="number"
              min="1"
              placeholder="6"
            />
            <Select label="Category">
              <option value="speed">Speed</option>
              <option value="agility">Agility</option>
              <option value="strength">Strength</option>
              <option value="technical">Technical</option>
              <option value="tactical">Tactical</option>
              <option value="endurance">Endurance</option>
              <option value="recovery">Recovery</option>
            </Select>
          </div>
          <p className="text-xs text-[#6B6B6B]">
            You can add phases and exercises after creating the program.
          </p>
          <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] pt-5 dark:border-[#2A2A2A]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
