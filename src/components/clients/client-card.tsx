"use client";

import { Phone, Mail, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  position: string;
  currentClub: string;
  competitionLevel: string;
  medicalNotes: string;
  status: "lead" | "active" | "inactive";
  assignedCoach: string;
  profilePhotoUrl?: string | null;
  notes: string;
}

interface ClientCardProps {
  client: ClientData;
  onClick: () => void;
}

const statusConfig: Record<
  ClientData["status"],
  { label: string; variant: "secondary" | "default" | "outline" }
> = {
  lead: { label: "Lead", variant: "secondary" },
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "outline" },
};

export function ClientCard({ client, onClick }: ClientCardProps) {
  const fullName = `${client.firstName} ${client.lastName}`;
  const status = statusConfig[client.status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-left rounded-xl border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#141414]",
        "p-4 transition-all hover:border-[#0A0A0A] dark:hover:border-[#FAFAFA] hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A0A0A] dark:focus-visible:ring-[#FAFAFA] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0A0A0A]"
      )}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <Avatar
          src={client.profilePhotoUrl}
          name={fullName}
          size="lg"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] truncate">
              {fullName}
            </h3>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#6B6B6B]">
            {client.position && (
              <span>{client.position}</span>
            )}
            {client.currentClub && (
              <span>{client.currentClub}</span>
            )}
            <span>Coach: {client.assignedCoach}</span>
          </div>

          {/* Contact row - visible on md+ */}
          <div className="hidden sm:flex items-center gap-3 mt-2 text-xs text-[#6B6B6B]">
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {client.phone}
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[180px]">{client.email}</span>
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="h-5 w-5 shrink-0 text-[#6B6B6B] transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
