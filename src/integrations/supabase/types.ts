export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_email_allowlist: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      announcement_banners: {
        Row: {
          background_color: string | null
          created_at: string
          ends_at: string | null
          id: string
          is_active: boolean
          link_label: string | null
          link_url: string | null
          message: string
          sort_order: number
          starts_at: string | null
          text_color: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          link_label?: string | null
          link_url?: string | null
          message: string
          sort_order?: number
          starts_at?: string | null
          text_color?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          created_at?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          link_label?: string | null
          link_url?: string | null
          message?: string
          sort_order?: number
          starts_at?: string | null
          text_color?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      brochure_requests: {
        Row: {
          company: string
          created_at: string
          email: string
          first_name: string
          id: string
          intended_use: string | null
          job_title: string | null
          last_name: string
          phone: string
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          intended_use?: string | null
          job_title?: string | null
          last_name: string
          phone: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          intended_use?: string | null
          job_title?: string | null
          last_name?: string
          phone?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          details: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          products: string[]
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          details?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone: string
          products?: string[]
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          details?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          products?: string[]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      distributor_applications: {
        Row: {
          business_address: string
          business_name: string
          business_phone: string
          company_profile: string
          contact_email: string
          contact_name: string
          contact_phone: string
          contact_title: string
          created_at: string
          employees: string
          id: string
          linkedin: string | null
          markets: string[]
          status: string
          territory: string
          updated_at: string
          us_confirmed: boolean
          website: string | null
          year_established: string
        }
        Insert: {
          business_address: string
          business_name: string
          business_phone: string
          company_profile: string
          contact_email: string
          contact_name: string
          contact_phone: string
          contact_title: string
          created_at?: string
          employees: string
          id?: string
          linkedin?: string | null
          markets?: string[]
          status?: string
          territory: string
          updated_at?: string
          us_confirmed?: boolean
          website?: string | null
          year_established: string
        }
        Update: {
          business_address?: string
          business_name?: string
          business_phone?: string
          company_profile?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          contact_title?: string
          created_at?: string
          employees?: string
          id?: string
          linkedin?: string | null
          markets?: string[]
          status?: string
          territory?: string
          updated_at?: string
          us_confirmed?: boolean
          website?: string | null
          year_established?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          created_at: string
          cta_label: string | null
          cta_url: string | null
          id: string
          image_url: string | null
          is_active: boolean
          secondary_cta_label: string | null
          secondary_cta_url: string | null
          sort_order: number
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          sort_order?: number
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          created_at: string
          id: string
          is_visible: boolean
          label: string
          location: string
          opens_new_tab: boolean
          page_id: string | null
          parent_id: string | null
          sort_order: number
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label: string
          location?: string
          opens_new_tab?: boolean
          page_id?: string | null
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_visible?: boolean
          label?: string
          location?: string
          opens_new_tab?: boolean
          page_id?: string | null
          parent_id?: string | null
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nav_items_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nav_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nav_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          author_id: string | null
          blocks: Json
          created_at: string
          id: string
          og_image_url: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          blocks?: Json
          created_at?: string
          id?: string
          og_image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["page_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          blocks?: Json
          created_at?: string
          id?: string
          og_image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["page_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          ai_uses: number
          author_id: string | null
          body: string | null
          created_at: string
          excerpt: string | null
          external_url: string | null
          featured_image_url: string | null
          id: string
          pdf_url: string | null
          published_at: string | null
          scheduled_at: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"]
          title: string
          type: Database["public"]["Enums"]["post_type"]
          updated_at: string
          video_url: string | null
        }
        Insert: {
          ai_uses?: number
          author_id?: string | null
          body?: string | null
          created_at?: string
          excerpt?: string | null
          external_url?: string | null
          featured_image_url?: string | null
          id?: string
          pdf_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          type: Database["public"]["Enums"]["post_type"]
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          ai_uses?: number
          author_id?: string | null
          body?: string | null
          created_at?: string
          excerpt?: string | null
          external_url?: string | null
          featured_image_url?: string | null
          id?: string
          pdf_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          type?: Database["public"]["Enums"]["post_type"]
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      consume_ai_use: {
        Args: { p_limit?: number; p_post_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      publish_due_posts: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
      page_status: "draft" | "published"
      post_status: "draft" | "published" | "scheduled"
      post_type: "article" | "news" | "video" | "publication"
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
    Enums: {
      app_role: ["admin", "user"],
      page_status: ["draft", "published"],
      post_status: ["draft", "published", "scheduled"],
      post_type: ["article", "news", "video", "publication"],
    },
  },
} as const
