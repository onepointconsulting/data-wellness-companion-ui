import { getSessionId } from "../lib/websocketFunctions.ts";
import { getSession, saveSession } from "../lib/sessionFunctions.ts";
import { BoomiMessage, Message, ServerSuggestion } from "../model/message.ts";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";

// @ts-ignore
import { SUCCESS, upsertUserAnswer } from "companion-ui-api/apiClient";
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

export default function useUserAnswer() {
  const [t] = useTranslation();

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
          const { question, suggestions } = data;
          const hasRecommendations = !!data.recommendations;
          if (!!question && !hasRecommendations) {
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
            };
            handleNewMessage(
              newMessage,
              expectedNodes,
              setMessages,
              setCurrentMessage,
              setCurrentMessageHistory,
              setExpectedNodes,
            );
          } else if (hasRecommendations) {
            // The final report is ready
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
            const messageCount = handleNewMessage(
              newMessage,
              expectedNodes,
              setMessages,
              setCurrentMessage,
              setCurrentMessageHistory,
              setExpectedNodes,
            );
            setExpectedNodes(messageCount);
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
