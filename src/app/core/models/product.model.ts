export interface Product {
  id: string;
  name: string;
  image: string[];
  price: number;
  SKU: string;
  category: string;
  subcategory: string;
  farm: string;
  stoke: string;
  freshness: number;
  buyBy: string[];
  deliveryDays: number;
  deliveryCoast: number;
  deliveryAria: string;
  maxKgs: number;
  description: string;
  rate?: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCart {
  product: Product;
  quantity: number;
}

export enum BuyBy {
  Weight = 'kgs',
  Piece = 'pcs',
  Box = 'box',
  Pack = 'pack',
  Bag = 'pack',
  Bunch = 'pack',
  Bottle = 'pack',
  Carton = 'pack',
  Jar = 'pack'
}
