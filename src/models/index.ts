export interface IProduct {
  id?: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating?: {
    rate: number;
    count: number;
  };
  created_by?: string;
  created_at?: string;
}