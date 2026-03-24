"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Activity,
  Plus,
  AlertCircle,
  Clock,
  User,
  Shield,
  Trophy,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { ClientData } from "@/components/clients/client-card";

// ---------------------------------------------------------------------------
// Client data (populated from database)
// ---------------------------------------------------------------------------

const mockClients: ClientData[] = [];

// ---------------------------------------------------------------------------
// Session, Payment, Assessment, Note, and Program data (populated from database)
// ---------------------------------------------------------------------------

interface SessionRecord {
  id: string;
  date: string;
  time: string;
  type: string;
  title: string;
  coach: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  location: string;
}

interface PaymentRecord {
  id: string;
  date: string;
  description: string;
  amount: number; // cents
  status: "paid" | "overdue" | "pending";
  method?: string;
}

interface AssessmentRecord {
  id: string;
  date: string;
  coach: string;
  metrics: { name: string; value: string; unit: string }[];
  notes: string;
}

interface NoteRecord {
  id: string;
  date: string;
  coach: string;
  content: string;
}

interface ProgramRecord {
  id: string;
  name: string;
  assignedDate: string;
  durationWeeks: number;
  status: "active" | "completed" | "archived";
  category: string;
}

const mockSessions: SessionRecord[] = [];

const mockPayments: PaymentRecord[] = [];

const mockAssessments: AssessmentRecord[] = [];

const mockNotes: NoteRecord[] = [];

const mockPrograms: ProgramRecord[] = [];

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const statusConfig: Record<
  ClientData["status"],
  { label: string; variant: "secondary" | "default" | "outline" }
> = {
  lead: { label: "Lead", variant: "secondary" },
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "outline" },
};

const sessionStatusConfig: Record<
  SessionRecord["status"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" | "warning" }
> = {
  scheduled: { label: "Scheduled", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "outline" },
  no_show: { label: "No Show", variant: "destructive" },
};

const paymentStatusConfig: Record<
  PaymentRecord["status"],
  { label: string; variant: "default" | "secondary" | "destructive" | "warning" }
> = {
  paid: { label: "Paid", variant: "default" },
  pending: { label: "Pending", variant: "warning" },
  overdue: { label: "Overdue", variant: "destructive" },
};

const programStatusConfig: Record<
  ProgramRecord["status"],
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  active: { label: "Active", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  archived: { label: "Archived", variant: "outline" },
};

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

type TabKey = "overview" | "sessions" | "payments" | "assessments" | "notes" | "programs";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: User },
  { key: "sessions", label: "Sessions", icon: Calendar },
  { key: "payments", label: "Payments", icon: DollarSign },
  { key: "assessments", label: "Assessments", icon: Activity },
  { key: "notes", label: "Notes", icon: FileText },
  { key: "programs", label: "Programs", icon: Trophy },
];

// ---------------------------------------------------------------------------
// Helper: calculate age
// ---------------------------------------------------------------------------

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ClientProfilePage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;

  const client = mockClients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-[#6B6B6B] mb-3" />
          <h2 className="text-lg font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
            Client not found
          </h2>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            The client you are looking for does not exist.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/clients")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return <ClientProfileContent client={client} />;
}

// ---------------------------------------------------------------------------
// Profile Content (rendered only when client is found)
// ---------------------------------------------------------------------------

function ClientProfileContent({ client }: { client: ClientData }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<NoteRecord[]>(mockNotes);

  const fullName = `${client.firstName} ${client.lastName}`;
  const status = statusConfig[client.status];
  const age = calculateAge(client.dateOfBirth);

  const outstandingBalance = mockPayments
    .filter((p) => p.status !== "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  function handleAddNote() {
    if (!newNote.trim()) return;
    const note: NoteRecord = {
      id: `n${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      coach: "James",
      content: newNote.trim(),
    };
    setNotes((prev) => [note, ...prev]);
    setNewNote("");
  }

  // -------------------------------------------------------------------------
  // Tab: Overview
  // -------------------------------------------------------------------------

  function renderOverview() {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                Personal Information
              </h3>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-3.5 w-3.5" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              <InfoRow icon={User} label="Full Name" value={fullName} />
              <InfoRow icon={Calendar} label="Date of Birth" value={`${formatDate(client.dateOfBirth)} (${age} years old)`} />
              <InfoRow icon={Phone} label="Phone" value={client.phone} />
              <InfoRow icon={Mail} label="Email" value={client.email} />
              <InfoRow icon={MapPin} label="Address" value={client.address || "Not provided"} />
              <InfoRow icon={Shield} label="Emergency Contact" value={client.emergencyContactName ? `${client.emergencyContactName} - ${client.emergencyContactPhone}` : "Not provided"} />
            </div>
          </div>

          {/* Football Details */}
          <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-6">
            <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-6">
              Football Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
              <InfoRow icon={Trophy} label="Position" value={client.position || "Not set"} />
              <InfoRow icon={Shield} label="Current Club" value={client.currentClub || "Not set"} />
              <InfoRow icon={Activity} label="Competition Level" value={client.competitionLevel || "Not set"} />
              <InfoRow icon={User} label="Assigned Coach" value={client.assignedCoach} />
            </div>
          </div>

          {/* Medical Notes */}
          {client.medicalNotes && (
            <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-6">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-[#C23B22]" />
                <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                  Medical Notes
                </h3>
              </div>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {client.medicalNotes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-6">
            <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B6B6B]">Total Sessions</span>
                <span className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                  {mockSessions.filter((s) => s.status === "completed").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B6B6B]">Upcoming</span>
                <span className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                  {mockSessions.filter((s) => s.status === "scheduled").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B6B6B]">Outstanding</span>
                <span className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                  {formatCurrency(outstandingBalance)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B6B6B]">Assessments</span>
                <span className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                  {mockAssessments.length}
                </span>
              </div>
            </div>
          </div>

          {/* Active Programs */}
          <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-6">
            <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-4">
              Active Programs
            </h3>
            {mockPrograms.filter((p) => p.status === "active").length > 0 ? (
              <div className="space-y-3">
                {mockPrograms
                  .filter((p) => p.status === "active")
                  .map((program) => (
                    <div key={program.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                          {program.name}
                        </p>
                        <p className="text-xs text-[#6B6B6B]">
                          {program.durationWeeks} weeks - {program.category}
                        </p>
                      </div>
                      <Badge variant={programStatusConfig[program.status].variant}>
                        {programStatusConfig[program.status].label}
                      </Badge>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-[#6B6B6B]">No active programs</p>
            )}
          </div>

          {/* Recent Note */}
          {notes.length > 0 && (
            <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-6">
              <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-4">
                Latest Note
              </h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {notes[0].content}
              </p>
              <p className="mt-2 text-xs text-[#6B6B6B]">
                {formatDate(notes[0].date)} - {notes[0].coach}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Tab: Sessions
  // -------------------------------------------------------------------------

  function renderSessions() {
    const upcoming = mockSessions.filter((s) => s.status === "scheduled");
    const past = mockSessions.filter((s) => s.status !== "scheduled");

    return (
      <div className="space-y-8">
        {/* Upcoming */}
        <div>
          <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-4">
            Upcoming Sessions
          </h3>
          {upcoming.length > 0 ? (
            <div className="space-y-3">
              {upcoming.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <EmptyState text="No upcoming sessions" />
          )}
        </div>

        {/* Past */}
        <div>
          <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-4">
            Past Sessions
          </h3>
          {past.length > 0 ? (
            <div className="space-y-3">
              {past.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <EmptyState text="No past sessions" />
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Tab: Payments
  // -------------------------------------------------------------------------

  function renderPayments() {
    const totalPaid = mockPayments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0);

    return (
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-4">
            <p className="text-xs font-medium text-[#6B6B6B]">Total Paid</p>
            <p className="mt-1 text-xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
              {formatCurrency(totalPaid)}
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-4">
            <p className="text-xs font-medium text-[#6B6B6B]">Outstanding</p>
            <p className="mt-1 text-xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
              {formatCurrency(outstandingBalance)}
            </p>
          </div>
          <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-4">
            <p className="text-xs font-medium text-[#6B6B6B]">Invoices</p>
            <p className="mt-1 text-xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
              {mockPayments.length}
            </p>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-4">
            Payment History
          </h3>
          <div className="space-y-3">
            {mockPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A]">
                    <DollarSign className="h-4 w-4 text-[#0A0A0A] dark:text-[#FAFAFA]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {payment.description}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      {formatDate(payment.date)}
                      {payment.method && ` - ${payment.method}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                    {formatCurrency(payment.amount)}
                  </span>
                  <Badge variant={paymentStatusConfig[payment.status].variant}>
                    {paymentStatusConfig[payment.status].label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Tab: Assessments
  // -------------------------------------------------------------------------

  function renderAssessments() {
    return (
      <div className="space-y-6">
        {mockAssessments.length > 0 ? (
          mockAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                    Assessment - {formatDate(assessment.date)}
                  </h3>
                  <p className="text-xs text-[#6B6B6B]">
                    Conducted by {assessment.coach}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {assessment.metrics.map((metric) => (
                  <div
                    key={metric.name}
                    className="rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-3"
                  >
                    <p className="text-xs text-[#6B6B6B]">{metric.name}</p>
                    <p className="mt-1 text-lg font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                      {metric.value}
                      <span className="ml-1 text-xs font-normal text-[#6B6B6B]">
                        {metric.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              {assessment.notes && (
                <p className="text-sm text-[#6B6B6B] leading-relaxed border-t border-[#E5E5E5] dark:border-[#2A2A2A] pt-4">
                  {assessment.notes}
                </p>
              )}
            </div>
          ))
        ) : (
          <EmptyState text="No assessments recorded" />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Tab: Notes
  // -------------------------------------------------------------------------

  function renderNotes() {
    return (
      <div className="space-y-6">
        {/* Add note */}
        <div className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-6">
          <h3 className="text-base font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-3">
            Add Note
          </h3>
          <Textarea
            placeholder="Write a note about this client..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              Add Note
            </Button>
          </div>
        </div>

        {/* Notes list */}
        {notes.length > 0 ? (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-5"
              >
                <p className="text-sm text-[#0A0A0A] dark:text-[#FAFAFA] leading-relaxed">
                  {note.content}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-[#6B6B6B]">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(note.date)}</span>
                  <span>-</span>
                  <span>{note.coach}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="No notes yet" />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Tab: Programs
  // -------------------------------------------------------------------------

  function renderPrograms() {
    return (
      <div className="space-y-3">
        {mockPrograms.length > 0 ? (
          mockPrograms.map((program) => (
            <div
              key={program.id}
              className="flex items-center justify-between rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA]">
                    {program.name}
                  </h3>
                  <Badge variant={programStatusConfig[program.status].variant}>
                    {programStatusConfig[program.status].label}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[#6B6B6B]">
                  <span>{program.category}</span>
                  <span>{program.durationWeeks} weeks</span>
                  <span>Assigned {formatDate(program.assignedDate)}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          ))
        ) : (
          <EmptyState text="No programs assigned" />
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Tab content map
  // -------------------------------------------------------------------------

  const tabContent: Record<TabKey, () => React.ReactNode> = {
    overview: renderOverview,
    sessions: renderSessions,
    payments: renderPayments,
    assessments: renderAssessments,
    notes: renderNotes,
    programs: renderPrograms,
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/clients")}
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </button>

        {/* Client Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Avatar src={client.profilePhotoUrl} name={fullName} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                {fullName}
              </h1>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-[#6B6B6B]">
              {client.position && <span>{client.position}</span>}
              {client.currentClub && <span>{client.currentClub}</span>}
              <span>Coach: {client.assignedCoach}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Phone className="mr-2 h-3.5 w-3.5" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-3.5 w-3.5" />
              Email
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] mb-8 overflow-x-auto">
          <nav className="flex gap-1 -mb-px" aria-label="Client profile tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-[#0A0A0A] dark:border-[#FAFAFA] text-[#0A0A0A] dark:text-[#FAFAFA]"
                      : "border-transparent text-[#6B6B6B] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA] hover:border-[#E5E5E5] dark:hover:border-[#2A2A2A]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {tabContent[activeTab]()}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#6B6B6B]" />
      <div>
        <p className="text-xs text-[#6B6B6B]">{label}</p>
        <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">{value}</p>
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: SessionRecord }) {
  const statusCfg = sessionStatusConfig[session.status];
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5E5E5] dark:bg-[#2A2A2A]">
          <Calendar className="h-4 w-4 text-[#0A0A0A] dark:text-[#FAFAFA]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
            {session.title}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <span>{formatDate(session.date)}</span>
            <span>{session.time}</span>
            <span>{session.location}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-xs text-[#6B6B6B]">{session.type}</span>
        <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] py-12">
      <p className="text-sm text-[#6B6B6B]">{text}</p>
    </div>
  );
}
