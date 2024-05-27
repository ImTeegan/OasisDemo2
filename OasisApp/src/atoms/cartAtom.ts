import { Product } from '../../types/product';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
    key: 'recoilPersist',
    storage: sessionStorage,
});

export const selectedProductsState = atom<Product[]>({
    key: 'selectedProductsState',
    default: [],
    effects_UNSTABLE: [persistAtom],
});