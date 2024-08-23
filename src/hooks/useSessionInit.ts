import { useContext, useEffect } from "react";
import { AppContext, DEFAULT_EXPECTED_NODES } from "../context/AppContext.tsx";
import {
  getSeenIntro,
  getSession,
  getSessionHistory,
  saveSession,
} from "../lib/sessionFunctions.ts";
import { extractIdParam } from "../lib/urlParamExtraction.ts";
import { BoomiMessage, BoomiSuggestion, Message } from "../model/message.ts";
import { Session } from "../model/session.ts";
import { DEFAULT_LANGUAGE } from "../i18n/i18n.tsx";

// @ts-ignore
import { queryInitSession } from "companion-ui-api/apiClient";
import { useTranslation } from "react-i18next";

export default function useSessionInit() {
  const {
    setStartSession,
    setMessages,
    setCurrentMessage,
    setDisplayRegistrationMessage,
    seenIntro,
    setErrorMessage,
    setSending,
    setConnected,
    sessionStartTimestamp,
    expectedNodes,
    setExpectedNodes,
    setCurrentMessageHistory,
  } = useContext(AppContext);

  const [t] = useTranslation();

  useEffect(() => {
    const sessionHistory = getSessionHistory();
    const session: Session | null = getSession();
    if (sessionHistory.length > 0 && !extractIdParam()) {
      // Display registration message if the user is re-using the tool and there is no identifier in the URL.
      setDisplayRegistrationMessage(true);
      return;
    }
    const seenIntro = getSeenIntro();
    setErrorMessage("");
    setConnected(true);
    if (seenIntro) {
      if (!session) {
        setSending(true);

        queryInitSession(DEFAULT_LANGUAGE, "gf@onepointltd.com")
          .then((response: BoomiMessage) => {
            const { data } = response;
            if (!data) {
              setErrorMessage(t("Missing question"));
              return;
            }
            const message: Message = {
              question: data.question ?? t("Missing question"),
              answer: "",
              final_report: false,
              suggestions:
                data.suggestions.map((s: BoomiSuggestion, index: number) => ({
                  id: index,
                  img_alt: "",
                  img_src: "",
                  main_text: s.suggestion,
                  title: s.title,
                  svg_image: s.image,
                })) ?? [],
              clarification: undefined,
            };
            const messages: Message[] = [message];
            setMessages(messages);
            saveSession({
              id: data.session,
              timestamp: new Date(),
              finished: false,
              messages,
              language: DEFAULT_LANGUAGE,
            });
            setStartSession(true);
            setCurrentMessage(0);
            setExpectedNodes(DEFAULT_EXPECTED_NODES);
            setSending(false);
          })
          .catch((error: Error) => {
            setErrorMessage(error.message);
          });
      } else {
        setMessages(session.messages);
        const pathname = location.pathname;
        const splits = pathname.split("/");
        const string = splits.pop();
        const maxSession = session.messages.length - 1;
        const currentMessage = Math.min(
          !!pathname && !!splits && splits.length > 0 && !!string
            ? parseInt(string)
            : maxSession,
          maxSession,
        );
        setExpectedNodes(Math.max(session.messages.length, expectedNodes));
        setCurrentMessage(currentMessage);
        setCurrentMessageHistory(currentMessage);
        setStartSession(true);
      }
    }
  }, [seenIntro, sessionStartTimestamp]);
}
