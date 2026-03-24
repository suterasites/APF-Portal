"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, FileText } from "lucide-react";

// -------------------------------------------------
// Types
// -------------------------------------------------

export interface InvoiceFormData {
  clientId: string;
  description: string;
  amount: number; // stored in cents
  dueDate: string;
  notes: string;
  status: "draft" | "sent";
}

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: InvoiceFormData) => void;
}

// -------------------------------------------------
// Client list (populated from database)
// -------------------------------------------------

const mockClients: { id: string; name: string }[] = [];

// -------------------------------------------------
// Component
// -------------------------------------------------

export function InvoiceModal({ open, onClose, onSave }: InvoiceModalProps) {
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [amountDollars, setAmountDollars] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [sendImmediately, setSendImmediately] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function resetForm() {
    setClientId("");
    setDescription("");
    setAmountDollars("");
    setDueDate("");
    setNotes("");
    setSendImmediately(false);
    setErrors({});
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!clientId) {
      newErrors.clientId = "Please select a client.";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required.";
    }
    if (!amountDollars || parseFloat(amountDollars) <= 0) {
      newErrors.amount = "Please enter a valid amount.";
    }
    if (!dueDate) {
      newErrors.dueDate = "Due date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const amountCents = Math.round(parseFloat(amountDollars) * 100);

    onSave({
      clientId,
      description: description.trim(),
      amount: amountCents,
      dueDate,
      notes: notes.trim(),
      status: sendImmediately ? "sent" : "draft",
    });

    resetForm();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Create Invoice">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Client */}
        <Select
          label="Client"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          error={errors.clientId}
        >
          <option value="">Select a client...</option>
          {mockClients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Select>

        {/* Description */}
        <Input
          label="Description"
          placeholder="e.g. 10-Session Pack - Speed & Agility"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />

        {/* Amount */}
        <div className="w-full">
          <label
            htmlFor="invoice-amount"
            className="mb-1.5 block text-sm font-medium text-[#0A0A0A] dark:text-[#FAFAFA]"
          >
            Amount (AUD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B6B6B]">
              $
            </span>
            <Input
              id="invoice-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amountDollars}
              onChange={(e) => setAmountDollars(e.target.value)}
              error={errors.amount}
              className="pl-7"
            />
          </div>
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          error={errors.dueDate}
        />

        {/* Notes */}
        <Textarea
          label="Notes (optional)"
          placeholder="Additional notes for this invoice..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        {/* Send option */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={sendImmediately}
            onChange={(e) => setSendImmediately(e.target.checked)}
            className="h-4 w-4 rounded border-[#E5E5E5] text-[#0A0A0A] focus:ring-[#0A0A0A] dark:border-[#2A2A2A] dark:text-[#FAFAFA] dark:focus:ring-[#FAFAFA]"
          />
          <span className="text-sm text-[#0A0A0A] dark:text-[#FAFAFA]">
            Send to client immediately
          </span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E5E5E5] pt-5 dark:border-[#2A2A2A]">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">
            {sendImmediately ? (
              <>
                <Send className="mr-2 h-4 w-4" />
                Create & Send
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Save as Draft
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
