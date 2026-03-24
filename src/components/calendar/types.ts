import type { SessionType, SessionStatus } from "@/lib/constants";

export interface CalendarSession {
  id: string;
  title: string;
  type: SessionType;
  coach: "James" | "Chris";
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h)
  endTime: string; // HH:mm (24h)
  location: string;
  clients: string[];
  capacity?: number;
  notes?: string;
  status: SessionStatus;
  isRecurring?: boolean;
  recurrenceRule?: string;
}
