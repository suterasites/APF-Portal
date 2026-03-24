"use client";

import { User, Phone, Mail, MapPin, Shield, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

// Mock data
const clientProfile = {
  firstName: "Lachlan",
  lastName: "Mitchell",
  email: "lachlan.mitchell@email.com",
  phone: "0412 345 678",
  dateOfBirth: "2004-06-15",
  address: "42 Chapel Street, South Yarra VIC 3141",
  emergencyContact: {
    name: "Sarah Mitchell",
    phone: "0423 456 789",
    relationship: "Mother",
  },
  football: {
    position: "Centre Midfielder",
    club: "Melbourne City FC - U21s",
    competitionLevel: "Semi-Pro",
  },
  medicalNotes:
    "Previous right ankle sprain (2025). No current injuries. No allergies. Cleared for full training.",
  status: "active" as const,
  assignedCoach: "James Sutera",
  memberSince: "2025-08-12",
};

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      {Icon && (
        <div className="mt-0.5">
          <Icon className="h-4 w-4 text-[#6B6B6B]" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-[#6B6B6B]">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-[#0A0A0A] dark:text-[#FAFAFA]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ClientProfilePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
            Profile
          </h1>
          <p className="mt-1 text-[#6B6B6B]">
            Your personal details and information.
          </p>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0A0A0A] dark:bg-[#FAFAFA]">
              <span className="text-xl font-bold text-white dark:text-[#0A0A0A]">
                {clientProfile.firstName[0]}
                {clientProfile.lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0A0A0A] dark:text-[#FAFAFA]">
                {clientProfile.firstName} {clientProfile.lastName}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="success">Active</Badge>
                <span className="text-sm text-[#6B6B6B]">
                  Member since {formatDate(clientProfile.memberSince)}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                Coached by {clientProfile.assignedCoach}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A]">
              <InfoRow
                label="Full Name"
                value={`${clientProfile.firstName} ${clientProfile.lastName}`}
                icon={User}
              />
              <InfoRow
                label="Email"
                value={clientProfile.email}
                icon={Mail}
              />
              <InfoRow
                label="Phone"
                value={clientProfile.phone}
                icon={Phone}
              />
              <InfoRow
                label="Date of Birth"
                value={formatDate(clientProfile.dateOfBirth)}
              />
              <InfoRow
                label="Address"
                value={clientProfile.address}
                icon={MapPin}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A]">
              <InfoRow
                label="Contact Name"
                value={clientProfile.emergencyContact.name}
                icon={User}
              />
              <InfoRow
                label="Relationship"
                value={clientProfile.emergencyContact.relationship}
              />
              <InfoRow
                label="Phone"
                value={clientProfile.emergencyContact.phone}
                icon={Phone}
              />
            </div>
          </CardContent>
        </Card>

        {/* Football Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
              Football Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-[#E5E5E5] dark:divide-[#2A2A2A]">
              <InfoRow
                label="Playing Position"
                value={clientProfile.football.position}
              />
              <InfoRow
                label="Current Club"
                value={clientProfile.football.club}
              />
              <InfoRow
                label="Competition Level"
                value={clientProfile.football.competitionLevel}
              />
            </div>
          </CardContent>
        </Card>

        {/* Medical Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Medical Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-4">
              <p className="text-sm text-[#0A0A0A] dark:text-[#FAFAFA] leading-relaxed">
                {clientProfile.medicalNotes}
              </p>
            </div>
            <p className="mt-3 text-xs text-[#6B6B6B]">
              Medical notes are read-only. Contact your coach to update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
