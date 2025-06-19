
export interface SterilizedMaterial {
  id: string;
  user_id: string;
  name: string;
  category: 'kit' | 'tool' | 'other';
  quantity_sterile: number;
  total_quantity: number;
  sterilization_date: string;
  expiration_date: string;
  sterilization_method: string;
  batch_number?: string;
  notes?: string;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}

export interface SterilizedMaterialFormData {
  name: string;
  category: 'kit' | 'tool' | 'other';
  quantity_sterile: number;
  total_quantity: number;
  sterilization_date: string;
  expiration_date: string;
  sterilization_method: string;
  batch_number?: string;
  notes?: string;
}

export interface MaterialUsage {
  id: string;
  material_id: string;
  quantity_used: number;
  used_date: string;
  sale_id?: string;
  notes?: string;
}
