import { atom } from 'recoil';

import { recoilPersist } from 'recoil-persist';

// Configura la persistencia
const { persistAtom } = recoilPersist({
    key: 'recoilPersist', // key para el almacenamiento local
    storage: localStorage, // Opcionalmente, puedes cambiar a sessionStorage
});

export const userState = atom({
    key: 'userState',
    default: { isLoggedIn: false, name: '' },
    effects_UNSTABLE: [persistAtom],
});