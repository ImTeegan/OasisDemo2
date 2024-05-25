// src/atoms/customProductAtom.ts
import { atom } from 'recoil';

export const customProductIdState = atom<number | null>({
    key: 'customProductIdState',
    default: null,
});
