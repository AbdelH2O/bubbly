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
      embeddings: {
        Row: {
          content: string
          embedding: unknown
          entity: string
          id: number
        }
        Insert: {
          content: string
          embedding: unknown
          entity: string
          id?: number
        }
        Update: {
          content?: string
          embedding?: unknown
          entity?: string
          id?: number
        }
      }
      info_entity: {
        Row: {
          bubble: string
          created_at: string
          data: string
          id: string
          processed: number
          tokens: number | null
          type: string
          url: string | null
        }
        Insert: {
          bubble: string
          created_at?: string
          data: string
          id?: string
          processed?: number
          tokens?: number | null
          type: string
          url?: string | null
        }
        Update: {
          bubble?: string
          created_at?: string
          data?: string
          id?: string
          processed?: number
          tokens?: number | null
          type?: string
          url?: string | null
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
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      match_documents: {
        Args: {
          query_embedding: unknown
          similarity_threshold: number
          match_count: number
        }
        Returns: {
          id: number
          content: string
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      vector_dims: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
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
