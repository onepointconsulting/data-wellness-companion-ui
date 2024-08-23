import { Message } from "../model/message.ts";
import { createContext, useEffect, useState } from "react";
import { Props } from "./commonModel.ts";
import { useNavigate } from "react-router-dom";
import { Confidence } from "../model/confidence.ts";
import { Ontology } from "../model/ontology.ts";
import { getSeenIntro, hasSeenIntro } from "../lib/sessionFunctions.ts";

interface AppState {
  expectedNodes: number;
  setExpectedNodes: (expectedNodes: number) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  startSession: boolean;
  setStartSession: (startSession: boolean) => void;
  connected: boolean;
  setConnected: (connected: boolean) => void;
  currentMessage: number;
  setCurrentMessage: (currentMessage: number) => void;
  selectedSuggestion?: string;
  setSelectedSuggestion: (selectedSuggestion: string) => void;
  sending: boolean;
  setSending: (sending: boolean) => void;
  chatText: string;
  setChatText: (chatText: string) => void;
  readonly isLast: boolean;
  readonly isBeforeReport: boolean;
  readonly isFinalMessage: boolean;
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
  ontologyOpen: boolean;
  setOntologyOpen: (ontologyOpen: boolean) => void;
  generatingReport: boolean;
  setGeneratingReport: (generatingReport: boolean) => void;
  seenIntro: boolean;
  setSeenIntro: (seenIntro: boolean) => void;
  errorMessage?: string;
  setErrorMessage: (errorMessage: string) => void;
  sessionStartTimestamp: Date,
  setSessionStartTimestamp: (sessionStartTimestamp: Date) => void;
}

export const DEFAULT_EXPECTED_NODES = 6;

function createAppState(): AppState {
  const messages: Message[] = [];
  const expectedNodes = DEFAULT_EXPECTED_NODES;

  return {
    expectedNodes,
    messages,
    startSession: false,
    connected: false,
    sending: false,
    currentMessage: 0,
    chatText: "",
    setStartSession: (_) => {},
    setConnected: (_) => {},
    setMessages: (_: Message[]) => {},
    setCurrentMessage: (_) => {},
    setSelectedSuggestion: (_) => {},
    setSending: (_) => {},
    setExpectedNodes: (_) => {},
    setChatText: (_) => {},
    isLast: true,
    isFinalMessage: false,
    isBeforeReport: false,
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
    ontologyOpen: false,
    setOntologyOpen: (_) => {},
    generatingReport: false,
    setGeneratingReport: (_) => {},
    seenIntro: false,
    setSeenIntro: (_) => {},
    errorMessage: "",
    setErrorMessage: (_) => {},
    sessionStartTimestamp: new Date(),
    setSessionStartTimestamp: (_) => {},
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
  const [expectedNodes, setExpectedNodes] = useState(DEFAULT_EXPECTED_NODES);
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
  const [generatingReport, setGeneratingReport] = useState(false);
  const [ontology, setOntology] = useState<Ontology>({
    relationships: [],
    betweenness_centrality: {},
    connected_component_importance_dict: {},
  });
  const [ontologyOpen, setOntologyOpen] = useState<boolean>(false);
  const [seenIntro, setSeenIntro] = useState(getSeenIntro());
  const [errorMessage, setErrorMessage] = useState("");
  const [sessionStartTimestamp, setSessionStartTimestamp] = useState(new Date());

  const navigate = useNavigate();

  const isLast = currentMessage === messages.length - 1;
  const isFinalMessage = currentMessage === expectedNodes - 1;
  const isBeforeReport = currentMessage === expectedNodes - 2;

  function setCurrentMessageHistory(currentMessage: number) {
    setCurrentMessage(currentMessage);
    navigate(`/${currentMessage}${location.search}`);
  }

  useEffect(() => {
    if (seenIntro) {
      hasSeenIntro();
    }
  }, [seenIntro]);

  return (
    <AppContext.Provider
      value={{
        ...initial,
        expectedNodes,
        setExpectedNodes,
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
        isFinalMessage,
        isBeforeReport,
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
        ontologyOpen,
        setOntologyOpen,
        generatingReport,
        setGeneratingReport,
        seenIntro,
        setSeenIntro,
        errorMessage,
        setErrorMessage,
        sessionStartTimestamp,
        setSessionStartTimestamp
      }}
    >
      {" "}
      {children}{" "}
    </AppContext.Provider>
  );
};
