"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientCard } from "@/components/clients/client-card";
import { AddClientModal } from "@/components/clients/add-client-modal";
import type { ClientData } from "@/components/clients/client-card";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Client data (populated from database)
// ---------------------------------------------------------------------------

const mockClients: ClientData[] = [];

// ---------------------------------------------------------------------------
// Filter config
// ---------------------------------------------------------------------------

type StatusFilter = "all" | "active" | "lead" | "inactive";
type CoachFilter = "all" | "James" | "Chris";

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "lead", label: "Lead" },
  { value: "inactive", label: "Inactive" },
];

const coachFilters: { value: CoachFilter; label: string }[] = [
  { value: "all", label: "All Coaches" },
  { value: "James", label: "James" },
  { value: "Chris", label: "Chris" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [coachFilter, setCoachFilter] = useState<CoachFilter>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [clients, setClients] = useState<ClientData[]>(mockClients);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const match =
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.currentClub.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Status filter
      if (statusFilter !== "all" && c.status !== statusFilter) return false;

      // Coach filter
      if (coachFilter !== "all" && c.assignedCoach !== coachFilter) return false;

      return true;
    });
  }, [clients, search, statusFilter, coachFilter]);

  const counts = useMemo(() => {
    const all = clients.length;
    const active = clients.filter((c) => c.status === "active").length;
    const lead = clients.filter((c) => c.status === "lead").length;
    const inactive = clients.filter((c) => c.status === "inactive").length;
    return { all, active, lead, inactive };
  }, [clients]);

  function handleAddClient(data: Omit<ClientData, "id">) {
    const newClient: ClientData = {
      ...data,
      id: String(Date.now()),
    };
    setClients((prev) => [newClient, ...prev]);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
              Clients
            </h1>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Manage your client database and profiles
            </p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: counts.all },
            { label: "Active", value: counts.active },
            { label: "Leads", value: counts.lead },
            { label: "Inactive", value: counts.inactive },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414] p-4"
            >
              <p className="text-xs font-medium text-[#6B6B6B]">{stat.label}</p>
              <p className="mt-1 text-xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="Search by name, email, or club..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full h-10 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] pl-10 pr-4 text-sm text-[#0A0A0A] dark:text-[#FAFAFA] placeholder:text-[#6B6B6B] transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:focus:ring-[#FAFAFA] focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-[#0A0A0A]"
              )}
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status filters */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] p-1">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    statusFilter === f.value
                      ? "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]"
                      : "text-[#6B6B6B] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA]"
                  )}
                >
                  {f.label}
                  {f.value !== "all" && (
                    <span className="ml-1 opacity-60">
                      {counts[f.value as keyof typeof counts]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Coach filters */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] p-1">
              {coachFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setCoachFilter(f.value)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    coachFilter === f.value
                      ? "bg-[#0A0A0A] text-white dark:bg-[#FAFAFA] dark:text-[#0A0A0A]"
                      : "text-[#6B6B6B] hover:text-[#0A0A0A] dark:hover:text-[#FAFAFA]"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Client List */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onClick={() => router.push(`/clients/${client.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E5E5E5] dark:border-[#2A2A2A] py-16">
            <Users className="h-10 w-10 text-[#6B6B6B] mb-3" />
            <p className="text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]">
              No clients found
            </p>
            <p className="mt-1 text-xs text-[#6B6B6B]">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddClient}
      />
    </div>
  );
}
