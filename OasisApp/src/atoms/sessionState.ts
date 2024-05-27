import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
    key: 'recoilPersist',
    storage: localStorage,
});

export const userState = atom({
    key: 'userState',
    default: { isLoggedIn: false, name: '', role: '' },
    effects_UNSTABLE: [persistAtom],
});