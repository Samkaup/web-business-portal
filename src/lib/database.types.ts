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
          address: string | null
          address_2: string | null
          city: string | null
          created_at: string | null
          credit_limit_amount: number | null
          external_identifier: string
          name: string | null
          post_code: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          address_2?: string | null
          city?: string | null
          created_at?: string | null
          credit_limit_amount?: number | null
          external_identifier: string
          name?: string | null
          post_code?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          address_2?: string | null
          city?: string | null
          created_at?: string | null
          credit_limit_amount?: number | null
          external_identifier?: string
          name?: string | null
          post_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_profile: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_profile_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["external_identifier"]
          },
          {
            foreignKeyName: "company_profile_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          }
        ]
      }
      contact: {
        Row: {
          cell_phone: string | null
          closed: boolean | null
          closed_at: string | null
          created_at: string | null
          department_id: string | null
          email_address: string | null
          external_identifier: string
          full_name: string | null
          main_contact: boolean | null
          updated_at: string | null
        }
        Insert: {
          cell_phone?: string | null
          closed?: boolean | null
          closed_at?: string | null
          created_at?: string | null
          department_id?: string | null
          email_address?: string | null
          external_identifier: string
          full_name?: string | null
          main_contact?: boolean | null
          updated_at?: string | null
        }
        Update: {
          cell_phone?: string | null
          closed?: boolean | null
          closed_at?: string | null
          created_at?: string | null
          department_id?: string | null
          email_address?: string | null
          external_identifier?: string
          full_name?: string | null
          main_contact?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "department"
            referencedColumns: ["external_identifier"]
          }
        ]
      }
      department: {
        Row: {
          closed: boolean | null
          company_id: string | null
          created_at: string | null
          discount_scheme: string | null
          external_identifier: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          closed?: boolean | null
          company_id?: string | null
          created_at?: string | null
          discount_scheme?: string | null
          external_identifier: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          closed?: boolean | null
          company_id?: string | null
          created_at?: string | null
          discount_scheme?: string | null
          external_identifier?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "department_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company"
            referencedColumns: ["external_identifier"]
          }
        ]
      }
      profile: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          notificationSettings: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          notificationSettings?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          notificationSettings?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      store: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          id: number
          name: string
          price_group: string
          sub_price_group: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: number
          name: string
          price_group: string
          sub_price_group?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          id?: number
          name?: string
          price_group?: string
          sub_price_group?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      transaction: {
        Row: {
          account_number: string | null
          amount_credit: number | null
          amount_debit: number | null
          closed_date: string | null
          created_at: string
          date: string | null
          description: string | null
          due_date: string | null
          edi_reference: number | null
          external_row_number: number
          id: string
          invoice_number: number
          invoice_reference: string | null
          journal_number: string
          sales_number: number
          statement_date: string | null
          store_number: number | null
          transaction_type: number | null
          vat: number | null
          full_text_search: string | null
        }
        Insert: {
          account_number?: string | null
          amount_credit?: number | null
          amount_debit?: number | null
          closed_date?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          due_date?: string | null
          edi_reference?: number | null
          external_row_number: number
          id?: string
          invoice_number: number
          invoice_reference?: string | null
          journal_number: string
          sales_number: number
          statement_date?: string | null
          store_number?: number | null
          transaction_type?: number | null
          vat?: number | null
        }
        Update: {
          account_number?: string | null
          amount_credit?: number | null
          amount_debit?: number | null
          closed_date?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          due_date?: string | null
          edi_reference?: number | null
          external_row_number?: number
          id?: string
          invoice_number?: number
          invoice_reference?: string | null
          journal_number?: string
          sales_number?: number
          statement_date?: string | null
          store_number?: number | null
          transaction_type?: number | null
          vat?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_account_number_fkey"
            columns: ["account_number"]
            isOneToOne: false
            referencedRelation: "department"
            referencedColumns: ["external_identifier"]
          },
          {
            foreignKeyName: "transaction_store_number_fkey"
            columns: ["store_number"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          }
        ]
      }
      transaction_line: {
        Row: {
          cost_value: number
          created_at: string
          description: string
          discount_amount: number
          discount_percent: number
          id: string
          invoice_number: number
          line_amount: number
          quantity: number
          rownumber: number
          sales_number: number
          sales_price: number
          sku: string
          vat_code: string
          vat_factor: number
        }
        Insert: {
          cost_value: number
          created_at?: string
          description: string
          discount_amount: number
          discount_percent: number
          id?: string
          invoice_number: number
          line_amount: number
          quantity: number
          rownumber: number
          sales_number: number
          sales_price: number
          sku: string
          vat_code: string
          vat_factor: number
        }
        Update: {
          cost_value?: number
          created_at?: string
          description?: string
          discount_amount?: number
          discount_percent?: number
          id?: string
          invoice_number?: number
          line_amount?: number
          quantity?: number
          rownumber?: number
          sales_number?: number
          sales_price?: number
          sku?: string
          vat_code?: string
          vat_factor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_invoice_sales"
            columns: ["invoice_number", "sales_number"]
            isOneToOne: false
            referencedRelation: "transaction"
            referencedColumns: ["invoice_number", "sales_number"]
          }
        ]
      }
    }
    Views: {
      max_rowcounter_transaction: {
        Row: {
          max: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      full_text_search: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
      user_can_access_company: {
        Args: {
          external_identifier: string
        }
        Returns: boolean
      }
      user_can_access_contact: {
        Args: {
          contact_id: number
        }
        Returns: boolean
      }
      user_can_access_department: {
        Args: {
          department_id: string
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
