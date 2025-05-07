import { Message } from "../model/message.ts";
import { createContext, useState } from "react";
import { Props } from "./commonModel.ts";
import { useNavigate } from "react-router-dom";
import { Confidence } from "../model/confidence.ts";
import { Ontology } from "../model/ontology.ts";
import useSessionHistory from "../hooks/useSessionHistory.ts";
import { FADE_IN_TIME } from "../lib/animConstants.ts";

interface AppState {
  messages: Message[];
  setMessages: (
    messages: ((prevMessages: Message[]) => Message[]) | Message[],
  ) => void;
  startSession: boolean;
  setStartSession: (startSession: boolean) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  currentMessage: number;
  setCurrentMessage: (
    currentMessage: ((prev: number) => number) | number,
  ) => void;
  selectedSuggestion?: string;
  setSelectedSuggestion: (selectedSuggestion: string) => void;
  sending: boolean;
  setSending: (sending: ((sending: boolean) => boolean) | boolean) => void;
  chatText: string;
  setChatText: (chatText: string) => void;
  readonly isLast: boolean;
  readonly isReport: boolean;
  readonly isSuggestionDeactivated: boolean;
  displayRegistrationMessage: boolean;
  setDisplayRegistrationMessage: (displayRegistrationMessage: boolean) => void;
  setCurrentMessageHistory: (currentMessageHistory: number) => void;
  updatingExpectedNodes: boolean;
  setUpdatingExpectedNodes: (updatingExpectedNodes: boolean) => void;
  clarificationClicked: boolean;
  setClarificationClicked: (clarificationClicked: boolean) => void;
  showClarification: boolean;
  setShowClarification: (showClarification: boolean) => void;
  confidence: Confidence | null;
  setConfidence: (confidence: Confidence) => void;
  updatingConfidence: boolean;
  setUpdatingConfidence: (updatingConfidence: boolean) => void;
  selectedHistoricalSession: string | null;
  setSelectedHistoricalSession: (
    selectedHistoricalSession: string | null,
  ) => void;
  ontology: Ontology;
  setOntology: (ontology: Ontology) => void;
  contentVisible: boolean;
  setContentVisible: (contentVisible: boolean) => void;
  regenerating: boolean;
  setRegenerating: (regenerating: boolean) => void;
}

export const DEFAULT_EXPECTED_NODES = 6;

function createAppState(): AppState {
  const messages: Message[] = [];

  return {
    messages,
    startSession: false,
    connected: false,
    sending: false,
    currentMessage: 0,
    chatText: "",
    setStartSession: (_) => {},
    setConnected: (_) => {},
    setMessages: (_) => {},
    setCurrentMessage: (_) => {},
    setSelectedSuggestion: (_) => {},
    setSending: (_) => {},
    setChatText: (_) => {},
    isLast: true,
    isReport: false,
    isSuggestionDeactivated: false,
    displayRegistrationMessage: false,
    setDisplayRegistrationMessage: (_) => {},
    setCurrentMessageHistory: (_) => {},
    updatingExpectedNodes: false,
    setUpdatingExpectedNodes: (_) => {},
    clarificationClicked: false,
    setClarificationClicked: (_) => {},
    showClarification: true,
    setShowClarification: (_) => {},
    confidence: null,
    setConfidence: (_) => {},
    updatingConfidence: false,
    setUpdatingConfidence: (_) => {},
    selectedHistoricalSession: null,
    setSelectedHistoricalSession: (_) => {},
    ontology: {} as Ontology,
    setOntology: (_) => {},
    contentVisible: true,
    setContentVisible: (_) => {},
    regenerating: false,
    setRegenerating: (_) => {},
  };
}

const initial = createAppState();

export const AppContext = createContext<AppState>(initial);

export const AppContextProvider = ({ children }: Props) => {
  const [connected, setConnected] = useState(false);
  const [startSession, setStartSession] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>();
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [chatText, setChatText] = useState("");
  const [displayRegistrationMessage, setDisplayRegistrationMessage] =
    useState(false);
  const [updatingExpectedNodes, setUpdatingExpectedNodes] = useState(false);
  const [clarificationClicked, setClarificationClicked] = useState(false);
  const [showClarification, setShowClarification] = useState(true);
  const [confidence, setConfidence] = useState<Confidence | null>(null);
  const [updatingConfidence, setUpdatingConfidence] = useState(false);
  const [selectedHistoricalSession, setSelectedHistoricalSession] = useState<
    string | null
  >(null);
  const [ontology, setOntology] = useState<Ontology>({
    relationships: [],
    betweenness_centrality: {},
    connected_component_importance_dict: {},
  });
  const [contentVisible, setContentVisible] = useState<boolean>(true);

  const navigate = useNavigate();

  useSessionHistory(messages);

  const isLast = currentMessage === messages.length - 1;
  const isReport =
    messages?.length > 0 && messages[messages.length - 1].final_report;

  function setCurrentMessageHistory(messageIndex: number) {
    setContentVisible(false);
    setTimeout(() => {
      setCurrentMessage(() => {
        setSending(false);
        return messageIndex;
      });
      navigate(`/${messageIndex}${location.search}`);
    }, FADE_IN_TIME);
  }

  const isSuggestionDeactivated = isReport || sending || !isLast;

  return (
    <AppContext.Provider
      value={{
        ...initial,
        connected,
        setConnected,
        startSession,
        setStartSession,
        messages,
        setMessages,
        currentMessage,
        setCurrentMessage,
        selectedSuggestion,
        setSelectedSuggestion,
        sending,
        setSending,
        chatText,
        setChatText,
        isLast,
        isReport,
        isSuggestionDeactivated,
        displayRegistrationMessage,
        setDisplayRegistrationMessage,
        setCurrentMessageHistory,
        updatingExpectedNodes,
        setUpdatingExpectedNodes,
        clarificationClicked,
        setClarificationClicked,
        showClarification,
        setShowClarification,
        confidence,
        setConfidence,
        updatingConfidence,
        setUpdatingConfidence,
        selectedHistoricalSession,
        setSelectedHistoricalSession,
        ontology,
        setOntology,
        contentVisible,
        setContentVisible,
        regenerating,
        setRegenerating,
      }}
    >
      {" "}
      {children}{" "}
    </AppContext.Provider>
  );
};
