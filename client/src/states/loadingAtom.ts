import { atom } from 'recoil';

export const loadingAtom = atom({
  key: 'loadingatom', // unique ID for this atom
  default: { loading: false, abortController: null }, // initial state
});
