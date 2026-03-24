// -----------------------------------------------
// Supabase Database Types
// Auto-generated types matching the data model
// -----------------------------------------------

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "coach" | "client";
          name: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role: "coach" | "client";
          name: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "coach" | "client";
          name?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      coaches: {
        Row: {
          id: string;
          user_id: string;
          bio: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bio?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bio?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string | null;
          date_of_birth: string | null;
          address: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          position: string | null;
          current_club: string | null;
          competition_level:
            | "junior"
            | "amateur"
            | "semi_pro"
            | "professional"
            | null;
          medical_notes: string | null;
          status: "lead" | "active" | "inactive";
          assigned_coach_id: string | null;
          profile_photo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          position?: string | null;
          current_club?: string | null;
          competition_level?:
            | "junior"
            | "amateur"
            | "semi_pro"
            | "professional"
            | null;
          medical_notes?: string | null;
          status?: "lead" | "active" | "inactive";
          assigned_coach_id?: string | null;
          profile_photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          address?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          position?: string | null;
          current_club?: string | null;
          competition_level?:
            | "junior"
            | "amateur"
            | "semi_pro"
            | "professional"
            | null;
          medical_notes?: string | null;
          status?: "lead" | "active" | "inactive";
          assigned_coach_id?: string | null;
          profile_photo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          coach_id: string;
          session_template_id: string | null;
          type: "one_on_one" | "group" | "blocked";
          title: string;
          date: string;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          location: string | null;
          capacity: number | null;
          notes: string | null;
          recurrence_rule: string | null;
          status: "scheduled" | "completed" | "cancelled" | "no_show";
          created_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          session_template_id?: string | null;
          type: "one_on_one" | "group" | "blocked";
          title: string;
          date: string;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          location?: string | null;
          capacity?: number | null;
          notes?: string | null;
          recurrence_rule?: string | null;
          status?: "scheduled" | "completed" | "cancelled" | "no_show";
          created_at?: string;
        };
        Update: {
          id?: string;
          coach_id?: string;
          session_template_id?: string | null;
          type?: "one_on_one" | "group" | "blocked";
          title?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          duration_minutes?: number;
          location?: string | null;
          capacity?: number | null;
          notes?: string | null;
          recurrence_rule?: string | null;
          status?: "scheduled" | "completed" | "cancelled" | "no_show";
          created_at?: string;
        };
      };
      session_clients: {
        Row: {
          id: string;
          session_id: string;
          client_id: string;
          attendance_status: "booked" | "attended" | "no_show" | "cancelled";
        };
        Insert: {
          id?: string;
          session_id: string;
          client_id: string;
          attendance_status?: "booked" | "attended" | "no_show" | "cancelled";
        };
        Update: {
          id?: string;
          session_id?: string;
          client_id?: string;
          attendance_status?: "booked" | "attended" | "no_show" | "cancelled";
        };
      };
      session_templates: {
        Row: {
          id: string;
          name: string;
          type: "one_on_one" | "group";
          default_duration: number;
          default_capacity: number | null;
          default_location: string | null;
          default_price: number | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: "one_on_one" | "group";
          default_duration: number;
          default_capacity?: number | null;
          default_location?: string | null;
          default_price?: number | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "one_on_one" | "group";
          default_duration?: number;
          default_capacity?: number | null;
          default_location?: string | null;
          default_price?: number | null;
          description?: string | null;
          created_at?: string;
        };
      };
      packages: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          total_sessions: number;
          expiry_days: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          total_sessions: number;
          expiry_days?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          total_sessions?: number;
          expiry_days?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price: number;
          billing_frequency: "weekly" | "fortnightly" | "monthly";
          sessions_included: number;
          group_sessions_included: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price: number;
          billing_frequency: "weekly" | "fortnightly" | "monthly";
          sessions_included: number;
          group_sessions_included?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          billing_frequency?: "weekly" | "fortnightly" | "monthly";
          sessions_included?: number;
          group_sessions_included?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      client_packages: {
        Row: {
          id: string;
          client_id: string;
          package_id: string;
          sessions_remaining: number;
          purchased_at: string;
          expires_at: string | null;
          status: "active" | "expired" | "used";
        };
        Insert: {
          id?: string;
          client_id: string;
          package_id: string;
          sessions_remaining: number;
          purchased_at?: string;
          expires_at?: string | null;
          status?: "active" | "expired" | "used";
        };
        Update: {
          id?: string;
          client_id?: string;
          package_id?: string;
          sessions_remaining?: number;
          purchased_at?: string;
          expires_at?: string | null;
          status?: "active" | "expired" | "used";
        };
      };
      client_memberships: {
        Row: {
          id: string;
          client_id: string;
          membership_id: string;
          start_date: string;
          next_billing_date: string | null;
          status: "active" | "paused" | "cancelled";
        };
        Insert: {
          id?: string;
          client_id: string;
          membership_id: string;
          start_date: string;
          next_billing_date?: string | null;
          status?: "active" | "paused" | "cancelled";
        };
        Update: {
          id?: string;
          client_id?: string;
          membership_id?: string;
          start_date?: string;
          next_billing_date?: string | null;
          status?: "active" | "paused" | "cancelled";
        };
      };
      invoices: {
        Row: {
          id: string;
          client_id: string;
          coach_id: string;
          amount: number;
          description: string | null;
          due_date: string;
          status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          paid_at: string | null;
          payment_method: "card" | "cash" | "bank_transfer" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          coach_id: string;
          amount: number;
          description?: string | null;
          due_date: string;
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          paid_at?: string | null;
          payment_method?: "card" | "cash" | "bank_transfer" | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          coach_id?: string;
          amount?: number;
          description?: string | null;
          due_date?: string;
          status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
          paid_at?: string | null;
          payment_method?: "card" | "cash" | "bank_transfer" | null;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          client_id: string;
          amount: number;
          method: "card" | "cash" | "bank_transfer";
          received_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          client_id: string;
          amount: number;
          method: "card" | "cash" | "bank_transfer";
          received_at?: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          client_id?: string;
          amount?: number;
          method?: "card" | "cash" | "bank_transfer";
          received_at?: string;
          notes?: string | null;
        };
      };
      assessments: {
        Row: {
          id: string;
          client_id: string;
          coach_id: string;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          coach_id: string;
          date: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          coach_id?: string;
          date?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      assessment_metrics: {
        Row: {
          id: string;
          assessment_id: string;
          metric_name: string;
          value: string;
          unit: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          metric_name: string;
          value: string;
          unit?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string;
          metric_name?: string;
          value?: string;
          unit?: string | null;
          created_at?: string;
        };
      };
      programs: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          coach_id: string;
          duration_weeks: number | null;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          coach_id: string;
          duration_weeks?: number | null;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          coach_id?: string;
          duration_weeks?: number | null;
          category?: string | null;
          created_at?: string;
        };
      };
      program_phases: {
        Row: {
          id: string;
          program_id: string;
          phase_number: number;
          name: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          phase_number: number;
          name: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          phase_number?: number;
          name?: string;
        };
      };
      program_exercises: {
        Row: {
          id: string;
          phase_id: string;
          exercise_id: string;
          sets: number | null;
          reps: number | null;
          duration: number | null;
          distance: number | null;
          rest_seconds: number | null;
          order: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          phase_id: string;
          exercise_id: string;
          sets?: number | null;
          reps?: number | null;
          duration?: number | null;
          distance?: number | null;
          rest_seconds?: number | null;
          order: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          phase_id?: string;
          exercise_id?: string;
          sets?: number | null;
          reps?: number | null;
          duration?: number | null;
          distance?: number | null;
          rest_seconds?: number | null;
          order?: number;
          notes?: string | null;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category:
            | "speed"
            | "agility"
            | "strength"
            | "technical"
            | "tactical"
            | "recovery"
            | null;
          video_url: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category?:
            | "speed"
            | "agility"
            | "strength"
            | "technical"
            | "tactical"
            | "recovery"
            | null;
          video_url?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?:
            | "speed"
            | "agility"
            | "strength"
            | "technical"
            | "tactical"
            | "recovery"
            | null;
          video_url?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      client_programs: {
        Row: {
          id: string;
          client_id: string;
          program_id: string;
          assigned_at: string;
          status: "active" | "completed" | "archived";
        };
        Insert: {
          id?: string;
          client_id: string;
          program_id: string;
          assigned_at?: string;
          status?: "active" | "completed" | "archived";
        };
        Update: {
          id?: string;
          client_id?: string;
          program_id?: string;
          assigned_at?: string;
          status?: "active" | "completed" | "archived";
        };
      };
      client_notes: {
        Row: {
          id: string;
          client_id: string;
          coach_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          coach_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          coach_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "coach" | "client";
      session_type: "one_on_one" | "group" | "blocked";
      session_status: "scheduled" | "completed" | "cancelled" | "no_show";
      attendance_status: "booked" | "attended" | "no_show" | "cancelled";
      client_status: "lead" | "active" | "inactive";
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
      payment_method: "card" | "cash" | "bank_transfer";
      billing_frequency: "weekly" | "fortnightly" | "monthly";
      membership_status: "active" | "paused" | "cancelled";
      package_status: "active" | "expired" | "used";
      program_status: "active" | "completed" | "archived";
      exercise_category:
        | "speed"
        | "agility"
        | "strength"
        | "technical"
        | "tactical"
        | "recovery";
      competition_level: "junior" | "amateur" | "semi_pro" | "professional";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// -----------------------------------------------
// Helper types for cleaner usage
// -----------------------------------------------

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
