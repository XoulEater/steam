export interface Order {
  _id: string;
  userId: string;
  games: GameInfo[];
  total: number;
  address: string;
  paymentMethod: string;
  status: Status;
  createdAt: Date;
}

export enum Status {
  pending = 'pending',
  inPreparation = 'inPreparation',
  sent = 'sent',
  delivered = 'delivered',
}

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

// API RESPONSES

export interface PaginatedGames {
  games: Game[];
  totalPages: number;
  currentPage: number;
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
}

export interface Filters {
  categories: string[];
  price: number | null;
  developer: string | null;
  popularity: number | null;
}

export interface CartRes {
  _id: string;
  games: GameInfo[];
  total: number;
}

export interface GameInfo {
  game: Game;
  quantity: number;
  price: number;
}

export interface User {
  _id: string;
  email: string;
  password: string;
  username: string;
  image: string;
  bio: string;
}
