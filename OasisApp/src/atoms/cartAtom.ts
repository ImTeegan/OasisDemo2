import { Product } from '../../types/product';
import { atom } from 'recoil';

export const selectedProductsState = atom<Product[]>({
    key: 'selectedProductsState',
    default: [],
});