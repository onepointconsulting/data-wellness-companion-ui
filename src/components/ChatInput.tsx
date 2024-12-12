import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { sendClientMessage } from "../lib/websocketFunctions.ts";
import { ChatContext } from "../context/ChatContext.tsx";
import { useTranslation } from "react-i18next";
import SendImage from "./buttons/SendImage.tsx";
import {JoyrideContext} from "../context/JoyrideContext.tsx";

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
    currentMessage,
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);
  const {setInitState, mainQuestionRef} = useContext(JoyrideContext)
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [t] = useTranslation();

  useEffect(() => {
    setInitState(true)
  }, []);

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
    sendClientMessage(socket.current, chatText);
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
    <div className="chat-container" ref={mainQuestionRef}>
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
              <SendImage enoughText={enoughText(chatText)} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
