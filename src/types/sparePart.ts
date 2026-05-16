export interface SparePart {
  id: string;
  name: string;
  category: string;
  carMake: string;
  carModel: string;
  carYear: string;
  condition: 'new' | 'tokunbo';
  price: number;
  stockQuantity: number;
  imageUrl: string;
  description: string;
  createdAt: string;
}
