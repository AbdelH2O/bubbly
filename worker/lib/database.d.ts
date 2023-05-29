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
          greet_message: string
          id: string
          name: string
          owner: string | null
          ticket_email: string | null
        }
        Insert: {
          created_at?: string
          description: string
          greet_message?: string
          id?: string
          name: string
          owner?: string | null
          ticket_email?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          greet_message?: string
          id?: string
          name?: string
          owner?: string | null
          ticket_email?: string | null
        }
      }
      chat: {
        Row: {
          bubble: string
          created_at: string | null
          fingerprint: string
        }
        Insert: {
          bubble: string
          created_at?: string | null
          fingerprint: string
        }
        Update: {
          bubble?: string
          created_at?: string | null
          fingerprint?: string
        }
      }
      embeddings: {
        Row: {
          bubble: string
          content: string
          embedding: number[]
          entity: string
          id: number
        }
        Insert: {
          bubble: string
          content: string
          embedding: number[]
          entity: string
          id?: number
        }
        Update: {
          bubble?: string
          content?: string
          embedding?: number[]
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
      message: {
        Row: {
          chat: string
          content: string
          created_at: string | null
          id: number
          sender: string
        }
        Insert: {
          chat: string
          content: string
          created_at?: string | null
          id?: number
          sender?: string
        }
        Update: {
          chat?: string
          content?: string
          created_at?: string | null
          id?: number
          sender?: string
        }
      }
      ticket: {
        Row: {
          bubble: string
          created_at: string | null
          email: string
          id: number
          message: string
        }
        Insert: {
          bubble: string
          created_at?: string | null
          email: string
          id?: number
          message: string
        }
        Update: {
          bubble?: string
          created_at?: string | null
          email?: string
          id?: number
          message?: string
        }
      }
      users: {
        Row: {
          email: string | null
          id: string
          image: string | null
          max_entities: number
          max_usage: number
          name: string | null
          usage: number
        }
        Insert: {
          email?: string | null
          id: string
          image?: string | null
          max_entities?: number
          max_usage?: number
          name?: string | null
          usage?: number
        }
        Update: {
          email?: string | null
          id?: string
          image?: string | null
          max_entities?: number
          max_usage?: number
          name?: string | null
          usage?: number
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
      match_docs: {
        Args: {
          query_embedding: string
          similarity_threshold: number
          match_count: number
          bubble_id: string
        }
        Returns: {
          index: number
          content: string
          similarity: number
        }[]
      }
      match_documents:
        | {
            Args: {
              query_embedding: string
              similarity_threshold: number
              match_count: number
            }
            Returns: {
              id: number
              content: string
              similarity: number
            }[]
          }
        | {
            Args: {
              query_embedding: string
              similarity_threshold: number
              match_count: number
              bubble_id: string
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
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
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
