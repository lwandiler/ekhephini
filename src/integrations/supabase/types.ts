export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ad_clicks: {
        Row: {
          ad_id: string
          city: string | null
          clicked_at: string
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_address: unknown | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          ad_id: string
          city?: string | null
          clicked_at?: string
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          ad_id?: string
          city?: string | null
          clicked_at?: string
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_clicks_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_requests: {
        Row: {
          ad_type: string
          budget_range: string | null
          company_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          phone: string | null
          preferred_duration: string | null
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          ad_type: string
          budget_range?: string | null
          company_name: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          phone?: string | null
          preferred_duration?: string | null
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          ad_type?: string
          budget_range?: string | null
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          phone?: string | null
          preferred_duration?: string | null
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          password_hash: string
          updated_at: string | null
          username: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          password_hash: string
          updated_at?: string | null
          username: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          password_hash?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      ads: {
        Row: {
          active: boolean | null
          click_url: string | null
          created_at: string | null
          description: string | null
          display_duration_seconds: number | null
          end_date: string | null
          id: string
          image_url: string | null
          last_rotation_time: string | null
          position: string
          priority: number | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          click_url?: string | null
          created_at?: string | null
          description?: string | null
          display_duration_seconds?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          last_rotation_time?: string | null
          position?: string
          priority?: number | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          click_url?: string | null
          created_at?: string | null
          description?: string | null
          display_duration_seconds?: number | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          last_rotation_time?: string | null
          position?: string
          priority?: number | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_daily_stats: {
        Row: {
          average_session_duration: number | null
          bounce_rate: number | null
          created_at: string
          date: string
          id: string
          peak_concurrent_listeners: number | null
          total_listening_time: number | null
          total_page_views: number | null
          total_sessions: number | null
          total_unique_visitors: number | null
          updated_at: string
        }
        Insert: {
          average_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string
          date?: string
          id?: string
          peak_concurrent_listeners?: number | null
          total_listening_time?: number | null
          total_page_views?: number | null
          total_sessions?: number | null
          total_unique_visitors?: number | null
          updated_at?: string
        }
        Update: {
          average_session_duration?: number | null
          bounce_rate?: number | null
          created_at?: string
          date?: string
          id?: string
          peak_concurrent_listeners?: number | null
          total_listening_time?: number | null
          total_page_views?: number | null
          total_sessions?: number | null
          total_unique_visitors?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      analytics_listening_events: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          duration_before_event: number | null
          event_type: string
          id: string
          ip_address: unknown | null
          session_id: string
          show_name: string | null
          station_name: string | null
          timestamp: string
          user_agent: string | null
          volume_level: number | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_before_event?: number | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          session_id: string
          show_name?: string | null
          station_name?: string | null
          timestamp?: string
          user_agent?: string | null
          volume_level?: number | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_before_event?: number | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string
          show_name?: string | null
          station_name?: string | null
          timestamp?: string
          user_agent?: string | null
          volume_level?: number | null
        }
        Relationships: []
      }
      analytics_sessions: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_type: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          ip_address: unknown | null
          os: string | null
          page_url: string
          referrer: string | null
          session_id: string
          started_at: string
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          os?: string | null
          page_url: string
          referrer?: string | null
          session_id: string
          started_at?: string
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          ip_address?: unknown | null
          os?: string | null
          page_url?: string
          referrer?: string | null
          session_id?: string
          started_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      analytics_show_stats: {
        Row: {
          average_session_duration: number | null
          created_at: string
          date: string
          id: string
          peak_concurrent_listeners: number | null
          show_name: string
          total_listeners: number | null
          total_listening_time: number | null
          updated_at: string
        }
        Insert: {
          average_session_duration?: number | null
          created_at?: string
          date?: string
          id?: string
          peak_concurrent_listeners?: number | null
          show_name: string
          total_listeners?: number | null
          total_listening_time?: number | null
          updated_at?: string
        }
        Update: {
          average_session_duration?: number | null
          created_at?: string
          date?: string
          id?: string
          peak_concurrent_listeners?: number | null
          show_name?: string
          total_listeners?: number | null
          total_listening_time?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          active: boolean | null
          category: string | null
          content: string
          created_at: string | null
          date: string
          id: string
          important: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          content: string
          created_at?: string | null
          date: string
          id?: string
          important?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          content?: string
          created_at?: string | null
          date?: string
          id?: string
          important?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          active: boolean | null
          created_at: string | null
          cta_text: string | null
          display_order: number | null
          id: string
          media_type: string
          media_url: string
          subtitle: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          cta_text?: string | null
          display_order?: number | null
          id?: string
          media_type: string
          media_url: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          cta_text?: string | null
          display_order?: number | null
          id?: string
          media_type?: string
          media_url?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published: boolean | null
          published_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          provider: string | null
          status: string | null
          user_avatar: string | null
          user_email: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          provider?: string | null
          status?: string | null
          user_avatar?: string | null
          user_email: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          provider?: string | null
          status?: string | null
          user_avatar?: string | null
          user_email?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: []
      }
      content_interactions: {
        Row: {
          city: string | null
          content_id: string
          content_type: string
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          interaction_type: string
          ip_address: unknown | null
          session_id: string
          user_agent: string | null
        }
        Insert: {
          city?: string | null
          content_id: string
          content_type: string
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          interaction_type: string
          ip_address?: unknown | null
          session_id: string
          user_agent?: string | null
        }
        Update: {
          city?: string | null
          content_id?: string
          content_type?: string
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          interaction_type?: string
          ip_address?: unknown | null
          session_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          active: boolean | null
          created_at: string
          email: string
          id: string
          name: string | null
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean | null
          published_at: string | null
          slug: string
          template: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          slug: string
          template?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean | null
          published_at?: string | null
          slug?: string
          template?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      podcasts: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          duration: string | null
          episode_number: number | null
          host: string
          id: string
          image_url: string | null
          listen_url: string | null
          publish_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          episode_number?: number | null
          host: string
          id?: string
          image_url?: string | null
          listen_url?: string | null
          publish_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          episode_number?: number | null
          host?: string
          id?: string
          image_url?: string | null
          listen_url?: string | null
          publish_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recorded_shows: {
        Row: {
          audio_url: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          expires_at: string
          file_size_bytes: number | null
          id: string
          recorded_at: string
          show_id: string | null
          title: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          expires_at?: string
          file_size_bytes?: number | null
          id?: string
          recorded_at?: string
          show_id?: string | null
          title: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          expires_at?: string
          file_size_bytes?: number | null
          id?: string
          recorded_at?: string
          show_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "recorded_shows_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["id"]
          },
        ]
      }
      shows: {
        Row: {
          active: boolean | null
          created_at: string | null
          day_of_week: string | null
          description: string | null
          end_time: string
          host: string
          id: string
          image_url: string | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          day_of_week?: string | null
          description?: string | null
          end_time: string
          host: string
          id?: string
          image_url?: string | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          day_of_week?: string | null
          description?: string | null
          end_time?: string
          host?: string
          id?: string
          image_url?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      station_settings: {
        Row: {
          contact_info: Json | null
          id: number
          logo_url: string | null
          page_content: Json | null
          recording_stream_url: string | null
          social_links: Json | null
          station_description: string | null
          station_name: string
          station_tagline: string | null
          stream_url: string | null
          updated_at: string | null
        }
        Insert: {
          contact_info?: Json | null
          id?: number
          logo_url?: string | null
          page_content?: Json | null
          recording_stream_url?: string | null
          social_links?: Json | null
          station_description?: string | null
          station_name?: string
          station_tagline?: string | null
          stream_url?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_info?: Json | null
          id?: number
          logo_url?: string | null
          page_content?: Json | null
          recording_stream_url?: string | null
          social_links?: Json | null
          station_description?: string | null
          station_name?: string
          station_tagline?: string | null
          stream_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_recordings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
