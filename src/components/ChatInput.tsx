import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { sendClientMessage } from "../lib/websocketFunctions.ts";
import { ChatContext } from "../context/ChatContext.tsx";
import { useTranslation } from "react-i18next";
import SendImage from "./buttons/SendImage.tsx";

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
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);
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

  const checkSendButton = enoughText(chatText);
  return (
    <div className="sticky chat-container bottom-8">
      {/* Pointer for sending the message button. */}
      <span
        className={`flex justify-end p-2 mr-3 mb-3 bg-slate-200 dark:bg-slate-700 rounded-full w-fit float-right  ${checkSendButton ? "animate-bounce opacity-75" : ""}`}
      >
        <svg
          className="w-6 h-6 text-violet-500"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </span>

      {/* Input */}
      <div className="chat-input">
        <textarea
          className="chat-textarea"
          aria-invalid="false"
          autoComplete="false"
          id="chat-input"
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          placeholder={`${t("Please choose a topic or begin typing here")}...`}
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
            className="disabled:opacity-1"
          >
            <SendImage enoughText={enoughText(chatText)} />
          </button>
        )}
      </div>
    </div>
  );
}
