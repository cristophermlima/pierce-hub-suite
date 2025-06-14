
import { Database } from "@/integrations/supabase/types";

export interface InventoryItem {
  id: string;
  name: string;
  category_id: string | null;
  stock: number;
  price: number;
  cost_price: number;
  threshold: number;
  is_service: boolean;
  category_name?: string;
  sku?: string;
  brand?: string;
  supplier_id?: string;
  jewelry_material_id?: string;
  thread_type_id?: string;
  thickness_mm?: number;
  length_mm?: number;
  diameter_mm?: number;
  size_mm?: number;
  thread_specification_id?: string;
  ring_closure_id?: string;
  images?: string[];
  jewelry_material_name?: string;
  thread_type_name?: string;
  thread_specification_name?: string;
  ring_closure_name?: string;
  supplier_name?: string;
}

export interface Category {
  id: string;
  name: string;
  type?: string;
  description?: string;
}

export interface JewelryMaterial {
  id: string;
  name: string;
  description?: string;
}

export interface ThreadType {
  id: string;
  name: string;
  description?: string;
}

export interface ThreadSpecification {
  id: string;
  name: string;
  description?: string;
}

export interface RingClosure {
  id: string;
  name: string;
  description?: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface InventoryMutationData {
  name: string;
  category_id: string | null;
  price: number;
  cost_price: number;
  stock: number;
  threshold: number;
  is_service: boolean;
  sku?: string;
  brand?: string;
  supplier_id?: string;
  jewelry_material_id?: string;
  thread_type_id?: string;
  thickness_mm?: number;
  length_mm?: number;
  diameter_mm?: number;
  size_mm?: number;
  thread_specification_id?: string;
  ring_closure_id?: string;
  images?: string[];
}

export type InventoryItemInsert = Database["public"]["Tables"]["inventory"]["Insert"];
export type InventoryItemUpdate = Database["public"]["Tables"]["inventory"]["Update"];
