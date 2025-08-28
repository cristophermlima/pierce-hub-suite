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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      aftercare_schedules: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          sale_id: string
          scheduled_at: string
          sent_at: string | null
          status: string | null
          template_id: string
          user_id: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          sale_id: string
          scheduled_at: string
          sent_at?: string | null
          status?: string | null
          template_id: string
          user_id: string
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          sale_id?: string
          scheduled_at?: string
          sent_at?: string | null
          status?: string | null
          template_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "aftercare_schedules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "aftercare_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      aftercare_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      anamnesis: {
        Row: {
          address: string | null
          alcohol: boolean | null
          allergies: string | null
          anemia: boolean | null
          anxiety: string | null
          application_location: string | null
          blood_pressure: string | null
          client_id: string
          created_at: string | null
          depression: string | null
          dermatitis: boolean | null
          diabetes: boolean | null
          drugs: boolean | null
          dst: boolean | null
          epilepsy: boolean | null
          good_meals: string | null
          heart_disease: boolean | null
          hemophilia: boolean | null
          hepatitis: boolean | null
          id: string
          jewel: string | null
          keloid: boolean | null
          meal_quality: string | null
          medication: string | null
          mental_health: string | null
          observation: string | null
          other_health_issue: string | null
          panic: string | null
          physical_activity: boolean | null
          sleep_hours: string | null
          smoke: boolean | null
          updated_at: string | null
          value: string | null
          which_medication: string | null
        }
        Insert: {
          address?: string | null
          alcohol?: boolean | null
          allergies?: string | null
          anemia?: boolean | null
          anxiety?: string | null
          application_location?: string | null
          blood_pressure?: string | null
          client_id: string
          created_at?: string | null
          depression?: string | null
          dermatitis?: boolean | null
          diabetes?: boolean | null
          drugs?: boolean | null
          dst?: boolean | null
          epilepsy?: boolean | null
          good_meals?: string | null
          heart_disease?: boolean | null
          hemophilia?: boolean | null
          hepatitis?: boolean | null
          id?: string
          jewel?: string | null
          keloid?: boolean | null
          meal_quality?: string | null
          medication?: string | null
          mental_health?: string | null
          observation?: string | null
          other_health_issue?: string | null
          panic?: string | null
          physical_activity?: boolean | null
          sleep_hours?: string | null
          smoke?: boolean | null
          updated_at?: string | null
          value?: string | null
          which_medication?: string | null
        }
        Update: {
          address?: string | null
          alcohol?: boolean | null
          allergies?: string | null
          anemia?: boolean | null
          anxiety?: string | null
          application_location?: string | null
          blood_pressure?: string | null
          client_id?: string
          created_at?: string | null
          depression?: string | null
          dermatitis?: boolean | null
          diabetes?: boolean | null
          drugs?: boolean | null
          dst?: boolean | null
          epilepsy?: boolean | null
          good_meals?: string | null
          heart_disease?: boolean | null
          hemophilia?: boolean | null
          hepatitis?: boolean | null
          id?: string
          jewel?: string | null
          keloid?: boolean | null
          meal_quality?: string | null
          medication?: string | null
          mental_health?: string | null
          observation?: string | null
          other_health_issue?: string | null
          panic?: string | null
          physical_activity?: boolean | null
          sleep_hours?: string | null
          smoke?: boolean | null
          updated_at?: string | null
          value?: string | null
          which_medication?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anamnesis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          address: string | null
          business_hours: string | null
          business_name: string
          city: string | null
          created_at: string
          description: string | null
          id: string
          state: string | null
          updated_at: string
          user_id: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          business_hours?: string | null
          business_name?: string
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          state?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          business_hours?: string | null
          business_name?: string
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          state?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      cash_registers: {
        Row: {
          cashier: string
          closed_at: string | null
          created_at: string | null
          difference: number | null
          final_amount: number | null
          id: string
          initial_amount: number
          is_open: boolean | null
          notes: string | null
          opened_at: string
          user_id: string | null
        }
        Insert: {
          cashier: string
          closed_at?: string | null
          created_at?: string | null
          difference?: number | null
          final_amount?: number | null
          id?: string
          initial_amount: number
          is_open?: boolean | null
          notes?: string | null
          opened_at?: string
          user_id?: string | null
        }
        Update: {
          cashier?: string
          closed_at?: string | null
          created_at?: string | null
          difference?: number | null
          final_amount?: number | null
          id?: string
          initial_amount?: number
          is_open?: boolean | null
          notes?: string | null
          opened_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      client_form_tokens: {
        Row: {
          client_id: string
          created_at: string
          expires_at: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          birth_date: string | null
          created_at: string | null
          email: string | null
          id: string
          last_visit: string | null
          name: string
          phone: string
          send_birthday_message: boolean | null
          send_holiday_messages: boolean | null
          updated_at: string | null
          user_id: string | null
          visits: number | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit?: string | null
          name: string
          phone: string
          send_birthday_message?: boolean | null
          send_holiday_messages?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          visits?: number | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_visit?: string | null
          name?: string
          phone?: string
          send_birthday_message?: boolean | null
          send_holiday_messages?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          visits?: number | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          brand: string | null
          category_id: string | null
          cost_price: number
          created_at: string | null
          diameter_mm: number | null
          id: string
          images: string[] | null
          is_service: boolean | null
          jewelry_material_id: string | null
          length_mm: number | null
          name: string
          price: number
          ring_closure_id: string | null
          size_mm: number | null
          sku: string | null
          stock: number
          supplier_id: string | null
          thickness_mm: number | null
          thread_specification_id: string | null
          thread_type_id: string | null
          threshold: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string | null
          diameter_mm?: number | null
          id?: string
          images?: string[] | null
          is_service?: boolean | null
          jewelry_material_id?: string | null
          length_mm?: number | null
          name: string
          price: number
          ring_closure_id?: string | null
          size_mm?: number | null
          sku?: string | null
          stock?: number
          supplier_id?: string | null
          thickness_mm?: number | null
          thread_specification_id?: string | null
          thread_type_id?: string | null
          threshold?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          category_id?: string | null
          cost_price?: number
          created_at?: string | null
          diameter_mm?: number | null
          id?: string
          images?: string[] | null
          is_service?: boolean | null
          jewelry_material_id?: string | null
          length_mm?: number | null
          name?: string
          price?: number
          ring_closure_id?: string | null
          size_mm?: number | null
          sku?: string | null
          stock?: number
          supplier_id?: string | null
          thickness_mm?: number | null
          thread_specification_id?: string | null
          thread_type_id?: string | null
          threshold?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_jewelry_material_id_fkey"
            columns: ["jewelry_material_id"]
            isOneToOne: false
            referencedRelation: "jewelry_materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_ring_closure_id_fkey"
            columns: ["ring_closure_id"]
            isOneToOne: false
            referencedRelation: "ring_closures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_thread_specification_id_fkey"
            columns: ["thread_specification_id"]
            isOneToOne: false
            referencedRelation: "thread_specifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_thread_type_id_fkey"
            columns: ["thread_type_id"]
            isOneToOne: false
            referencedRelation: "thread_types"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_custom_fields: {
        Row: {
          created_at: string | null
          field_label: string
          field_name: string
          field_type: string
          id: string
          options: Json | null
          required: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          field_label: string
          field_name: string
          field_type?: string
          id?: string
          options?: Json | null
          required?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          field_label?: string
          field_name?: string
          field_type?: string
          id?: string
          options?: Json | null
          required?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      inventory_item_custom_values: {
        Row: {
          created_at: string | null
          custom_field_id: string
          id: string
          item_id: string
          value: string | null
        }
        Insert: {
          created_at?: string | null
          custom_field_id: string
          id?: string
          item_id: string
          value?: string | null
        }
        Update: {
          created_at?: string | null
          custom_field_id?: string
          id?: string
          item_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_item_custom_values_custom_field_id_fkey"
            columns: ["custom_field_id"]
            isOneToOne: false
            referencedRelation: "inventory_custom_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_item_custom_values_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      jewelry_materials: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      loyalty_plans: {
        Row: {
          active: boolean | null
          conditions: Json | null
          created_at: string | null
          custom_reward_type: string | null
          description: string | null
          id: string
          name: string
          reward: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          conditions?: Json | null
          created_at?: string | null
          custom_reward_type?: string | null
          description?: string | null
          id?: string
          name: string
          reward?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          conditions?: Json | null
          created_at?: string | null
          custom_reward_type?: string | null
          description?: string | null
          id?: string
          name?: string
          reward?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      material_usage: {
        Row: {
          created_at: string | null
          id: string
          material_id: string
          notes: string | null
          quantity_used: number
          sale_id: string | null
          used_date: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          material_id: string
          notes?: string | null
          quantity_used: number
          sale_id?: string | null
          used_date?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          material_id?: string
          notes?: string | null
          quantity_used?: number
          sale_id?: string | null
          used_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_usage_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "sterilized_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          app_appointments: boolean | null
          app_cancellations: boolean | null
          app_client: boolean | null
          app_inventory: boolean | null
          created_at: string
          email_appointments: boolean | null
          email_inventory: boolean | null
          email_marketing: boolean | null
          email_reminders: boolean | null
          email_reports: boolean | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          app_appointments?: boolean | null
          app_cancellations?: boolean | null
          app_client?: boolean | null
          app_inventory?: boolean | null
          created_at?: string
          email_appointments?: boolean | null
          email_inventory?: boolean | null
          email_marketing?: boolean | null
          email_reminders?: boolean | null
          email_reports?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          app_appointments?: boolean | null
          app_cancellations?: boolean | null
          app_client?: boolean | null
          app_inventory?: boolean | null
          created_at?: string
          email_appointments?: boolean | null
          email_inventory?: boolean | null
          email_marketing?: boolean | null
          email_reminders?: boolean | null
          email_reports?: boolean | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      procedure_costs: {
        Row: {
          cost_per_unit: number
          created_at: string
          id: string
          material_id: string
          quantity_used: number
          sale_id: string
          total_cost: number
        }
        Insert: {
          cost_per_unit: number
          created_at?: string
          id?: string
          material_id: string
          quantity_used: number
          sale_id: string
          total_cost: number
        }
        Update: {
          cost_per_unit?: number
          created_at?: string
          id?: string
          material_id?: string
          quantity_used?: number
          sale_id?: string
          total_cost?: number
        }
        Relationships: []
      }
      procedure_materials: {
        Row: {
          created_at: string
          id: string
          name: string
          total_quantity: number
          unit_cost: number
          unit_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          total_quantity: number
          unit_cost: number
          unit_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          total_quantity?: number
          unit_cost?: number
          unit_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      ring_closures: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string | null
          id: string
          price: number
          product_id: string
          quantity: number
          sale_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          price: number
          product_id: string
          quantity?: number
          sale_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          price?: number
          product_id?: string
          quantity?: number
          sale_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          cash_register_id: string | null
          client_id: string | null
          created_at: string | null
          id: string
          payment_method: string
          procedure_notes: string | null
          total: number
          user_id: string | null
        }
        Insert: {
          cash_register_id?: string | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          payment_method: string
          procedure_notes?: string | null
          total: number
          user_id?: string | null
        }
        Update: {
          cash_register_id?: string | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          payment_method?: string
          procedure_notes?: string | null
          total?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_cash_register_id_fkey"
            columns: ["cash_register_id"]
            isOneToOne: false
            referencedRelation: "cash_registers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      sterilized_materials: {
        Row: {
          batch_number: string | null
          category: string
          created_at: string | null
          expiration_date: string
          id: string
          name: string
          notes: string | null
          quantity_sterile: number
          sterilization_date: string
          sterilization_method: string
          total_quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          batch_number?: string | null
          category?: string
          created_at?: string | null
          expiration_date: string
          id?: string
          name: string
          notes?: string | null
          quantity_sterile?: number
          sterilization_date: string
          sterilization_method: string
          total_quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          batch_number?: string | null
          category?: string
          created_at?: string | null
          expiration_date?: string
          id?: string
          name?: string
          notes?: string | null
          quantity_sterile?: number
          sterilization_date?: string
          sterilization_method?: string
          total_quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          category: string
          city: string | null
          contact_name: string
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string
          state: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          category: string
          city?: string | null
          contact_name: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          city?: string | null
          contact_name?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      thread_specifications: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      thread_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_type: string
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_type?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_has_active_access: {
        Args: { user_uuid: string }
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
