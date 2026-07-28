export type ProductCategory =
  | "earbuds"
  | "headphones"
  | "speaker"
  | "watch"
  | "dock"
  | "powerbank";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  code: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  price: number;
  colorway: string;
  specs: ProductSpec[];
  materials: string[];
}

export interface CartLine {
  product: Product;
  quantity: number;
}
