-- =============================================================
-- Accelerate Performance Football - Initial Schema
-- =============================================================

-- ---------------------------------------------------------
-- Custom enum types
-- ---------------------------------------------------------

CREATE TYPE user_role AS ENUM ('coach', 'client');
CREATE TYPE session_type AS ENUM ('one_on_one', 'group', 'blocked');
CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE attendance_status AS ENUM ('booked', 'attended', 'no_show', 'cancelled');
CREATE TYPE client_status AS ENUM ('lead', 'active', 'inactive');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_method AS ENUM ('card', 'cash', 'bank_transfer');
CREATE TYPE billing_frequency AS ENUM ('weekly', 'fortnightly', 'monthly');
CREATE TYPE membership_status AS ENUM ('active', 'paused', 'cancelled');
CREATE TYPE package_status AS ENUM ('active', 'expired', 'used');
CREATE TYPE program_status AS ENUM ('active', 'completed', 'archived');
CREATE TYPE exercise_category AS ENUM ('speed', 'agility', 'strength', 'technical', 'tactical', 'recovery');
CREATE TYPE competition_level AS ENUM ('junior', 'amateur', 'semi_pro', 'professional');

-- ---------------------------------------------------------
-- Users
-- ---------------------------------------------------------

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);

-- ---------------------------------------------------------
-- Coaches (extends users where role = coach)
-- ---------------------------------------------------------

CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE INDEX idx_coaches_user_id ON coaches (user_id);

-- ---------------------------------------------------------
-- Clients
-- ---------------------------------------------------------

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  position TEXT,
  current_club TEXT,
  competition_level competition_level,
  medical_notes TEXT,
  status client_status NOT NULL DEFAULT 'lead',
  assigned_coach_id UUID REFERENCES coaches (id) ON DELETE SET NULL,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_user_id ON clients (user_id);
CREATE INDEX idx_clients_status ON clients (status);
CREATE INDEX idx_clients_assigned_coach ON clients (assigned_coach_id);
CREATE INDEX idx_clients_name ON clients (last_name, first_name);

-- ---------------------------------------------------------
-- Session templates
-- ---------------------------------------------------------

CREATE TABLE session_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type session_type NOT NULL,
  default_duration INTEGER NOT NULL,
  default_capacity INTEGER,
  default_location TEXT,
  default_price INTEGER, -- stored in cents
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Sessions
-- ---------------------------------------------------------

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES coaches (id) ON DELETE CASCADE,
  session_template_id UUID REFERENCES session_templates (id) ON DELETE SET NULL,
  type session_type NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  location TEXT,
  capacity INTEGER,
  notes TEXT,
  recurrence_rule TEXT,
  status session_status NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_coach_id ON sessions (coach_id);
CREATE INDEX idx_sessions_date ON sessions (date);
CREATE INDEX idx_sessions_status ON sessions (status);
CREATE INDEX idx_sessions_coach_date ON sessions (coach_id, date);

-- ---------------------------------------------------------
-- Session clients (many-to-many: sessions and clients)
-- ---------------------------------------------------------

CREATE TABLE session_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions (id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  attendance_status attendance_status NOT NULL DEFAULT 'booked',
  UNIQUE (session_id, client_id)
);

CREATE INDEX idx_session_clients_session ON session_clients (session_id);
CREATE INDEX idx_session_clients_client ON session_clients (client_id);

-- ---------------------------------------------------------
-- Packages
-- ---------------------------------------------------------

CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- stored in cents
  total_sessions INTEGER NOT NULL,
  expiry_days INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Memberships
-- ---------------------------------------------------------

CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- stored in cents
  billing_frequency billing_frequency NOT NULL,
  sessions_included INTEGER NOT NULL DEFAULT 0,
  group_sessions_included INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------
-- Client packages
-- ---------------------------------------------------------

CREATE TABLE client_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES packages (id) ON DELETE CASCADE,
  sessions_remaining INTEGER NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  status package_status NOT NULL DEFAULT 'active'
);

CREATE INDEX idx_client_packages_client ON client_packages (client_id);
CREATE INDEX idx_client_packages_status ON client_packages (status);

-- ---------------------------------------------------------
-- Client memberships
-- ---------------------------------------------------------

CREATE TABLE client_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES memberships (id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  next_billing_date DATE,
  status membership_status NOT NULL DEFAULT 'active'
);

CREATE INDEX idx_client_memberships_client ON client_memberships (client_id);
CREATE INDEX idx_client_memberships_status ON client_memberships (status);

-- ---------------------------------------------------------
-- Invoices
-- ---------------------------------------------------------

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES coaches (id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- stored in cents
  description TEXT,
  due_date DATE NOT NULL,
  status invoice_status NOT NULL DEFAULT 'draft',
  paid_at TIMESTAMPTZ,
  payment_method payment_method,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invoices_client ON invoices (client_id);
CREATE INDEX idx_invoices_coach ON invoices (coach_id);
CREATE INDEX idx_invoices_status ON invoices (status);
CREATE INDEX idx_invoices_due_date ON invoices (due_date);

-- ---------------------------------------------------------
-- Payments
-- ---------------------------------------------------------

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices (id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- stored in cents
  method payment_method NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

CREATE INDEX idx_payments_invoice ON payments (invoice_id);
CREATE INDEX idx_payments_client ON payments (client_id);

-- ---------------------------------------------------------
-- Assessments
-- ---------------------------------------------------------

CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES coaches (id) ON DELETE CASCADE,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assessments_client ON assessments (client_id);
CREATE INDEX idx_assessments_date ON assessments (date);

-- ---------------------------------------------------------
-- Assessment metrics
-- ---------------------------------------------------------

CREATE TABLE assessment_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES assessments (id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assessment_metrics_assessment ON assessment_metrics (assessment_id);

-- ---------------------------------------------------------
-- Exercises
-- ---------------------------------------------------------

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category exercise_category,
  video_url TEXT,
  created_by UUID REFERENCES coaches (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exercises_category ON exercises (category);

-- ---------------------------------------------------------
-- Programs
-- ---------------------------------------------------------

CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  coach_id UUID NOT NULL REFERENCES coaches (id) ON DELETE CASCADE,
  duration_weeks INTEGER,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_programs_coach ON programs (coach_id);

-- ---------------------------------------------------------
-- Program phases
-- ---------------------------------------------------------

CREATE TABLE program_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs (id) ON DELETE CASCADE,
  phase_number INTEGER NOT NULL,
  name TEXT NOT NULL
);

CREATE INDEX idx_program_phases_program ON program_phases (program_id);

-- ---------------------------------------------------------
-- Program exercises
-- ---------------------------------------------------------

CREATE TABLE program_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES program_phases (id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  duration INTEGER,
  distance INTEGER,
  rest_seconds INTEGER,
  "order" INTEGER NOT NULL,
  notes TEXT
);

CREATE INDEX idx_program_exercises_phase ON program_exercises (phase_id);

-- ---------------------------------------------------------
-- Client programs
-- ---------------------------------------------------------

CREATE TABLE client_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES programs (id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status program_status NOT NULL DEFAULT 'active'
);

CREATE INDEX idx_client_programs_client ON client_programs (client_id);
CREATE INDEX idx_client_programs_status ON client_programs (status);

-- ---------------------------------------------------------
-- Client notes
-- ---------------------------------------------------------

CREATE TABLE client_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES coaches (id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_notes_client ON client_notes (client_id);

-- ---------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_read ON notifications (user_id, read);

-- ---------------------------------------------------------
-- Updated-at trigger function
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to tables that have the column
CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_coaches
  BEFORE UPDATE ON coaches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_clients
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- Row Level Security
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- Helper: check if the current user is a coach
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION is_coach()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'coach'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------
-- Helper: get the client row id for the current auth user
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION get_client_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM clients
    WHERE user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------
-- Users policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can view all users"
  ON users FOR SELECT
  USING (is_coach());

CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Coaches can update all users"
  ON users FOR UPDATE
  USING (is_coach());

CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- ---------------------------------------------------------
-- Coaches policies
-- ---------------------------------------------------------

CREATE POLICY "Anyone authenticated can view coaches"
  ON coaches FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Coaches can manage coaches"
  ON coaches FOR ALL
  USING (is_coach());

-- ---------------------------------------------------------
-- Clients policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all clients"
  ON clients FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view own record"
  ON clients FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Clients can update own record"
  ON clients FOR UPDATE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------
-- Sessions policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all sessions"
  ON sessions FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view sessions they are booked into"
  ON sessions FOR SELECT
  USING (
    id IN (
      SELECT session_id FROM session_clients
      WHERE client_id = get_client_id()
    )
  );

-- ---------------------------------------------------------
-- Session clients policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all session clients"
  ON session_clients FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view own session bookings"
  ON session_clients FOR SELECT
  USING (client_id = get_client_id());

CREATE POLICY "Clients can insert own bookings"
  ON session_clients FOR INSERT
  WITH CHECK (client_id = get_client_id());

CREATE POLICY "Clients can cancel own bookings"
  ON session_clients FOR UPDATE
  USING (client_id = get_client_id());

-- ---------------------------------------------------------
-- Session templates policies
-- ---------------------------------------------------------

CREATE POLICY "Anyone authenticated can view session templates"
  ON session_templates FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Coaches can manage session templates"
  ON session_templates FOR ALL
  USING (is_coach());

-- ---------------------------------------------------------
-- Packages policies
-- ---------------------------------------------------------

CREATE POLICY "Anyone authenticated can view active packages"
  ON packages FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Coaches can manage all packages"
  ON packages FOR ALL
  USING (is_coach());

-- ---------------------------------------------------------
-- Memberships policies
-- ---------------------------------------------------------

CREATE POLICY "Anyone authenticated can view active memberships"
  ON memberships FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_active = true);

CREATE POLICY "Coaches can manage all memberships"
  ON memberships FOR ALL
  USING (is_coach());

-- ---------------------------------------------------------
-- Client packages policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all client packages"
  ON client_packages FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view own packages"
  ON client_packages FOR SELECT
  USING (client_id = get_client_id());

-- ---------------------------------------------------------
-- Client memberships policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all client memberships"
  ON client_memberships FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view own memberships"
  ON client_memberships FOR SELECT
  USING (client_id = get_client_id());

-- ---------------------------------------------------------
-- Invoices policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all invoices"
  ON invoices FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view own invoices"
  ON invoices FOR SELECT
  USING (client_id = get_client_id());

-- ---------------------------------------------------------
-- Payments policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all payments"
  ON payments FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view own payments"
  ON payments FOR SELECT
  USING (client_id = get_client_id());

-- ---------------------------------------------------------
-- Assessments policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all assessments"
  ON assessments FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view own assessments"
  ON assessments FOR SELECT
  USING (client_id = get_client_id());

-- ---------------------------------------------------------
-- Assessment metrics policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all assessment metrics"
  ON assessment_metrics FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view own assessment metrics"
  ON assessment_metrics FOR SELECT
  USING (
    assessment_id IN (
      SELECT id FROM assessments
      WHERE client_id = get_client_id()
    )
  );

-- ---------------------------------------------------------
-- Exercises policies
-- ---------------------------------------------------------

CREATE POLICY "Anyone authenticated can view exercises"
  ON exercises FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Coaches can manage exercises"
  ON exercises FOR ALL
  USING (is_coach());

-- ---------------------------------------------------------
-- Programs policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all programs"
  ON programs FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view assigned programs"
  ON programs FOR SELECT
  USING (
    id IN (
      SELECT program_id FROM client_programs
      WHERE client_id = get_client_id()
    )
  );

-- ---------------------------------------------------------
-- Program phases policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all program phases"
  ON program_phases FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view phases of assigned programs"
  ON program_phases FOR SELECT
  USING (
    program_id IN (
      SELECT program_id FROM client_programs
      WHERE client_id = get_client_id()
    )
  );

-- ---------------------------------------------------------
-- Program exercises policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all program exercises"
  ON program_exercises FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view exercises of assigned programs"
  ON program_exercises FOR SELECT
  USING (
    phase_id IN (
      SELECT pp.id FROM program_phases pp
      INNER JOIN client_programs cp ON cp.program_id = pp.program_id
      WHERE cp.client_id = get_client_id()
    )
  );

-- ---------------------------------------------------------
-- Client programs policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all client programs"
  ON client_programs FOR ALL
  USING (is_coach());

CREATE POLICY "Clients can view own program assignments"
  ON client_programs FOR SELECT
  USING (client_id = get_client_id());

-- ---------------------------------------------------------
-- Client notes policies
-- ---------------------------------------------------------

CREATE POLICY "Coaches can manage all client notes"
  ON client_notes FOR ALL
  USING (is_coach());

-- Clients intentionally cannot see coach notes about them

-- ---------------------------------------------------------
-- Notifications policies
-- ---------------------------------------------------------

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Coaches can manage all notifications"
  ON notifications FOR ALL
  USING (is_coach());
