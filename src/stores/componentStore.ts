/**
 * Zustand store for component list and realtime updates.
 */
import type { ComponentItem } from '@/types';
import { create } from 'zustand';

interface ComponentState {
  components: ComponentItem[];
  selectedComponentId?: string;
  setComponents: (components: ComponentItem[]) => void;
  setSelectedComponentId: (componentId?: string) => void;
  patchComponent: (componentId: string, patch: Partial<ComponentItem>) => void;
}

export const useComponentStore = create<ComponentState>((set) => ({
  components: [],
  selectedComponentId: undefined,
  setComponents: (components) => set({ components }),
  setSelectedComponentId: (selectedComponentId) => set({ selectedComponentId }),
  patchComponent: (componentId, patch) =>
    set((state) => ({
      components: state.components.map((item) =>
        item.componentId === componentId ? { ...item, ...patch, lastUpdate: new Date().toISOString() } : item,
      ),
    })),
}));
