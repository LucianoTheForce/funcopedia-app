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
      clients: {
        Row: {
          cnpj: string | null
          created_at: string
          created_by: string
          email: string | null
          id: number
          is_registered: boolean | null
          name: string
          phone: string | null
          registration_token: string | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          created_by: string
          email?: string | null
          id?: number
          is_registered?: boolean | null
          name: string
          phone?: string | null
          registration_token?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          created_by?: string
          email?: string | null
          id?: number
          is_registered?: boolean | null
          name?: string
          phone?: string | null
          registration_token?: string | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          receiver_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          receiver_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          receiver_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_profile_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_profile_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string | null
          id: string
          is_fake: boolean | null
          last_seen: string | null
          latitude: number | null
          longitude: number | null
          online: boolean | null
          profile_gif: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          id: string
          is_fake?: boolean | null
          last_seen?: string | null
          latitude?: number | null
          longitude?: number | null
          online?: boolean | null
          profile_gif?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          is_fake?: boolean | null
          last_seen?: string | null
          latitude?: number | null
          longitude?: number | null
          online?: boolean | null
          profile_gif?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      proposal_templates: {
        Row: {
          content: Json | null
          created_at: string
          created_by: string
          description: string | null
          id: number
          is_public: boolean
          name: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: number
          is_public?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          is_public?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          briefing: string | null
          client: string
          content: Json | null
          created_at: string
          created_by: string
          id: number
          is_ai_generated: boolean | null
          sections: Json | null
          status: string
          title: string
          updated_at: string
          value: number
        }
        Insert: {
          briefing?: string | null
          client: string
          content?: Json | null
          created_at?: string
          created_by: string
          id?: number
          is_ai_generated?: boolean | null
          sections?: Json | null
          status?: string
          title: string
          updated_at?: string
          value?: number
        }
        Update: {
          briefing?: string | null
          client?: string
          content?: Json | null
          created_at?: string
          created_by?: string
          id?: number
          is_ai_generated?: boolean | null
          sections?: Json | null
          status?: string
          title?: string
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
