
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  originalId?: string; // ID original do Supabase
}

export interface CartItem extends Product {
  quantity: number;
  originalId: string; // Garantir que originalId sempre existe no CartItem
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  timestamp: string;
  clientName?: string;
}
