
export interface Supplier {
  id: string;
  name: string;
  contact_name: string;
  phone: string;
  email: string;
  category: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierFormData {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  category: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
}
