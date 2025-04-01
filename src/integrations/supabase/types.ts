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
      cms_content: {
        Row: {
          category: string | null
          content: Json
          created_at: string
          created_by: string | null
          id: string
          key: string
          page: string | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          key: string
          page?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          key?: string
          page?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          code: string
          currency: string
          currency_symbol: string
          flag_emoji: string | null
          is_receiving_enabled: boolean
          is_sending_enabled: boolean
          name: string
          payment_methods: Json
        }
        Insert: {
          code: string
          currency: string
          currency_symbol: string
          flag_emoji?: string | null
          is_receiving_enabled?: boolean
          is_sending_enabled?: boolean
          name: string
          payment_methods?: Json
        }
        Update: {
          code?: string
          currency?: string
          currency_symbol?: string
          flag_emoji?: string | null
          is_receiving_enabled?: boolean
          is_sending_enabled?: boolean
          name?: string
          payment_methods?: Json
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          enabled: boolean
          id: string
          key: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          key: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enabled?: boolean
          id?: string
          key?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country_code: string | null
          created_at: string
          full_name: string | null
          id: string
          language_preference: string | null
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          language_preference?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          country_code?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language_preference?: string | null
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recipients: {
        Row: {
          contact: string
          country: string
          created_at: string
          id: string
          is_favorite: boolean
          last_used: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact: string
          country: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          last_used?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact?: string
          country?: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          last_used?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recurring_payments: {
        Row: {
          amount: string
          created_at: string
          currency: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          last_transaction_id: string | null
          next_date: string
          payment_method: string | null
          provider: string | null
          recipient_id: string
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: string
          created_at?: string
          currency?: string
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean
          last_transaction_id?: string | null
          next_date: string
          payment_method?: string | null
          provider?: string | null
          recipient_id: string
          start_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: string
          created_at?: string
          currency?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_transaction_id?: string | null
          next_date?: string
          payment_method?: string | null
          provider?: string | null
          recipient_id?: string
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_payments_last_transaction_id_fkey"
            columns: ["last_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_payments_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: string
          completed_at: string | null
          country: string
          created_at: string
          estimated_delivery: string | null
          failure_reason: string | null
          fee: string | null
          id: string
          is_recurring: boolean | null
          payment_method: string | null
          provider: string | null
          recipient_contact: string | null
          recipient_id: string | null
          recipient_name: string
          recurring_payment_id: string | null
          status: string
          total_amount: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: string
          completed_at?: string | null
          country: string
          created_at?: string
          estimated_delivery?: string | null
          failure_reason?: string | null
          fee?: string | null
          id?: string
          is_recurring?: boolean | null
          payment_method?: string | null
          provider?: string | null
          recipient_contact?: string | null
          recipient_id?: string | null
          recipient_name: string
          recurring_payment_id?: string | null
          status: string
          total_amount?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: string
          completed_at?: string | null
          country?: string
          created_at?: string
          estimated_delivery?: string | null
          failure_reason?: string | null
          fee?: string | null
          id?: string
          is_recurring?: boolean | null
          payment_method?: string | null
          provider?: string | null
          recipient_contact?: string | null
          recipient_id?: string | null
          recipient_name?: string
          recurring_payment_id?: string | null
          status?: string
          total_amount?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recurring_payment_id_fkey"
            columns: ["recurring_payment_id"]
            isOneToOne: false
            referencedRelation: "recurring_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
