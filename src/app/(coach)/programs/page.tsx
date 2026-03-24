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
// Mock Data
// -------------------------------------------------

const mockPrograms: Program[] = [
  {
    id: "prog-1",
    name: "Pre-Season Speed Development",
    description:
      "Progressive speed training program designed to build acceleration and top-end speed ahead of the competitive season.",
    durationWeeks: 6,
    category: "Speed",
    clientsAssigned: 4,
    createdAt: "2026-02-10",
    status: "active",
    phases: [
      {
        name: "Weeks 1-2: Foundation",
        exercises: [
          {
            name: "A-Skip Drill",
            sets: 3,
            reps: "20m",
            rest: "60s",
            notes: "Focus on knee drive and posture",
          },
          {
            name: "Falling Start Sprints",
            sets: 5,
            reps: "20m",
            rest: "90s",
          },
          {
            name: "Wall Drive Holds",
            sets: 3,
            duration: "15s each leg",
            rest: "30s",
          },
          {
            name: "Bounding",
            sets: 4,
            reps: "30m",
            rest: "90s",
            notes: "Maximize ground contact power",
          },
        ],
      },
      {
        name: "Weeks 3-4: Acceleration",
        exercises: [
          {
            name: "3-Point Start Sprints",
            sets: 6,
            reps: "30m",
            rest: "2min",
          },
          {
            name: "Sled Push",
            sets: 4,
            reps: "20m",
            rest: "2min",
            notes: "Light load, fast feet",
          },
          {
            name: "Hill Sprints",
            sets: 5,
            reps: "40m",
            rest: "3min",
          },
        ],
      },
      {
        name: "Weeks 5-6: Top Speed",
        exercises: [
          {
            name: "Flying 30m Sprints",
            sets: 4,
            reps: "30m",
            rest: "3min",
            notes: "20m build-up, 30m at max velocity",
          },
          {
            name: "Wicket Runs",
            sets: 5,
            reps: "40m",
            rest: "3min",
          },
          {
            name: "In-Out Sprints",
            sets: 4,
            reps: "60m",
            rest: "3min",
            notes: "Alternate between 80% and 100% effort every 20m",
          },
        ],
      },
    ],
  },
  {
    id: "prog-2",
    name: "Junior Skills Foundation",
    description:
      "Comprehensive technical skills program for junior players building core football abilities from the ground up.",
    durationWeeks: 8,
    category: "Technical",
    clientsAssigned: 7,
    createdAt: "2026-01-20",
    status: "active",
    phases: [
      {
        name: "Weeks 1-2: Ball Mastery",
        exercises: [
          {
            name: "Toe Taps",
            sets: 3,
            duration: "30s",
            rest: "15s",
          },
          {
            name: "Inside-Outside Dribbling",
            sets: 4,
            reps: "20m",
            rest: "30s",
          },
          {
            name: "Figure 8 Dribbling",
            sets: 3,
            duration: "45s",
            rest: "30s",
            notes: "Use both feet equally",
          },
        ],
      },
      {
        name: "Weeks 3-4: Passing & Receiving",
        exercises: [
          {
            name: "Wall Passing (Inside Foot)",
            sets: 3,
            reps: "20 each foot",
            rest: "30s",
          },
          {
            name: "First Touch Control",
            sets: 4,
            reps: "10 each foot",
            rest: "30s",
            notes: "Receive and set in one motion",
          },
          {
            name: "Triangle Passing",
            sets: 4,
            duration: "2min",
            rest: "45s",
          },
        ],
      },
      {
        name: "Weeks 5-6: Shooting Basics",
        exercises: [
          {
            name: "Instep Striking (Static Ball)",
            sets: 4,
            reps: "10",
            rest: "30s",
          },
          {
            name: "One-Touch Finishing",
            sets: 4,
            reps: "8",
            rest: "45s",
            notes: "Focus on accuracy over power",
          },
        ],
      },
      {
        name: "Weeks 7-8: Game Scenarios",
        exercises: [
          {
            name: "1v1 Attacking Drill",
            sets: 5,
            duration: "2min",
            rest: "1min",
          },
          {
            name: "Small-Sided Game (3v3)",
            sets: 3,
            duration: "5min",
            rest: "2min",
            notes: "Encourage all skills covered in previous weeks",
          },
        ],
      },
    ],
  },
  {
    id: "prog-3",
    name: "Match Fitness Program",
    description:
      "Four-week conditioning program to build match-level endurance and recovery capacity for competitive players.",
    durationWeeks: 4,
    category: "Endurance",
    clientsAssigned: 3,
    createdAt: "2026-03-01",
    status: "active",
    phases: [
      {
        name: "Week 1: Aerobic Base",
        exercises: [
          {
            name: "Continuous Running",
            duration: "20min at 70% HR max",
            notes: "Steady pace, conversation possible",
          },
          {
            name: "Shuttle Runs (20m)",
            sets: 6,
            reps: "6",
            rest: "90s",
          },
        ],
      },
      {
        name: "Week 2: Interval Training",
        exercises: [
          {
            name: "400m Intervals",
            sets: 6,
            rest: "90s",
            notes: "Target: under 80s each",
          },
          {
            name: "Box-to-Box Runs",
            sets: 8,
            rest: "60s",
            notes: "Sprint one way, jog back",
          },
        ],
      },
      {
        name: "Week 3: High Intensity",
        exercises: [
          {
            name: "Yo-Yo Intermittent Recovery Test (Practice)",
            sets: 2,
            duration: "Full test",
            rest: "5min",
          },
          {
            name: "Sprint-Jog-Sprint Circuits",
            sets: 5,
            duration: "3min",
            rest: "2min",
          },
        ],
      },
      {
        name: "Week 4: Match Simulation",
        exercises: [
          {
            name: "45min Match Simulation Drill",
            sets: 2,
            duration: "45min",
            rest: "15min",
            notes: "Replicate match intensity with ball work",
          },
        ],
      },
    ],
  },
  {
    id: "prog-4",
    name: "Agility & Footwork",
    description:
      "Focused program developing quick feet, change of direction, and reactive agility for match situations.",
    durationWeeks: 4,
    category: "Agility",
    clientsAssigned: 0,
    createdAt: "2026-03-15",
    status: "archived",
    phases: [
      {
        name: "Weeks 1-2: Ladder & Cone Work",
        exercises: [
          {
            name: "Ladder Drills (6 variations)",
            sets: 3,
            reps: "2 each",
            rest: "30s",
          },
          {
            name: "T-Drill",
            sets: 5,
            rest: "90s",
            notes: "Focus on low centre of gravity in direction changes",
          },
        ],
      },
      {
        name: "Weeks 3-4: Reactive Agility",
        exercises: [
          {
            name: "Mirror Drill (Partner)",
            sets: 6,
            duration: "20s",
            rest: "40s",
          },
          {
            name: "Colour Cone Reaction",
            sets: 4,
            reps: "8",
            rest: "60s",
            notes: "React to called colour - sprint to correct cone",
          },
        ],
      },
    ],
  },
];

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
