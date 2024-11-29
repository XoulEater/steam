export interface Discount {
  type: string;
  value?: number;
  until?: Date;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  postDate: Date;
}

export interface Specs {
  OS: string;
  Processor: string;
  Memory: string;
  Graphics: string;
  DirectX: string;
  Storage: string;
}
export interface Game {
  _id: string;
  title: string;
  description: string;
  developer: string;
  keywords: string[];
  categories: string[];
  price: number;
  specs: Specs;
  popularity: number;
  stock: number;
  images: string[];
  discount: Discount;
  reviews: Review[];
  releaseDate: string;
    sales: number;
  }

export interface Order {
  _id: string;
  total: number;
}