// src/store/locationStore.ts
import { create } from 'zustand';

interface ZoomState {
  zoom: number; // [latitude, longitude]
  setZoom: (zoom: number) => void;
}

const useZoomStore = create<ZoomState>((set) => ({
  zoom: 7,
  setZoom: (zoom) => set({ zoom }),
}));

export default useZoomStore;
