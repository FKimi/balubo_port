export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          bio: string | null
          website_url: string | null
          profile_image_url: string | null
          subscription_tier: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name?: string | null
          bio?: string | null
          website_url?: string | null
          profile_image_url?: string | null
          subscription_tier?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          bio?: string | null
          website_url?: string | null
          profile_image_url?: string | null
          subscription_tier?: number
          created_at?: string | null
          updated_at?: string | null
        }
      }
      works: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          source_url: string
          thumbnail_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          source_url: string
          thumbnail_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          source_url?: string
          thumbnail_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          created_at?: string | null
        }
      }
      work_tags: {
        Row: {
          work_id: string
          tag_id: string
          created_at: string | null
        }
        Insert: {
          work_id: string
          tag_id: string
          created_at?: string | null
        }
        Update: {
          work_id?: string
          tag_id?: string
          created_at?: string | null
        }
      }
      ai_analyses: {
        Row: {
          id: string
          work_id: string
          expertise: Json
          content_style: Json
          interests: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          work_id: string
          expertise: Json
          content_style: Json
          interests: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          work_id?: string
          expertise?: Json
          content_style?: Json
          interests?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_analyses: {
        Row: {
          id: string
          user_id: string
          expertise_summary: Json
          style_summary: Json
          interests_summary: Json
          talent_score: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          expertise_summary: Json
          style_summary: Json
          interests_summary: Json
          talent_score: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          expertise_summary?: Json
          style_summary?: Json
          interests_summary?: Json
          talent_score?: Json
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}