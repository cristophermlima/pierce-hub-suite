
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  originalId?: string; // ID original do Supabase
  is_service?: boolean; // Adicionar campo para identificar serviços
}

export interface CartItem extends Product {
  quantity: number;
  originalId: string; // Garantir que originalId sempre existe no CartItem
  category_id: string;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  payment_method: string; // Compatibilidade com banco
  timestamp: string;
  created_at: string; // Compatibilidade com banco
  date: Date;
  clientName?: string;
  client_id?: string;
  cash_register_id?: string;
  user_id?: string;
}

export interface CashRegister {
  id: string;
  openedAt: Date;
  closedAt?: Date;
  initialAmount: number;
  currentAmount: number;
  isOpen: boolean;
  sales: Sale[];
  cashier: string;
  // Campos do banco
  opened_at: string;
  closed_at?: string;
  initial_amount: number;
  final_amount?: number;
  difference?: number;
  is_open: boolean;
  notes?: string;
  user_id?: string;
}
