import { create } from 'zustand';
import { Map as LeafletMap } from 'leaflet';

type MapStore = {
  map: LeafletMap | null;
  setMap: (map: LeafletMap) => void;
};

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (map) => set({ map }),
}));