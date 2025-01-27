import { create } from "zustand";
import { DEFAULT_EXPECTED_NODES } from "./AppContext.tsx";

const DEFAULT_MESSAGE_LOWER_LIMIT = 6;
const DEFAULT_MESSAGE_UPPER_LIMIT = 10;

interface AppStoreState {
  ontologyOpen: boolean;
  setOntologyOpen: (ontologyOpen: boolean) => void;
  generatingReport: boolean;
  setGeneratingReport: (generatingReport: boolean) => void;
  seenIntro: boolean;
  setSeenIntro: (seenIntro: boolean) => void;
  messageLowerLimit: number;
  setMessageLowerLimit: (messageLowerLimit: number) => void;
  messageUpperLimit: number;
  setMessageUpperLimit: (messageUpperLimit: number) => void;
  displayConfidenceLevelProceedWarning: boolean;
  setDisplayConfidenceLevelProceedWarning: (
    displayConfidenceLevelProceedWarning: boolean,
  ) => void;
  displayedConfidenceLevelProceedWarning: boolean;
  setDisplayedConfidenceLevelProceedWarning: (
    displayedConfidenceLevelProceedWarning: boolean,
  ) => void;
  showCompletionPopup: boolean;
  setShowCompletionPopup: (seenCompletionPopup: boolean) => void;
  expectedNodes: number;
  setExpectedNodes: (expectedNodes: number) => void;
  voiceOn: boolean;
  setVoiceOn: (seenCompletionPopup: boolean) => void;
  voiceListening: boolean;
  setVoiceListening: (seenCompletionPopup: boolean) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  ontologyOpen: false,
  setOntologyOpen: (ontologyOpen: boolean) =>
    set((state) => ({ ...state, ontologyOpen })),
  generatingReport: false,
  setGeneratingReport: (generatingReport: boolean) =>
    set((state) => ({ ...state, generatingReport })),
  seenIntro: true,
  setSeenIntro: (seenIntro: boolean) =>
    set((state) => ({ ...state, seenIntro })),
  messageLowerLimit: DEFAULT_MESSAGE_LOWER_LIMIT,
  setMessageLowerLimit: (messageLowerLimit: number) =>
    set((state) => ({
      ...state,
      messageLowerLimit,
    })),
  messageUpperLimit: DEFAULT_MESSAGE_UPPER_LIMIT,
  setMessageUpperLimit: (messageUpperLimit: number) =>
    set((state) => ({
      ...state,
      messageUpperLimit,
    })),
  displayConfidenceLevelProceedWarning: false,
  setDisplayConfidenceLevelProceedWarning: (
    displayConfidenceLevelProceedWarning,
  ) =>
    set((state) => ({
      ...state,
      displayConfidenceLevelProceedWarning,
    })),
  displayedConfidenceLevelProceedWarning: false,
  setDisplayedConfidenceLevelProceedWarning: (
    displayedConfidenceLevelProceedWarning,
  ) =>
    set((state) => ({
      ...state,
      displayedConfidenceLevelProceedWarning,
    })),
  showCompletionPopup: false,
  setShowCompletionPopup: (showCompletionPopup) =>
    set((state) => ({
      ...state,
      showCompletionPopup,
    })),
  expectedNodes: DEFAULT_EXPECTED_NODES,
  setExpectedNodes: (expectedNodes: number) =>
    set((state) => ({ ...state, expectedNodes })),
  voiceOn: false,
  setVoiceOn: (voiceOn: boolean) => set((state) => ({ ...state, voiceOn })),
  voiceListening: false,
  setVoiceListening: (voiceListening: boolean) =>
    set((state) => ({ ...state, voiceListening })),
}));

export function isDisplayReportGenerationMessage(
  currentMessage: number,
  expectedNodes: number,
  generatingReport: boolean,
) {
  return currentMessage === expectedNodes - 1 || generatingReport;
}
