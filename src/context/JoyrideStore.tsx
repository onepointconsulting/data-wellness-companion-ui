import { create } from 'zustand'
import {Step} from "react-joyride";

export interface State {
    run: boolean;
    sidebarOpen: boolean;
    stepIndex: number;
    steps: Step[];
}

interface JoyrideState {
    initChatInputRef: boolean;
    initQuestionRef: boolean;
    initNavbarRef: boolean;
    setInitChatInputRef: () => void;
    setJoyrideState: (joyrideState: State) => void;
    setInitQuestionRef: () => void;
    setNavbarRef: () => void,
    joyrideState: State;
}

export const useJoyrideStore = create<JoyrideState>((set) => ({
    initChatInputRef: false,
    initQuestionRef: false,
    initNavbarRef: false,
    joyrideState: {
        run: false,
        sidebarOpen: false,
        stepIndex: 0,
        steps: [],
    },
    setInitChatInputRef: () => set((state) => ({...state, initChatInputRef: true})),
    setInitQuestionRef: () => set((state) => ({...state, initQuestionRef: true})),
    setNavbarRef: () => set((state) => ({...state, initNavbarRef: true})),
    setJoyrideState: (joyrideState: State) => set((state) => ({...state, joyrideState}))
}))