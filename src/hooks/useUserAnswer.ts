import { getSessionId } from "../lib/websocketFunctions.ts";
import { getSession, saveSession } from "../lib/sessionFunctions.ts";
import {BoomiData, BoomiMessage, Message, ServerSuggestion} from "../model/message.ts";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";

// @ts-ignore
import { SUCCESS, upsertUserAnswer } from "../lib/boomiApi/apiClient.ts";
import { useTranslation } from "react-i18next";
import reportMarkdownAdapter from "../lib/reportMarkdownConverter.ts";

function handleNewMessage(
  newMessage: Message,
  expectedNodes: number,
  setMessages: (messages: Message[]) => void,
  setCurrentMessage: (currentMessage: number) => void,
  setCurrentMessageHistory: (currentMessageHistory: number) => void,
  setExpectedNodes: (expectedNodes: number) => void,
): number {
  const session = getSession();
  const newMessages = [...(session?.messages ?? []), newMessage];
  setMessages(newMessages);
  const messageCount = newMessages.length;
  setCurrentMessage(messageCount - 1);
  setCurrentMessageHistory(messageCount - 1);
  setExpectedNodes(Math.max(messageCount, expectedNodes));
  if (session) {
    session.messages = newMessages;
    saveSession(session);
  }
  return messageCount;
}

export function useFinalReportData() {
  const [t] = useTranslation();
  const {
    setMessages,
    setCurrentMessage,
    expectedNodes,
    setExpectedNodes,
    setCurrentMessageHistory,
  } = useContext(AppContext);
  function processData(data: BoomiData) {
    const newMessage = {
      question: reportMarkdownAdapter(
        data,
        t("recommendations-header"),
        t("recommendations-avoidance-header"),
        t("recommendations-outcomes-header"),
        t("recommendations-confidence-degree"),
        t("recommendations-confidence-degree-reasoning"),
      ),
      answer: "",
      final_report: true,
      suggestions: [],
      clarification: "",
    };
    setExpectedNodes(handleNewMessage(
      newMessage,
      expectedNodes,
      setMessages,
      setCurrentMessage,
      setCurrentMessageHistory,
      setExpectedNodes,
    ));
  }
  return { processData };
}

export default function useUserAnswer() {
  const [t] = useTranslation();
  const {processData} = useFinalReportData();

  const {
    setSending,
    chatText,
    setMessages,
    currentMessage,
    setCurrentMessage,
    expectedNodes,
    setExpectedNodes,
    setErrorMessage,
    setCurrentMessageHistory,
    setConfidence
  } = useContext(AppContext);

  function sendMessage() {
    setSending(true);
    const sessionId = getSessionId();
    const session = getSession();
    if (!!session) {
      // Make sure to save the answer before sending it to the server
      session.messages[currentMessage].answer = chatText;
      saveSession(session);
    }
    upsertUserAnswer(sessionId, currentMessage + 1, chatText)
      .then((response: BoomiMessage) => {
        const { code, data, message } = response;
        if (code === SUCCESS && !!data) {
          const { question, suggestions, previous_step_confidence_level, previous_step_rational } = data;
          const hasRecommendations = !!data.recommendations;
          if (!!question && !hasRecommendations) {
            const previousConfidence = {rating: previous_step_confidence_level ?? "", reasoning: previous_step_rational ?? ""}
            // The server has sent a new question
            const newMessage = {
              question,
              answer: "",
              final_report: false,
              suggestions: suggestions.map(
                (s: ServerSuggestion, index: number) => ({
                  id: index,
                  img_alt: "",
                  img_src: s.image,
                  main_text: s.suggestion,
                  title: s.title ?? "",
                  svg_image: undefined,
                }),
              ),
              clarification: "",
              confidence: previousConfidence
            };
            handleNewMessage(
              newMessage,
              expectedNodes,
              setMessages,
              setCurrentMessage,
              setCurrentMessageHistory,
              setExpectedNodes,
            );
            setConfidence(previousConfidence);
          } else if (hasRecommendations) {
            processData(data);
          } else {
            setErrorMessage(!!message ? t(message) : "Unspecified error");
          }
        } else {
          setErrorMessage(!!message ? t(message) : "Unspecified error");
        }
      })
      .catch((error: Error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setSending(false);
      });
  }

  return { sendMessage };
}
