import {useContext, useEffect, useRef} from "react";
import {AppContext} from "../context/AppContext.tsx";
import {useTranslation} from "react-i18next";
import SendImage from "./buttons/SendImage.tsx";
// @ts-ignore
import {SUCCESS, upsertUserAnswer} from "companion-ui-api/apiClient";
import {getSessionId} from "../lib/websocketFunctions.ts";
import {BoomiMessage, ServerSuggestion} from "../model/message.ts";
import {getSession, saveSession} from "../lib/sessionFunctions.ts";

function adjustHeight(style: CSSStyleDeclaration, el: HTMLTextAreaElement) {
  style.height = `auto`;
  style.height = `${el.scrollHeight}px`;
}

function enoughText(chatText: string) {
  return chatText?.length > 2;
}

/**
 * Chat input field to be used in this application.
 * @constructor
 */
export default function ChatInput() {
  const {
    selectedSuggestion,
    setSending,
    sending,
    connected,
    chatText,
    setChatText,
    updatingConfidence,
    messages, setMessages,
    currentMessage,
    setCurrentMessage,
    setErrorMessage
  } = useContext(AppContext);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [t] = useTranslation();
  useEffect(() => {
    if (
      selectedSuggestion !== null &&
      typeof selectedSuggestion !== "undefined" &&
      textAreaRef.current
    ) {
      setChatText(selectedSuggestion);
    }
  }, [selectedSuggestion]);

  useEffect(() => {
    if (textAreaRef.current) {
      const style = textAreaRef.current.style;
      const el = textAreaRef.current;
      adjustHeight(style, el);
    }
  }, [chatText]);

  useEffect(() => {
    if (!sending) {
      setChatText("");
    }
  }, [sending]);

  function sendMessage() {
    setSending(true);
    const sessionId = getSessionId()
    upsertUserAnswer(sessionId, currentMessage + 1, chatText)
      .then((response: BoomiMessage) => {
        const {code, data, message} = response;
        debugger
        if (code === SUCCESS && !!data) {
          const {question, suggestions} = data;
          if (!!question) {
            const newMessage = {
              question,
              answer: "",
              final_report: false,
              suggestions: suggestions.map((s: ServerSuggestion, index: number) => ({
                id: index,
                img_alt: "",
                img_src: s.image,
                main_text: s.suggestion,
                title: s.title ?? "",
                svg_image: undefined
              })),
              clarification: "",
            }
            const newMessages = [...messages, newMessage];
            const session = getSession();
            setMessages(newMessages);
            setCurrentMessage(newMessages.length - 1);
            if(session) {
              session.messages = newMessages;
              saveSession(session);
            }
          } else {
            // The final report is ready
            const {outcomes} = data;
            if(!outcomes) {
              setErrorMessage(!!message ? t(message) : "Unspecified error");
            }
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
      })
  }

  function sendEnterMessage(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!e.shiftKey && e.key === "Enter" && chatText.length > 0) {
      sendMessage();
      // resetHeight();
    } else {
      const el = e.target as HTMLTextAreaElement;
      const style = textAreaRef.current!.style;
      adjustHeight(style, el);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-input">
        <textarea
          className="chat-textarea"
          aria-invalid="false"
          autoComplete="false"
          id="chat-input"
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          placeholder={`${t(currentMessage === 0 ? "placeholder-start" : "placeholder-normal")}...`}
          onKeyUp={sendEnterMessage}
          disabled={sending || !connected}
          ref={textAreaRef}
        />
        {connected && (
          <button
            onClick={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            disabled={!enoughText(chatText) || sending}
            className="disabled:opacity-10"
          >
            {!updatingConfidence && (
              <SendImage enoughText={enoughText(chatText)}/>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
