import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext.tsx";
import { io } from "socket.io-client";
import { AppContext } from "../context/AppContext.tsx";
import { sendStartSession } from "../lib/websocketFunctions.ts";
import { saveSession } from "../lib/sessionFunctions.ts";
import { WEBSOCKET_SERVER_COMMAND } from "../model/websocketCommands.ts";
import { Message } from "../model/message.ts";
import { toast } from "../../@/components/ui/use-toast.ts";
import i18next from "i18next";
import { useTranslation } from "react-i18next";

interface ServerMessage {
  session_id: string;
  server_messages: Message[];
}

interface SingleMessage {
  session_id: string;
  question: string;
}

function adaptServerMessages(serverMessages: ServerMessage): Message[] {
  return serverMessages.server_messages.map((message: any) => {
    return {
      question: message.question,
      answer: message.answer,
      final_report: message.final_report,
      clarification: message.clarification ?? "",
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
    setGeneratingReport,
  } = useContext(AppContext);
  const { socket, websocketUrl, reportUrl } = useContext(ChatContext);
  const {
    setConnected,
    setMessages,
    setCurrentMessageHistory,
    setSending,
    setExpectedNodes,
  } = useContext(AppContext);

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
      });
    };

    const onDisconnect = () => {
      console.info("disconnected");
      setConnected(false);
    };

    function onStartSession(value: string) {
      if (!value) return;
      const serverMessages = JSON.parse(value);
      setMessages(adaptServerMessages(serverMessages));
      setCurrentMessageHistory(serverMessages.server_messages.length - 1);
      extractInterviewSteps(serverMessages, setExpectedNodes);
      saveSession({
        id: serverMessages.session_id,
        timestamp: new Date(),
        language: i18next?.language,
      });
    }

    function onServerMessage(value: string) {
      const serverMessages = JSON.parse(value);
      const messages = adaptServerMessages(serverMessages);
      setMessages(messages);
      setCurrentMessageHistory(serverMessages.server_messages.length - 1);
      const hasFinalReport = messages.some((message) => message.final_report);
      if (hasFinalReport) {
        setExpectedNodes(messages.length);
      }
      setSending(false);
      setGeneratingReport(false);
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
        toast({
          title: t("Interview Steps Updated"),
          description: t("interview-steps-updated", { sessionSteps }),
        });
      } else {
        toast({
          title: t("Interview Steps Update Failed"),
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
      socket.current?.off(WEBSOCKET_SERVER_COMMAND.ERROR, onErrorMessage);
    };
  }, []);
}
