
import { Database } from "@/integrations/supabase/types";

export interface InventoryItem {
  id: string;
  name: string;
  category_id: string | null;
  stock: number;
  price: number;
  threshold: number;
  is_service: boolean;
  category_name?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface InventoryMutationData {
  name: string;
  category_id: string | null;
  price: number;
  stock: number;
  threshold: number;
  is_service: boolean;
}

export type InventoryItemInsert = Database["public"]["Tables"]["inventory"]["Insert"];
export type InventoryItemUpdate = Database["public"]["Tables"]["inventory"]["Update"];
