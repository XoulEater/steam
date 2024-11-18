export interface Order {
  id: string;
  games: Game[];
  price: number;
  orderAddress: string;
  date: Date;
  status: Status;
  idPaymentMethod: string;
}

export enum Status {
  pending = 'pending',
  inPreparation = 'inPreparation',
  sent = 'sent',
  delivered = 'delivered',
}

export interface Game {
  id: string;
  title: string;
  description: string;
  developer: string;
  keywords: string[];
  categories: Category[];
  price: number;
  specs: Specs;
  popularity: number;
  stock: number;
  images: string[];
  discount: Discount;
  reviews: Review[];
  releaseDate: string;
}

export enum Category {
  Action = 'Action',
  Adventure = 'Adventure',
  AnimationModeling = 'Animation & Modeling',
  Casual = 'Casual',
  DesignIllustration = 'Design & Illustration',
  EarlyAccess = 'Early Access',
  FreeToPlay = 'Free to Play',
  Indie = 'Indie',
  MassivelyMultiplayer = 'Massively Multiplayer',
  RPG = 'RPG',
  Racing = 'Racing',
  Simulation = 'Simulation',
  Sports = 'Sports',
  Strategy = 'Strategy',
  Utilities = 'Utilities',
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
