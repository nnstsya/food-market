export interface Product {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  rating?: number;
  price: number;
}

export interface ProductItem {
  id: string;
  title: string;
}
