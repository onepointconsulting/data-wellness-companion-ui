import { create } from "zustand";
import { Step } from "react-joyride";

export interface State {
  run: boolean;
  sidebarOpen: boolean;
  stepIndex: number;
  steps: Step[];
}

interface JoyrideState {
  initQuestionRef: boolean;
  initNavbarRef: boolean;
  setJoyrideState: (joyrideState: State) => void;
  setInitQuestionRef: () => void;
  setNavbarRef: () => void;
  joyrideState: State;
}

export const useJoyrideStore = create<JoyrideState>((set) => ({
  initQuestionRef: false,
  initNavbarRef: false,
  joyrideState: {
    run: false,
    sidebarOpen: false,
    stepIndex: 0,
    steps: [],
  },
  setInitQuestionRef: () =>
    set((state) => ({ ...state, initQuestionRef: true })),
  setNavbarRef: () => set((state) => ({ ...state, initNavbarRef: true })),
  setJoyrideState: (joyrideState: State) =>
    set((state) => ({ ...state, joyrideState })),
}));
