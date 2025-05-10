
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: number;
  date: Date;
  items: CartItem[];
  total: number;
  paymentMethod: string;
}

export interface CashRegister {
  id: number;
  openedAt: Date;
  closedAt?: Date;
  initialAmount: number;
  currentAmount: number;
  isOpen: boolean;
  sales: Sale[];
  cashier: string;
}

export interface CashMovement {
  id: number;
  amount: number;
  type: 'in' | 'out';
  description: string;
  date: Date;
  cashRegisterId: number;
}
