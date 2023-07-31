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
          }
        ]
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
