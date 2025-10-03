// src/store/layerStore.ts
import { create } from 'zustand';

interface LayersState {
  layers: {
    flood_water_body_layer: boolean;
    isolated_places_layer: boolean;
    safe_locations_layer: boolean;
    roads_layer: boolean;
    flooded_roads_layer: boolean;
  };
  toggleLayer: (layerName: keyof LayersState['layers']) => void;
  setLayer: (layerName: keyof LayersState['layers'], value: boolean) => void;
}

const useLayerStore = create<LayersState>((set) => ({
  layers: {
    flood_water_body_layer: false,
    isolated_places_layer: false,
    safe_locations_layer: false,
    roads_layer: false,
    flooded_roads_layer: false,
  },
  toggleLayer: (layerName) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [layerName]: !state.layers[layerName],
      },
    })),
  setLayer: (layerName, value) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [layerName]: value,
      },
    })),
}));

export default useLayerStore;
