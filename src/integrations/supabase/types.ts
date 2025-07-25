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
      distance_travelled: {
        Row: {
          created_at: string | null
          date: string
          distance: number
          hour: number
          id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          distance: number
          hour: number
          id?: string
        }
        Update: {
          created_at?: string | null
          date?: string
          distance?: number
          hour?: number
          id?: string
        }
        Relationships: []
      }
      fleet_status: {
        Row: {
          color: string
          count: number
          created_at: string | null
          id: string
          percentage: number
          status: string
        }
        Insert: {
          color: string
          count: number
          created_at?: string | null
          id?: string
          percentage: number
          status: string
        }
        Update: {
          color?: string
          count?: number
          created_at?: string | null
          id?: string
          percentage?: number
          status?: string
        }
        Relationships: []
      }
      fleet_utilization: {
        Row: {
          created_at: string | null
          date: string
          id: string
          percentage: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          percentage: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          percentage?: number
        }
        Relationships: []
      }
      overspeed_reports: {
        Row: {
          address: string | null
          created_at: string
          device_id: number
          driver_name: string | null
          duration_minutes: number | null
          id: number
          latitude: number
          longitude: number
          report_date: string
          server_time: string
          speed: number
          speed_limit: number | null
          vehicle_name: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          device_id: number
          driver_name?: string | null
          duration_minutes?: number | null
          id?: number
          latitude: number
          longitude: number
          report_date: string
          server_time: string
          speed: number
          speed_limit?: number | null
          vehicle_name?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          device_id?: number
          driver_name?: string | null
          duration_minutes?: number | null
          id?: number
          latitude?: number
          longitude?: number
          report_date?: string
          server_time?: string
          speed?: number
          speed_limit?: number | null
          vehicle_name?: string | null
        }
        Relationships: []
      }
      positions: {
        Row: {
          address: string | null
          created_at: string
          device_id: number
          distance: number | null
          id: number
          latitude: number
          longitude: number
          server_time: string
          speed: number | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          device_id: number
          distance?: number | null
          id?: number
          latitude: number
          longitude: number
          server_time?: string
          speed?: number | null
        }
        Update: {
          address?: string | null
          created_at?: string
          device_id?: number
          distance?: number | null
          id?: number
          latitude?: number
          longitude?: number
          server_time?: string
          speed?: number | null
        }
        Relationships: []
      }
      route_reports: {
        Row: {
          alarm: string | null
          created_at: string
          device_id: number
          distance: number | null
          id: number
          latitude: number
          longitude: number
          server_time: string
          stop_time: number | null
          total_distance: number | null
        }
        Insert: {
          alarm?: string | null
          created_at?: string
          device_id: number
          distance?: number | null
          id?: number
          latitude: number
          longitude: number
          server_time?: string
          stop_time?: number | null
          total_distance?: number | null
        }
        Update: {
          alarm?: string | null
          created_at?: string
          device_id?: number
          distance?: number | null
          id?: number
          latitude?: number
          longitude?: number
          server_time?: string
          stop_time?: number | null
          total_distance?: number | null
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
    Enums: {},
  },
} as const
