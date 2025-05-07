import { useContext, useEffect } from "react";
import { ChatContext, readChatTYpeFromLS } from "../context/ChatContext.tsx";
import { io } from "socket.io-client";
import { AppContext } from "../context/AppContext.tsx";
import { sendStartSession } from "../lib/websocketFunctions.ts";
import { saveSession } from "../lib/sessionFunctions.ts";
import { WEBSOCKET_SERVER_COMMAND } from "../model/websocketCommands.ts";
import { Message } from "../model/message.ts";
import { toast } from "../../@/components/ui/use-toast.ts";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import {
  GlobalProperties,
  Property,
  ServerMessage,
  SingleMessage,
} from "../model/serverMessage.ts";
import { readDisplayedConfidenceLevelProceedWarning } from "../lib/confidenceStateFunctions.ts";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";

function adaptServerMessages(serverMessages: ServerMessage): Message[] {
  return serverMessages.server_messages.map((message: any) => {
    return {
      question: message.question,
      answer: message.answer,
      final_report: message.final_report,
      clarification: message.clarification ?? "",
      question_id: message.question_id,
      suggestions: message.suggestions.map((suggestion: any) => ({
        id: suggestion.id,
        img_alt: suggestion.img_alt,
        img_src: suggestion.img_src,
        main_text: suggestion.main_text,
        title: suggestion.title,
        svg_image: suggestion.svg_image,
      })),
    };
  });
}

function adaptGlobalProperties(serverMessages: ServerMessage): Property[] {
  const globalConfig = serverMessages.global_configuration;
  return globalConfig.properties;
}

function extractInterviewSteps(
  serverMessages: any,
  setExpectedNodes: (expectedNodes: number) => void,
) {
  if (serverMessages.session_configuration) {
    if (serverMessages.session_configuration.configuration_entries) {
      const entries =
        serverMessages.session_configuration.configuration_entries;
      for (const entry of entries) {
        if (
          entry.config_key === "session-steps" &&
          entry.config_value &&
          !isNaN(entry.config_value)
        ) {
          setExpectedNodes(parseInt(entry.config_value));
        }
      }
    }
  }
}

export function useWebsocket() {
  const [t] = useTranslation();
  const {
    setDisplayRegistrationMessage,
    setUpdatingExpectedNodes,
    setRegenerating,
  } = useContext(AppContext);
  const {
    setExpectedNodes,
    setGeneratingReport,
    setMessageLowerLimit,
    setMessageUpperLimit,
    setDisplayedConfidenceLevelProceedWarning,
  } = useAppStore(useShallow((state) => ({ ...state })));
  const { socket, websocketUrl, reportUrl } = useContext(ChatContext);
  const { setConnected, setMessages, setCurrentMessageHistory, setSending } =
    useContext(AppContext);

  useEffect(() => {
    socket.current = io(websocketUrl);

    const onConnect = () => {
      setConnected(true);
      // Handle session
      sendStartSession({
        socket: socket.current,
        expectedInteviewSteps: null,
        setDisplayRegistrationMessage,
        apiServer: reportUrl,
        chatType: readChatTYpeFromLS(),
      });
    };

    const onDisconnect = () => {
      console.info("disconnected");
      setConnected(false);
    };

    function onStartSession(value: string) {
      if (!value) return;
      const serverMessages = JSON.parse(value);
      const messages = adaptServerMessages(serverMessages);
      setMessages(messages);
      setCurrentMessageHistory(serverMessages.server_messages.length - 1);
      extractInterviewSteps(serverMessages, setExpectedNodes);
      setDisplayedConfidenceLevelProceedWarning(
        readDisplayedConfidenceLevelProceedWarning(),
      );
      const globalProperties = adaptGlobalProperties(serverMessages);
      for (const prop of globalProperties) {
        const value = prop.config_value;
        switch (prop.config_key) {
          case GlobalProperties.MESSAGE_UPPER_LIMIT:
            setMessageUpperLimit(parseInt(value));
            break;
          case GlobalProperties.MESSAGE_LOWER_LIMIT:
            setMessageLowerLimit(parseInt(value));
            break;
        }
      }
      saveSession({
        id: serverMessages.session_id,
        timestamp: new Date(),
        language: i18next?.language,
      });
    }

    function onServerMessage(value: string) {
      const serverMessages = JSON.parse(value);
      const messages = adaptServerMessages(serverMessages);
      setMessages(() => {
        setCurrentMessageHistory(serverMessages.server_messages.length - 1);
        return messages;
      });
      const hasFinalReport = messages.some((message) => message.final_report);
      if (hasFinalReport) {
        setExpectedNodes(messages.length);
      }
      setGeneratingReport(false);
    }

    function baseRegenerateMessage(
      value: string,
      handleMessage: (value: any) => void,
    ) {
      const serverMessages = JSON.parse(value);
      if (serverMessages["error"]) {
        console.error("Failed to regenerate.");
        const errorMessage = serverMessages["error"];
        toast({
          title: t("Error"),
          description: errorMessage,
        });
      } else {
        handleMessage(serverMessages);
      }
      setSending((_) => {
        setRegenerating(false);
        return false;
      });
    }

    function onRegenerateMessage(value: string) {
      baseRegenerateMessage(value, (serverMessages: any) => {
        const messages = adaptServerMessages(serverMessages);
        setMessages(messages);
      });
    }

    function onAddMoreSuggestions(value: string) {
      baseRegenerateMessage(value, (serverMessages: any) => {
        console.log("onAddMoreSuggestions", serverMessages);
        setMessages((previousMessages) => {
          const newMessages = [...previousMessages];
          const lastMessage = newMessages.slice(-1)[0];
          const newSuggestions: any[] = serverMessages["possible_answers"].map(
            (pa: any) => ({
              image_src: "",
              image_alt: "",
              main_text: pa["main_text"],
            }),
          );
          lastMessage.suggestions = [...lastMessage.suggestions];
          for (const newMessage of newSuggestions) {
            if (
              lastMessage.suggestions.findIndex(
                (pa) => pa.main_text === newMessage["main_text"],
              ) === -1
            ) {
              lastMessage.suggestions.push(newMessage);
            }
          }
          return newMessages;
        });
      });
    }

    function onErrorMessage(value: string) {
      const serverMessage: SingleMessage = JSON.parse(value);
      toast({
        title: t("Error"),
        description: t(serverMessage.question),
      });
    }

    function onExtendSession(sessionSteps: number) {
      if (sessionSteps > 0) {
        setExpectedNodes(sessionSteps);
      } else {
        toast({
          title: t("Interview steps update failed"),
          description: t("interview-steps-update-failed", { sessionSteps }),
          variant: "destructive",
        });
      }
      setUpdatingExpectedNodes(false);
    }

    socket.current.on(WEBSOCKET_SERVER_COMMAND.START_SESSION, onStartSession);
    socket.current.on(WEBSOCKET_SERVER_COMMAND.CONNECT, onConnect);
    socket.current.on(WEBSOCKET_SERVER_COMMAND.DISCONNECT, onDisconnect);
    socket.current.on(WEBSOCKET_SERVER_COMMAND.SERVER_MESSAGE, onServerMessage);
    socket.current.on(WEBSOCKET_SERVER_COMMAND.EXTEND_SESSION, onExtendSession);
    socket.current.on(
      WEBSOCKET_SERVER_COMMAND.REGENERATE_QUESTION,
      onRegenerateMessage,
    );
    socket.current.on(
      WEBSOCKET_SERVER_COMMAND.ADD_MORE_SUGGESTIONS,
      onAddMoreSuggestions,
    );
    socket.current.on(WEBSOCKET_SERVER_COMMAND.ERROR, onErrorMessage);

    return () => {
      socket.current?.off(
        WEBSOCKET_SERVER_COMMAND.START_SESSION,
        onStartSession,
      );
      socket.current?.off(WEBSOCKET_SERVER_COMMAND.CONNECT, onConnect);
      socket.current?.off(WEBSOCKET_SERVER_COMMAND.DISCONNECT, onDisconnect);
      socket.current?.off(
        WEBSOCKET_SERVER_COMMAND.SERVER_MESSAGE,
        onServerMessage,
      );
      socket.current?.off(
        WEBSOCKET_SERVER_COMMAND.EXTEND_SESSION,
        onExtendSession,
      );
      socket.current?.off(
        WEBSOCKET_SERVER_COMMAND.REGENERATE_QUESTION,
        onRegenerateMessage,
      );
      socket.current?.off(
        WEBSOCKET_SERVER_COMMAND.ADD_MORE_SUGGESTIONS,
        onAddMoreSuggestions,
      );
      socket.current?.off(WEBSOCKET_SERVER_COMMAND.ERROR, onErrorMessage);
    };
  }, []);
}
