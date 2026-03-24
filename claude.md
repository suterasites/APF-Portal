# Accelerate Performance Football — Project Brief

## Overview

Accelerate Performance Football is a client-facing business portal and management app for a Melbourne-based football coaching business. The app serves as the central hub for coaches and clients — handling scheduling, client management, session tracking, payments, and progress monitoring. Think of it as a PT Minder-style platform, purpose-built for football performance coaching rather than gym-based personal training.

The two coaches are **James** and **Chris Sutera**.

---

## Design System

### Colour Scheme

- **Primary palette:** Black and white only
- **Background:** `#FFFFFF` (light mode), `#0A0A0A` (dark mode)
- **Surface/cards:** `#F5F5F5` (light), `#141414` (dark)
- **Text primary:** `#0A0A0A` (light), `#FAFAFA` (dark)
- **Text secondary:** `#6B6B6B`
- **Borders/dividers:** `#E5E5E5` (light), `#2A2A2A` (dark)
- **Accent (interactive/CTA):** `#000000` on white, `#FFFFFF` on black — keep it strictly monochrome
- **Status indicators:** Use subtle greys for states (e.g., `#999` for inactive, `#333` for active), avoid introducing colour unless absolutely critical for usability (e.g., a destructive action could use a muted red `#C23B22`)

### Typography

- Clean, modern sans-serif — use **Inter** or **Geist** as the primary typeface
- Use font weight and size to create hierarchy, not colour
- Headings: Bold/Semibold, generous sizing
- Body: Regular weight, comfortable reading size (16px base)

### General UI Principles

- Minimal, clean interface — avoid visual clutter
- High contrast black-on-white (or white-on-black) for readability
- Generous whitespace and padding
- Rounded corners on cards and buttons (8px–12px radius)
- Subtle shadows or borders to delineate sections, never heavy drop shadows
- Mobile-first responsive design — coaches will use this on phones between sessions
- Dashboard should be glanceable — surface the most important info immediately

---

## Tech Stack

- **Frontend:** React (Next.js) with Tailwind CSS
- **Backend:** Next.js API routes or a lightweight Node/Express server
- **Database:** Supabase (Postgres) — handles auth, database, storage, and realtime
- **Deployment:** Vercel (Pro plan for commercial use)
- **Auth:** Supabase Auth (email/password for coaches, magic link or invite-based for clients)
- **Payments (future):** Stripe integration
- **Version Control:** GitHub
- **Dev Tooling:** Claude Code for development

---

## User Roles

### 1. Coach (Admin)
- Full access to everything
- Two coach accounts: **James** and **Chris Sutera**
- Can manage all clients, schedules, finances, and reporting
- Can assign clients to themselves or the other coach

### 2. Client
- Invited by a coach — no public signup
- Can view their own schedule, bookings, and session history
- Can book available sessions/classes (based on coach availability)
- Can view and pay invoices
- Can view their own progress, assessments, and training plans
- Cannot see other clients' data

---

## Core Features

### 1. Dashboard
The first screen coaches see on login. At-a-glance business overview.

- **Today's schedule** — upcoming sessions for the day, which coach, which client(s)
- **Revenue summary** — current month income, outstanding invoices, comparison to previous month
- **Quick stats** — total active clients, sessions this week, upcoming sessions today
- **Reminders/alerts** — overdue payments, upcoming client birthdays, expiring packages
- **Recent activity feed** — new bookings, cancellations, payments received
- Each coach can toggle between viewing their own schedule or the combined business view

### 2. Calendar / Scheduling
The backbone of daily operations. Must be simple and fast.

- **Views:** Day, Week, Month
- **Session types:**
  - 1-on-1 sessions (coach + single client)
  - Group sessions / classes (coach + multiple clients, with capacity limits)
  - Blocked time / unavailable slots (personal time, travel, etc.)
- **Session creation:**
  - Select coach (James or Chris)
  - Select client(s)
  - Set date, time, duration
  - Set location (field name, facility, etc.)
  - Add session notes
  - Recurring session support (e.g., every Tuesday 4pm)
- **Duplication:** Duplicate a single session, a day, or an entire week
- **Client self-booking:** Clients see available slots and book themselves in (based on coach availability windows)
- **Cancellation policy:** Configurable cancellation window (e.g., 24hr notice required)
- **Notifications:**
  - Automated email/SMS reminders before sessions (configurable: 24hr, 2hr, etc.)
  - Cancellation notifications
  - Waitlist notifications when a spot opens
- **Colour coding by coach** — visually distinguish James's sessions from Chris's on the calendar (use black/grey tones to stay on brand)

### 3. Client Database & Management
Central hub for all client information.

- **Client profile fields:**
  - Full name, date of birth, age
  - Contact: phone, email, address
  - Emergency contact name & phone
  - Profile photo
  - Football-specific: playing position, current team/club, competition level (junior, amateur, semi-pro, etc.)
  - Medical conditions, injuries, allergies (important for physical training)
  - Notes (free-text, timestamped by coach)
  - Assigned coach (James or Chris, or both)
- **Client status:** Lead → Active → Inactive / Former
- **Client record includes:**
  - Session history (all past and upcoming bookings)
  - Payment history and outstanding balance
  - Assessment history and progress data
  - Training programs assigned
  - Communication log / notes
- **Custom fields:** Ability to add custom data fields per client (e.g., "Sprint time", "Vertical leap")
- **Search & filter:** By name, status, assigned coach, package type, etc.
- **Family accounts:** Link related clients (e.g., siblings training together)
- **Bulk actions:** Email/SMS all clients, all clients of a specific coach, all clients in a group, etc.

### 4. Services: Packages, Memberships & Products

#### Packages
- Bundles of sessions sold as a unit (e.g., "10-Session Pack", "6-Week Speed Program")
- Set price, number of sessions included, expiry date
- Track remaining sessions per client
- Notify when sessions are running low or expired

#### Memberships
- Recurring subscriptions (weekly, fortnightly, monthly)
- Define what's included: number of 1-on-1 sessions, group sessions, or both
- Auto-billing on a schedule
- Active/paused/cancelled status

#### Products (Future)
- One-off items for sale: merchandise, training equipment, digital resources (e.g., training PDFs, video breakdowns)
- Online store accessible to clients via their portal

#### Session & Class Templates
- Pre-defined session types for quick scheduling:
  - "1-on-1 Speed & Agility" — 60min
  - "Group Skills Session" — 90min
  - "Match Analysis Review" — 30min
- Set default duration, capacity, price, location for each template

### 5. Payments & Invoicing

- **Invoice generation:** Create and send professional invoices to clients (email/in-app)
- **Payment tracking:** See who's paid, who's overdue, and total outstanding
- **Payment methods (future Stripe integration):**
  - Online card payments
  - Direct debit / recurring billing for memberships
  - Record manual/cash payments
- **Financial dashboard:**
  - Monthly and yearly revenue totals
  - Revenue per coach breakdown
  - Income vs expenses tracking
  - Outstanding invoices summary
- **Receipts:** Auto-generate and email receipts on payment
- **Overdue reminders:** Automated follow-up for unpaid invoices

### 6. Assessments & Progress Tracking
Football-specific performance monitoring.

- **Assessment templates (customisable):**
  - Sprint times (10m, 20m, 40m)
  - Agility test results (e.g., T-test, Illinois Agility)
  - Vertical jump / standing long jump
  - Endurance (e.g., Yo-Yo test, beep test level)
  - Technical skills scores (passing accuracy, ball control rating, shooting accuracy)
  - Body measurements (height, weight, body fat % if relevant)
  - Custom measurements (coaches can add their own metrics)
- **Progress tracking:**
  - Graph/chart view of metrics over time per client
  - Compare across assessment dates
  - Before/after snapshots
- **Progress photos/videos:** Upload and attach to assessment records
- **Share with client:** Clients can view their own assessment history and progress graphs in their portal

### 7. Training Programs
Build and assign structured training plans.

- **Program builder:**
  - Create programs with multiple sessions/phases
  - Each session contains exercises/drills with:
    - Name and description
    - Sets, reps, duration, distance, rest period (as applicable)
    - Video link or uploaded demo video
    - Notes / coaching cues
  - Organise by phase/week (e.g., "Week 1: Foundation", "Week 4: Speed Development")
- **Exercise library:**
  - Pre-loaded football-specific drills and exercises
  - Coaches can add custom exercises with descriptions and video links
  - Categorised: Speed, Agility, Strength, Technical, Tactical, Recovery
- **Assign to clients:** Send a program directly to a client's portal
- **Client view:** Clients see their assigned program, can mark exercises as completed, log their results
- **Program templates:** Save and reuse common programs across clients

### 8. Reporting & Analytics

- **Financial reports:**
  - Revenue by month/quarter/year
  - Revenue per coach
  - Revenue by service type (1-on-1 vs group, package vs membership)
  - Outstanding debts report
- **Client reports:**
  - Total active vs inactive clients
  - New clients per month
  - Client retention rate
  - Clients per coach
- **Attendance reports:**
  - Session attendance rate
  - No-show rate
  - Most popular session times / days
  - Attendance by class/group
- **Package/membership reports:**
  - Expiring packages (next 7/14/30 days)
  - Most popular packages
  - Active memberships count and revenue
- **Export:** CSV/PDF export for all reports

### 9. Notifications & Communications

- **Automated notifications (configurable per coach):**
  - Session reminders (email and/or SMS)
  - Payment reminders and overdue notices
  - Package expiry warnings
  - Birthday messages
  - Welcome message on client signup
- **Manual messaging:**
  - Send individual or bulk messages to clients
  - Email and SMS support
  - Message templates for common comms
- **In-app notifications:** Bell icon with recent alerts for coaches

### 10. Client Portal (Client-Facing)
What clients see when they log in.

- **My Schedule:** View upcoming and past sessions
- **Book a Session:** See coach availability, book into available 1-on-1 or group slots
- **My Progress:** View assessment results, progress charts, and training programs
- **My Payments:** View invoices, make payments, see payment history
- **My Profile:** Update personal details, contact info
- **Notifications:** Session reminders, payment due alerts
- Clean, simple interface — clients don't need to see business admin

---

## Data Model (High-Level)

### Core Tables

```
users
├── id, email, password_hash, role (coach | client), name, avatar_url
├── created_at, updated_at

coaches (extends users where role = coach)
├── user_id → users.id
├── bio, phone

clients
├── id, user_id → users.id (nullable, for clients without login)
├── first_name, last_name, email, phone, date_of_birth
├── address, emergency_contact_name, emergency_contact_phone
├── position, current_club, competition_level
├── medical_notes, status (lead | active | inactive)
├── assigned_coach_id → coaches.id
├── profile_photo_url, created_at, updated_at

sessions
├── id, coach_id → coaches.id
├── session_template_id → session_templates.id (nullable)
├── type (one_on_one | group | blocked)
├── title, date, start_time, end_time, duration_minutes
├── location, capacity, notes
├── recurrence_rule (nullable — for recurring sessions)
├── status (scheduled | completed | cancelled | no_show)
├── created_at

session_clients (many-to-many: sessions ↔ clients)
├── session_id → sessions.id
├── client_id → clients.id
├── attendance_status (booked | attended | no_show | cancelled)

session_templates
├── id, name, type, default_duration, default_capacity
├── default_location, default_price, description

packages
├── id, name, description, price
├── total_sessions, expiry_days, is_active

memberships
├── id, name, description, price
├── billing_frequency (weekly | fortnightly | monthly)
├── sessions_included, group_sessions_included, is_active

client_packages
├── id, client_id → clients.id, package_id → packages.id
├── sessions_remaining, purchased_at, expires_at, status

client_memberships
├── id, client_id → clients.id, membership_id → memberships.id
├── start_date, next_billing_date, status (active | paused | cancelled)

invoices
├── id, client_id → clients.id, coach_id → coaches.id
├── amount, description, due_date
├── status (draft | sent | paid | overdue | cancelled)
├── paid_at, payment_method

payments
├── id, invoice_id → invoices.id, client_id → clients.id
├── amount, method (card | cash | bank_transfer)
├── received_at, notes

assessments
├── id, client_id → clients.id, coach_id → coaches.id
├── date, notes

assessment_metrics
├── id, assessment_id → assessments.id
├── metric_name (e.g., "40m Sprint"), value, unit
├── created_at

programs
├── id, name, description, coach_id → coaches.id
├── duration_weeks, category, created_at

program_phases
├── id, program_id → programs.id
├── phase_number, name (e.g., "Week 1-2: Foundation")

program_exercises
├── id, phase_id → program_phases.id
├── exercise_id → exercises.id
├── sets, reps, duration, distance, rest_seconds
├── order, notes

exercises
├── id, name, description, category
├── video_url, created_by (coach_id)

client_programs
├── id, client_id → clients.id, program_id → programs.id
├── assigned_at, status (active | completed | archived)

client_notes
├── id, client_id → clients.id, coach_id → coaches.id
├── content, created_at

notifications
├── id, user_id → users.id
├── type, title, body, read, created_at
```

---

## Navigation Structure

### Coach View (Sidebar or Top Nav)
1. **Dashboard** — overview & quick stats
2. **Calendar** — schedule management
3. **Clients** — client database
4. **Services** — packages, memberships, products
5. **Finances** — invoices, payments, revenue
6. **Programs** — training program builder
7. **Reports** — analytics & exports
8. **Settings** — business settings, coach profiles, notification preferences

### Client View (Simplified Nav)
1. **Home** — upcoming sessions, recent notifications
2. **Schedule** — view/book sessions
3. **My Progress** — assessments & training programs
4. **Payments** — invoices & payment history
5. **Profile** — personal details

---

## Implementation Phases

### Phase 1 — Foundation (MVP)
- Auth (coach login, client invite system)
- Dashboard (basic stats)
- Calendar with session CRUD (create, read, update, delete)
- Client database with full profiles
- Session booking (coach-managed)
- Basic invoicing and payment tracking (manual/cash recording)

### Phase 2 — Client Portal & Scheduling
- Client login and portal
- Client self-booking from available slots
- Automated session reminders (email)
- Package and membership management
- Invoice sending and payment status tracking

### Phase 3 — Performance & Programs
- Assessment system with custom metrics
- Progress tracking with charts
- Training program builder
- Exercise library
- Client-facing progress view

### Phase 4 — Payments & Advanced
- Stripe integration for online payments
- Recurring billing for memberships
- Full reporting suite
- SMS notifications
- Bulk messaging
- Data export (CSV/PDF)

### Phase 5 — Polish & Scale
- Mobile app wrapper (React Native or PWA)
- Online store for products/merchandise
- Advanced analytics
- Waitlist management
- Google Calendar sync

---

## Key Differences from PT Minder

| Area | PT Minder | Accelerate Performance Football |
|---|---|---|
| **Focus** | General personal training | Football-specific coaching |
| **Exercises** | Gym-based exercise library (1200+ videos) | Football drills: speed, agility, technical, tactical |
| **Assessments** | General fitness metrics (weight, body fat, etc.) | Football performance metrics (sprint times, agility tests, Yo-Yo test, skill scores) |
| **Design** | Colourful, standard SaaS look | Black & white monochrome, clean & modern |
| **Coaches** | Scales to unlimited trainers | Fixed: James and Chris Sutera |
| **Sessions** | Gym-based PT sessions | Field-based coaching — locations are pitches/ovals, not gym floors |
| **Nutrition** | Full nutrition planner with food database | Not included (can be added later if needed) |
| **Branding** | Generic fitness | Football / athletic performance branding |

---

## File & Folder Structure (Suggested)

```
accelerate-performance/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/             # Login, signup, forgot password
│   │   ├── (coach)/            # Coach-facing pages
│   │   │   ├── dashboard/
│   │   │   ├── calendar/
│   │   │   ├── clients/
│   │   │   │   └── [id]/       # Individual client profile
│   │   │   ├── services/
│   │   │   ├── finances/
│   │   │   ├── programs/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── (client)/           # Client-facing portal pages
│   │   │   ├── home/
│   │   │   ├── schedule/
│   │   │   ├── progress/
│   │   │   ├── payments/
│   │   │   └── profile/
│   │   ├── api/                # API routes
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Button, Card, Modal, etc.)
│   │   ├── calendar/           # Calendar-specific components
│   │   ├── clients/            # Client-related components
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── finances/           # Invoice and payment components
│   │   ├── programs/           # Training program components
│   │   └── layout/             # Nav, Sidebar, Header, Footer
│   ├── lib/
│   │   ├── supabase/           # Supabase client, helpers, types
│   │   ├── utils/              # General utility functions
│   │   └── constants.ts        # App-wide constants
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── styles/                 # Global styles, Tailwind config
├── public/                     # Static assets (logo, icons)
├── supabase/
│   └── migrations/             # Database migration files
├── .env.local                  # Environment variables (Supabase keys, etc.)
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── claude.md                   # This file
```

---

## Notes for Development

- **Mobile-first:** Coaches will check this between sessions on their phones. Every screen must work beautifully on mobile.
- **Speed:** Keep the UI snappy. Use optimistic updates, skeleton loaders, and minimal bundle size.
- **Supabase Row Level Security:** Enforce data access at the database level — clients should never be able to query other clients' data.
- **Timezone:** All times in AEST/AEDT (Melbourne timezone). Store UTC in the database, display local.
- **Currency:** AUD ($). All monetary values stored in cents.
- **Date format:** DD/MM/YYYY (Australian standard).
- **Accessibility:** Maintain WCAG AA contrast ratios — the black/white scheme helps here, but ensure interactive elements have clear focus states.
