// src/services/fetchProducts.ts
import axios from 'axios';
import { Product } from '../types/types';
import { CustomItem } from '../types/types';
import { WrappingPaper } from '../types/types';
import { Follaje } from '../types/types';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>('/data/products.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};


export const fetchCustomItems = async (): Promise<CustomItem[]> => {
  try {
    const response = await axios.get<CustomItem[]>('/data/customItems.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching flowers:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get('/data/users.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};




