import { Product } from '../../types/product';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
    key: 'recoilPersist', // key para el almacenamiento local
    storage: localStorage, // Opcionalmente, puedes cambiar a sessionStorage
});

export const selectedProductsState = atom<Product[]>({
    key: 'selectedProductsState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});