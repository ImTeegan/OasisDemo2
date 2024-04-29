import { atom } from 'recoil';

export const isLoggedInState = atom({
    key: 'isLoggedIn',
    default: false,  // por defecto, el usuario no está logueado
});