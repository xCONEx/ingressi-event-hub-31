export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      checkins: {
        Row: {
          checked_in_at: string | null
          checked_in_by: string | null
          event_id: string | null
          id: string
          ticket_id: string | null
        }
        Insert: {
          checked_in_at?: string | null
          checked_in_by?: string | null
          event_id?: string | null
          id?: string
          ticket_id?: string | null
        }
        Update: {
          checked_in_at?: string | null
          checked_in_by?: string | null
          event_id?: string | null
          id?: string
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkins_checked_in_by_fkey"
            columns: ["checked_in_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkins_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_pages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      event_authorizations: {
        Row: {
          authorized_by: string | null
          authorized_user_id: string | null
          created_at: string | null
          event_id: string | null
          id: string
          status: Database["public"]["Enums"]["authorization_status"] | null
          updated_at: string | null
        }
        Insert: {
          authorized_by?: string | null
          authorized_user_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["authorization_status"] | null
          updated_at?: string | null
        }
        Update: {
          authorized_by?: string | null
          authorized_user_id?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["authorization_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_authorizations_authorized_by_fkey"
            columns: ["authorized_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_authorizations_authorized_user_id_fkey"
            columns: ["authorized_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_authorizations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_day_registrations: {
        Row: {
          created_at: string | null
          event_day_id: string
          id: string
          ticket_id: string
        }
        Insert: {
          created_at?: string | null
          event_day_id: string
          id?: string
          ticket_id: string
        }
        Update: {
          created_at?: string | null
          event_day_id?: string
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_day_registrations_event_day_id_fkey"
            columns: ["event_day_id"]
            isOneToOne: false
            referencedRelation: "event_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_day_registrations_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      event_days: {
        Row: {
          capacity: number | null
          created_at: string | null
          date: string
          event_id: string
          id: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          date: string
          event_id: string
          id?: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          date?: string
          event_id?: string
          id?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_days_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          category: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          organizer_id: string | null
          price: number | null
          status: Database["public"]["Enums"]["event_status"] | null
          system_fee_percentage: number | null
          ticket_type: Database["public"]["Enums"]["ticket_type"]
          time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          category?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          organizer_id?: string | null
          price?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
          system_fee_percentage?: number | null
          ticket_type?: Database["public"]["Enums"]["ticket_type"]
          time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          organizer_id?: string | null
          price?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
          system_fee_percentage?: number | null
          ticket_type?: Database["public"]["Enums"]["ticket_type"]
          time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cpf: string | null
          created_at: string | null
          email: string
          id: string
          is_organizer: boolean | null
          name: string
          phone: string | null
          plan_expires_at: string | null
          plan_type: Database["public"]["Enums"]["user_plan_type"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_organizer?: boolean | null
          name: string
          phone?: string | null
          plan_expires_at?: string | null
          plan_type?: Database["public"]["Enums"]["user_plan_type"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_organizer?: boolean | null
          name?: string
          phone?: string | null
          plan_expires_at?: string | null
          plan_type?: Database["public"]["Enums"]["user_plan_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_fees: {
        Row: {
          created_at: string | null
          fee_percentage: number
          id: string
          plan_type: Database["public"]["Enums"]["user_plan_type"]
        }
        Insert: {
          created_at?: string | null
          fee_percentage?: number
          id?: string
          plan_type: Database["public"]["Enums"]["user_plan_type"]
        }
        Update: {
          created_at?: string | null
          fee_percentage?: number
          id?: string
          plan_type?: Database["public"]["Enums"]["user_plan_type"]
        }
        Relationships: []
      }
      tickets: {
        Row: {
          attendee_email: string
          attendee_name: string
          attendee_phone: string | null
          checked_in: boolean | null
          checked_in_at: string | null
          created_at: string | null
          event_id: string | null
          id: string
          payment_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          price: number | null
          qr_code: string
        }
        Insert: {
          attendee_email: string
          attendee_name: string
          attendee_phone?: string | null
          checked_in?: boolean | null
          checked_in_at?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          price?: number | null
          qr_code: string
        }
        Update: {
          attendee_email?: string
          attendee_name?: string
          attendee_phone?: string | null
          checked_in?: boolean | null
          checked_in_at?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          payment_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          price?: number | null
          qr_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_paid_events: {
        Args: { user_id: string }
        Returns: boolean
      }
      count_events_by_category: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          event_count: number
        }[]
      }
      generate_qr_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      authorization_status: "pending" | "approved" | "denied"
      event_status: "draft" | "published" | "cancelled" | "completed"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      ticket_type: "free" | "paid"
      user_plan_type: "free" | "basic" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      authorization_status: ["pending", "approved", "denied"],
      event_status: ["draft", "published", "cancelled", "completed"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      ticket_type: ["free", "paid"],
      user_plan_type: ["free", "basic", "premium"],
    },
  },
} as const
