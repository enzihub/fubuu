import { create } from 'zustand';

interface AboutState {
  description: string;
  setDescription: (value: string) => void;
}

// Create a store for phone state to store the phone number
export const useAboutStore = create<AboutState>((set) => ({
  description: '',
  setDescription: (value) => set({ description: value }),
}));
