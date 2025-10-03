// src/store/locationStore.ts
import { create } from 'zustand';

interface LocationState {
  location: [number, number]; // [latitude, longitude]
  setLocation: (lat: number, lon: number) => void;
}

const useLocationStore = create<LocationState>((set) => ({
    // [24.708705,91.69615390000001] <-- sylhet
  location: [23.65, 90.35],
  setLocation: (lat, lon) => set({ location: [lat, lon] }),
}));

export default useLocationStore;
