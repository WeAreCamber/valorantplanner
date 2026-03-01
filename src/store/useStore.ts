
import { create } from 'zustand';
import { AppState, MapData, AgentData } from '../types';

export const useStore = create<AppState>((set) => ({
  currentStep: 0,
  selectedMap: null,
  selectedAgent: null,
  selectedSide: null,

  setMap: (map: MapData) => set({ 
    selectedMap: map, 
    currentStep: 1,
    selectedAgent: null,
    selectedSide: null
  }),

  setAgent: (agent: AgentData) => set({ 
    selectedAgent: agent, 
    currentStep: 2 
  }),

  setSide: (side: 'Attack' | 'Defence') => set({ 
    selectedSide: side, 
    currentStep: 3 
  }),

  goToStep: (step: number) => set({ currentStep: step }),

  reset: () => set({
    currentStep: 0,
    selectedMap: null,
    selectedAgent: null,
    selectedSide: null
  }),
}));
