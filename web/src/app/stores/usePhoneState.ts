import { create } from 'zustand';

interface PhoneState {
  phone: string;
  setPhone: (value: string) => void;
}

// Create a store for phone state to store the phone number
export const usePhoneStore = create<PhoneState>((set) => ({
  phone: '',
  setPhone: (value) => set({ phone: value }),
}));
