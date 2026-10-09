import { create } from 'zustand';

interface PlatformState {
  isPlatformConnected: boolean;
  setIsPlatformConnected: (value: boolean) => void;
}

// Create a store for platform state to store the platform connection status
export const usePlatformStore = create<PlatformState>((set) => ({
  isPlatformConnected: false,
  setIsPlatformConnected: (value) => set({ isPlatformConnected: value }),
}));
