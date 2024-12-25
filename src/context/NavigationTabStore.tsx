import { create } from "zustand";

export interface NavigationTabState {
  visible: boolean;
  activeTab: number;
  setVisible: (visible: boolean) => void;
  setActiveTab: (activeTab: number) => void;
}

export const useNavigationTabStore = create<NavigationTabState>((set) => ({
  visible: false,
  activeTab: 0,
  setVisible: (visible: boolean) =>
    set((state) => ({ ...state, visible, activeTab: 0 })),
  setActiveTab: (activeTab: number) =>
    set((state) => ({ ...state, activeTab })),
}));
