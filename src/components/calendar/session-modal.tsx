"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SESSION_TYPES, SESSION_TYPE_LABELS } from "@/lib/constants";
import type { CalendarSession } from "./types";

interface SessionModalProps {
  open: boolean;
  onClose: () => void;
  session?: CalendarSession | null;
  onSave: (session: Omit<CalendarSession, "id"> & { id?: string }) => void;
}

const EMPTY_FORM = {
  title: "",
  type: SESSION_TYPES.ONE_ON_ONE as CalendarSession["type"],
  coach: "James" as "James" | "Chris",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  clients: "",
  capacity: "",
  notes: "",
  isRecurring: false,
  recurrenceRule: "weekly",
};

export function SessionModal({ open, onClose, session, onSave }: SessionModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);

  const isEditing = !!session;

  useEffect(() => {
    if (session) {
      setForm({
        title: session.title,
        type: session.type,
        coach: session.coach,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        clients: session.clients.join(", "),
        capacity: session.capacity?.toString() || "",
        notes: session.notes || "",
        isRecurring: session.isRecurring || false,
        recurrenceRule: session.recurrenceRule || "weekly",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [session, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const clientList = form.clients
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      ...(session?.id ? { id: session.id } : {}),
      title: form.title,
      type: form.type,
      coach: form.coach,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location,
      clients: clientList,
      capacity: form.capacity ? parseInt(form.capacity, 10) : undefined,
      notes: form.notes || undefined,
      status: session?.status || "scheduled",
      isRecurring: form.isRecurring,
      recurrenceRule: form.isRecurring ? form.recurrenceRule : undefined,
    });

    onClose();
  }

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Session" : "New Session"}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Title"
          placeholder="e.g. Speed & Agility Training"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />

        {/* Type and Coach row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="w-full">
            <label
              htmlFor="session-type"
              className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]"
            >
              Type
            </label>
            <select
              id="session-type"
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] px-3 py-2 text-sm text-[#0A0A0A] dark:text-[#FAFAFA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:focus:ring-[#FAFAFA] focus:ring-offset-1"
            >
              {Object.entries(SESSION_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label
              htmlFor="session-coach"
              className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]"
            >
              Coach
            </label>
            <select
              id="session-coach"
              value={form.coach}
              onChange={(e) => updateField("coach", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] px-3 py-2 text-sm text-[#0A0A0A] dark:text-[#FAFAFA] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:focus:ring-[#FAFAFA] focus:ring-offset-1"
            >
              <option value="James">James</option>
              <option value="Chris">Chris</option>
            </select>
          </div>
        </div>

        {/* Date and Time row */}
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            required
          />
          <Input
            label="Start Time"
            type="time"
            value={form.startTime}
            onChange={(e) => updateField("startTime", e.target.value)}
            required
          />
          <Input
            label="End Time"
            type="time"
            value={form.endTime}
            onChange={(e) => updateField("endTime", e.target.value)}
            required
          />
        </div>

        {/* Location */}
        <Input
          label="Location"
          placeholder="e.g. Gosch's Paddock, Richmond"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        />

        {/* Clients */}
        {form.type !== SESSION_TYPES.BLOCKED && (
          <Input
            label="Client(s)"
            placeholder="Separate multiple clients with commas"
            value={form.clients}
            onChange={(e) => updateField("clients", e.target.value)}
          />
        )}

        {/* Capacity (group sessions only) */}
        {form.type === SESSION_TYPES.GROUP && (
          <Input
            label="Capacity"
            type="number"
            placeholder="Max participants"
            value={form.capacity}
            onChange={(e) => updateField("capacity", e.target.value)}
            min="2"
          />
        )}

        {/* Recurring */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA] cursor-pointer">
            <input
              type="checkbox"
              checked={form.isRecurring}
              onChange={(e) => updateField("isRecurring", e.target.checked)}
              className="w-4 h-4 rounded border-[#E5E5E5] dark:border-[#2A2A2A] text-[#0A0A0A] focus:ring-[#0A0A0A] dark:focus:ring-[#FAFAFA]"
            />
            Recurring session
          </label>

          {form.isRecurring && (
            <select
              value={form.recurrenceRule}
              onChange={(e) => updateField("recurrenceRule", e.target.value)}
              className="h-8 rounded-lg border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] px-2 text-sm text-[#0A0A0A] dark:text-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#0A0A0A] dark:focus:ring-[#FAFAFA] focus:ring-offset-1"
            >
              <option value="weekly">Weekly</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="monthly">Monthly</option>
            </select>
          )}
        </div>

        {/* Notes */}
        <Textarea
          label="Notes"
          placeholder="Session notes, drills to cover, equipment needed..."
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          rows={3}
        />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Save Changes" : "Create Session"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
