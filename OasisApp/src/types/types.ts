export interface Product {
  id: number;
  productName: string;
  category: string;
  price: number;
  image1: string;
  image2: string;
  image3: string;
  description: string;
}

export interface CustomItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  type: string;
  category: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

