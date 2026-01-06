import { create } from "zustand";
import { DEFAULT_EXPECTED_NODES } from "./AppContext.tsx";
import { ConsultantRating } from "../model/consultantRating.ts";
import { DeepResearchOutput, DeepResearchOutputMap, DeepResearchOutputs, DeepResearchStatus } from "../model/deep-research.ts";
import onCloseDialogue, { showDialogue } from "../lib/dialogFunctions.ts";
import { DEEP_RESEARCH_DIALOGUE_ID } from "../components/dialogue/DeepResearchDialogue.tsx";

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
  updatingSuggestedConsultants: boolean;
  setUpdatingSuggestedConsultants: (
    updatingSuggestedConsultants: boolean,
  ) => void;
  suggestedConsultantsError: string;
  setSuggestedConsultantsError: (suggestedConsultantsError: string) => void;
  consultantRatings: ConsultantRating[];
  setConsultantRatings: (consultantRatings: ConsultantRating[]) => void;
  showConsultantRatings: boolean;
  setShowConsultantRatings: (showConsultantRatings: boolean) => void;
  deepResearchStarted: boolean;
  setDeepResearchStarted: (deepResearchStarted: boolean) => void;
  deepResearchStatus: DeepResearchStatus;
  setDeepResearchStatus: (deepResearchStatus: DeepResearchStatus) => void;
  deepResearchOutputMap: DeepResearchOutputMap;
  setDeepResearchOutputMap: (deepResearchOutputMap: DeepResearchOutputMap) => void;
  completedDeepResearchOutput: DeepResearchOutput | null;
  setCompletedDeepResearchOutput: (completedDeepResearchOutput: DeepResearchOutput | null) => void;
  selectedDeepResearchOutput: DeepResearchOutput | null;
  setSelectedDeepResearchOutput: (selectedDeepResearchOutput: DeepResearchOutput | null) => void;
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
    set((state) => {
      return { ...state, expectedNodes };
    }),
  updatingSuggestedConsultants: false,
  setUpdatingSuggestedConsultants: (updatingSuggestedConsultants: boolean) =>
    set((state) => ({ ...state, updatingSuggestedConsultants })),
  suggestedConsultantsError: "",
  setSuggestedConsultantsError: (suggestedConsultantsError: string) =>
    set((state) => ({ ...state, suggestedConsultantsError })),
  consultantRatings: [],
  setConsultantRatings: (consultantRatings: ConsultantRating[]) =>
    set((state) => ({
      ...state,
      consultantRatings,
      showConsultantRatings: consultantRatings?.length > 0,
    })),
  showConsultantRatings: false,
  setShowConsultantRatings: (showConsultantRatings: boolean) =>
    set((state) => ({ ...state, showConsultantRatings })),
  deepResearchStarted: false,
  setDeepResearchStarted: (deepResearchStarted: boolean) =>
    set((state) => ({ ...state, deepResearchStarted })),
  deepResearchStatus: { status: "", advice: "", timestamp: "" },
  setDeepResearchStatus: (deepResearchStatus: DeepResearchStatus) =>
    set((state) => ({ ...state, deepResearchStatus, deepResearchStarted: true })),
  deepResearchOutputMap: { },
  setDeepResearchOutputMap: (deepResearchOutputMap: DeepResearchOutputMap) =>
    set((state) => ({ ...state, deepResearchOutputMap: deepResearchOutputMap })),
  completedDeepResearchOutput: null,
  setCompletedDeepResearchOutput: (completedDeepResearchOutput: DeepResearchOutput | null) =>
    set((state) => ({ ...state, completedDeepResearchOutput, deepResearchStarted: false })),
  selectedDeepResearchOutput: null,
  setSelectedDeepResearchOutput: (selectedDeepResearchOutput: DeepResearchOutput | null) =>
    set((state) => {
      if (!selectedDeepResearchOutput) {
        onCloseDialogue(DEEP_RESEARCH_DIALOGUE_ID);
      } else {
        showDialogue(DEEP_RESEARCH_DIALOGUE_ID);
      }
      return { ...state, selectedDeepResearchOutput }
    }),
}));

export function isDisplayReportGenerationMessage(
  currentMessage: number,
  expectedNodes: number,
  generatingReport: boolean,
  regenerating: boolean,
) {
  return (
    (!regenerating && currentMessage === expectedNodes - 1) || generatingReport
  );
}
