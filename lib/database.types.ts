export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      bubble: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          owner: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          owner?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          owner?: string | null
        }
      }
      info_entity: {
        Row: {
          bubble: string
          created_at: string
          data: string
          id: string
          processed: number
          type: string
        }
        Insert: {
          bubble: string
          created_at?: string
          data: string
          id?: string
          processed?: number
          type: string
        }
        Update: {
          bubble?: string
          created_at?: string
          data?: string
          id?: string
          processed?: number
          type?: string
        }
      }
      users: {
        Row: {
          email: string | null
          id: string
          image: string | null
          name: string | null
        }
        Insert: {
          email?: string | null
          id: string
          image?: string | null
          name?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          image?: string | null
          name?: string | null
        }
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
