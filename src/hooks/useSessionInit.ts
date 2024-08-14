import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.tsx";
import {getSeenIntro, getSession, getSessionHistory, saveSession} from "../lib/sessionFunctions.ts";
import {extractIdParam} from "../lib/urlParamExtraction.ts";
import {BoomiMessage, BoomiSuggestion, Message} from "../model/message.ts";
import {Session} from "../model/session.ts";
import {DEFAULT_LANGUAGE} from "../i18n/i18n.tsx";

// @ts-ignore
import {queryInitSession} from "companion-ui-api/apiClient";


export default function useSessionInit() {
  const {
    setStartSession,
    setMessages,
    setCurrentMessage,
    setDisplayRegistrationMessage,
    seenIntro,
    setSeenIntro,
    setErrorMessage,
    setSending,
    setConnected
  } = useContext(AppContext);

  useEffect(() => {
    const sessionHistory = getSessionHistory();
    const session: Session | null = getSession()
    if (sessionHistory.length > 0 && !extractIdParam()) {
      // Display registration message if the user is re-using the tool and there is no identifier in the URL.
      setDisplayRegistrationMessage(true);
      return
    }
    const seenIntro = getSeenIntro()
    setSeenIntro(seenIntro)
    setErrorMessage("")
    setConnected(true)
    if(seenIntro) {
      if (!session) {
        setSending(true)
        queryInitSession(DEFAULT_LANGUAGE, "gf@onepointltd.com")
          .then((response: BoomiMessage) => {
            const {data} = response
            const message: Message = {
              question: data.question,
              answer: "",
              final_report: false,
              suggestions: data.suggestions.map((s: BoomiSuggestion, index: number) => ({
                id: index,
                img_alt: "",
                img_src: s.image,
                main_text: s.suggestion,
                title: s.title,
                svg_image: undefined
              })),
              clarification: undefined
            }
            const messages: Message[] = [message]
            setMessages(messages)
            saveSession({
              id: data.session,
              timestamp: new Date(),
              finished: false,
              messages,
              language: DEFAULT_LANGUAGE
            })
            setStartSession(true)
            setCurrentMessage(0)
            setSending(false)
          })
          .catch((error: Error) => {
            setErrorMessage(error.message)
          })
      } else {
        setMessages(session.messages)
        setCurrentMessage(session.messages.length - 1)
        setStartSession(true)
      }
    }
  }, [seenIntro])
}