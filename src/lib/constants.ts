// -----------------------------------------------
// App
// -----------------------------------------------

export const APP_NAME = "Accelerate Performance Football";
export const APP_SHORT_NAME = "APF";

// -----------------------------------------------
// Locale and region
// -----------------------------------------------

export const TIMEZONE = "Australia/Melbourne";
export const CURRENCY = "AUD";
export const DATE_FORMAT = "DD/MM/YYYY";

// -----------------------------------------------
// User roles
// -----------------------------------------------

export const USER_ROLES = {
  COACH: "coach",
  CLIENT: "client",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// -----------------------------------------------
// Session types
// -----------------------------------------------

export const SESSION_TYPES = {
  ONE_ON_ONE: "one_on_one",
  GROUP: "group",
  BLOCKED: "blocked",
} as const;

export type SessionType = (typeof SESSION_TYPES)[keyof typeof SESSION_TYPES];

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  one_on_one: "1-on-1",
  group: "Group",
  blocked: "Blocked",
};

// -----------------------------------------------
// Session statuses
// -----------------------------------------------

export const SESSION_STATUSES = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const;

export type SessionStatus =
  (typeof SESSION_STATUSES)[keyof typeof SESSION_STATUSES];

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
};

// -----------------------------------------------
// Attendance statuses
// -----------------------------------------------

export const ATTENDANCE_STATUSES = {
  BOOKED: "booked",
  ATTENDED: "attended",
  NO_SHOW: "no_show",
  CANCELLED: "cancelled",
} as const;

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUSES)[keyof typeof ATTENDANCE_STATUSES];

// -----------------------------------------------
// Client statuses
// -----------------------------------------------

export const CLIENT_STATUSES = {
  LEAD: "lead",
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type ClientStatus =
  (typeof CLIENT_STATUSES)[keyof typeof CLIENT_STATUSES];

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  lead: "Lead",
  active: "Active",
  inactive: "Inactive",
};

// -----------------------------------------------
// Invoice statuses
// -----------------------------------------------

export const INVOICE_STATUSES = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;

export type InvoiceStatus =
  (typeof INVOICE_STATUSES)[keyof typeof INVOICE_STATUSES];

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

// -----------------------------------------------
// Payment methods
// -----------------------------------------------

export const PAYMENT_METHODS = {
  CARD: "card",
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

// -----------------------------------------------
// Billing frequency
// -----------------------------------------------

export const BILLING_FREQUENCIES = {
  WEEKLY: "weekly",
  FORTNIGHTLY: "fortnightly",
  MONTHLY: "monthly",
} as const;

export type BillingFrequency =
  (typeof BILLING_FREQUENCIES)[keyof typeof BILLING_FREQUENCIES];

// -----------------------------------------------
// Membership statuses
// -----------------------------------------------

export const MEMBERSHIP_STATUSES = {
  ACTIVE: "active",
  PAUSED: "paused",
  CANCELLED: "cancelled",
} as const;

export type MembershipStatus =
  (typeof MEMBERSHIP_STATUSES)[keyof typeof MEMBERSHIP_STATUSES];

// -----------------------------------------------
// Package statuses
// -----------------------------------------------

export const PACKAGE_STATUSES = {
  ACTIVE: "active",
  EXPIRED: "expired",
  USED: "used",
} as const;

export type PackageStatus =
  (typeof PACKAGE_STATUSES)[keyof typeof PACKAGE_STATUSES];

// -----------------------------------------------
// Program statuses
// -----------------------------------------------

export const PROGRAM_STATUSES = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
} as const;

export type ProgramStatus =
  (typeof PROGRAM_STATUSES)[keyof typeof PROGRAM_STATUSES];

// -----------------------------------------------
// Exercise categories
// -----------------------------------------------

export const EXERCISE_CATEGORIES = {
  SPEED: "speed",
  AGILITY: "agility",
  STRENGTH: "strength",
  TECHNICAL: "technical",
  TACTICAL: "tactical",
  RECOVERY: "recovery",
} as const;

export type ExerciseCategory =
  (typeof EXERCISE_CATEGORIES)[keyof typeof EXERCISE_CATEGORIES];

export const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  speed: "Speed",
  agility: "Agility",
  strength: "Strength",
  technical: "Technical",
  tactical: "Tactical",
  recovery: "Recovery",
};

// -----------------------------------------------
// Competition levels
// -----------------------------------------------

export const COMPETITION_LEVELS = {
  JUNIOR: "junior",
  AMATEUR: "amateur",
  SEMI_PRO: "semi_pro",
  PROFESSIONAL: "professional",
} as const;

export type CompetitionLevel =
  (typeof COMPETITION_LEVELS)[keyof typeof COMPETITION_LEVELS];

export const COMPETITION_LEVEL_LABELS: Record<CompetitionLevel, string> = {
  junior: "Junior",
  amateur: "Amateur",
  semi_pro: "Semi-Pro",
  professional: "Professional",
};

// -----------------------------------------------
// Notification types
// -----------------------------------------------

export const NOTIFICATION_TYPES = {
  SESSION_REMINDER: "session_reminder",
  PAYMENT_REMINDER: "payment_reminder",
  PACKAGE_EXPIRY: "package_expiry",
  BOOKING_CONFIRMATION: "booking_confirmation",
  CANCELLATION: "cancellation",
  GENERAL: "general",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

// -----------------------------------------------
// Protected routes (used by middleware)
// -----------------------------------------------

export const PROTECTED_ROUTES = [
  "/dashboard",
  "/calendar",
  "/clients",
  "/services",
  "/finances",
  "/programs",
  "/reports",
  "/settings",
];

export const PUBLIC_ROUTES = ["/login", "/api/auth"];
