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
      company: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          ssn: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          ssn?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          ssn?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_profile: {
        Row: {
          company_id: number
          created_at: string | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_profile_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "company"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_profile_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      contact: {
        Row: {
          cell_phone: string
          created_at: string | null
          department_id: number | null
          email_address: string | null
          full_name: string
          id: number
          updated_at: string | null
        }
        Insert: {
          cell_phone: string
          created_at?: string | null
          department_id?: number | null
          email_address?: string | null
          full_name: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          cell_phone?: string
          created_at?: string | null
          department_id?: number | null
          email_address?: string | null
          full_name?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_department_id_fkey"
            columns: ["department_id"]
            referencedRelation: "department"
            referencedColumns: ["id"]
          }
        ]
      }
      department: {
        Row: {
          company_id: number | null
          created_at: string | null
          external_identifier: string | null
          id: number
          name: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: number | null
          created_at?: string | null
          external_identifier?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: number | null
          created_at?: string | null
          external_identifier?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "company"
            referencedColumns: ["id"]
          }
        ]
      }
      profile: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transaction: {
        Row: {
          amount: number
          contact_id: number
          created_at: string
          id: string
          full_text_search: string | null
        }
        Insert: {
          amount: number
          contact_id: number
          created_at?: string
          id?: string
        }
        Update: {
          amount?: number
          contact_id?: number
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_contact_id_fkey"
            columns: ["contact_id"]
            referencedRelation: "contact"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_contact_id_fkey"
            columns: ["contact_id"]
            referencedRelation: "detailed_transaction"
            referencedColumns: ["contact_id"]
          }
        ]
      }
    }
    Views: {
      detailed_transaction: {
        Row: {
          amount: number | null
          contact_email: string | null
          contact_id: number | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          department_external_id: string | null
          department_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      full_text_search: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      user_can_access_contact: {
        Args: {
          contact_id: number
        }
        Returns: boolean
      }
      user_can_access_department: {
        Args: {
          department_id: number
        }
        Returns: boolean
      }
      user_can_access_transaction: {
        Args: {
          transaction_id: string
        }
        Returns: boolean
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
