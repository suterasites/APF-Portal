"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ClientData } from "@/components/clients/client-card";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (client: Omit<ClientData, "id">) => void;
}

const defaultForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  position: "",
  currentClub: "",
  competitionLevel: "",
  medicalNotes: "",
  status: "lead" as const,
  assignedCoach: "James",
  profilePhotoUrl: null as string | null,
  notes: "",
};

export function AddClientModal({ open, onClose, onSave }: AddClientModalProps) {
  const [form, setForm] = useState(defaultForm);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
    setForm(defaultForm);
    onClose();
  }

  function handleClose() {
    setForm(defaultForm);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add New Client" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* Personal Details */}
        <div>
          <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-3">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="client@example.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="04XX XXX XXX"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
            />
            <Input
              label="Address"
              placeholder="Street address, suburb"
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-3">
            Emergency Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              placeholder="Emergency contact name"
              value={form.emergencyContactName}
              onChange={(e) => updateField("emergencyContactName", e.target.value)}
            />
            <Input
              label="Contact Phone"
              type="tel"
              placeholder="04XX XXX XXX"
              value={form.emergencyContactPhone}
              onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
            />
          </div>
        </div>

        {/* Football Details */}
        <div>
          <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-3">
            Football Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Position"
              value={form.position}
              onChange={(e) => updateField("position", e.target.value)}
            >
              <option value="">Select position</option>
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
            </Select>
            <Input
              label="Current Club"
              placeholder="Club name"
              value={form.currentClub}
              onChange={(e) => updateField("currentClub", e.target.value)}
            />
            <Select
              label="Competition Level"
              value={form.competitionLevel}
              onChange={(e) => updateField("competitionLevel", e.target.value)}
            >
              <option value="">Select level</option>
              <option value="Junior">Junior</option>
              <option value="Amateur">Amateur</option>
              <option value="Semi-Pro">Semi-Pro</option>
              <option value="Professional">Professional</option>
            </Select>
            <Select
              label="Assigned Coach"
              value={form.assignedCoach}
              onChange={(e) => updateField("assignedCoach", e.target.value)}
              required
            >
              <option value="James">James</option>
              <option value="Chris">Chris</option>
            </Select>
          </div>
        </div>

        {/* Status & Medical */}
        <div>
          <h3 className="text-sm font-semibold text-[#0A0A0A] dark:text-[#FAFAFA] mb-3">
            Status & Medical
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              required
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
            </Select>
            <div className="hidden sm:block" />
            <div className="sm:col-span-2">
              <Textarea
                label="Medical Notes"
                placeholder="Allergies, injuries, conditions, etc."
                value={form.medicalNotes}
                onChange={(e) => updateField("medicalNotes", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Textarea
            label="Notes"
            placeholder="Any additional notes about this client"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Add Client</Button>
        </div>
      </form>
    </Modal>
  );
}
