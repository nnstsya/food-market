export interface Product {
  id: number;
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
  deliveryAria: string;
  maxKgs: number;
  description: string;
  rate?: number;
  tax: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  title: string;
}
