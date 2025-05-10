
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
