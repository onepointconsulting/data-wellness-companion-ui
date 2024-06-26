import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { sendClientMessage } from "../lib/websocketFunctions.ts";
import { ChatContext } from "../context/ChatContext.tsx";
import { useTranslation } from "react-i18next";

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
          placeholder={`${t("Type your message here and press ENTER")}...`}
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
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>
                {enoughText(chatText)
                  ? t("Send message")
                  : t("Please enter some text to send")}
              </title>
              <g clipPath="url(#clip0_771_887)">
                <path
                  d="M29.7426 0.257715C29.494 0.00904367 29.121 -0.067421 28.7947 0.0631256L0.55251 11.3599C0.229366 11.4891 0.0129796 11.7969 0.000557715 12.1447C-0.0118055 12.4925 0.182257 12.8149 0.495381 12.9667L11.6322 18.368L17.0334 29.5047C17.1807 29.8085 17.4884 30.0001 17.824 30.0001C17.8345 30.0001 17.845 30 17.8554 29.9996C18.2032 29.9872 18.511 29.7708 18.6402 29.4477L29.9371 1.20564C30.0676 0.879159 29.9912 0.506328 29.7426 0.257715ZM3.05235 12.2532L25.4718 3.28548L12.1107 16.6464L3.05235 12.2532ZM17.747 26.9478L13.3537 17.8893L26.7148 4.52837L17.747 26.9478Z"
                  fill="#4A4A4A"
                />
              </g>
              <defs>
                <clipPath id="clip0_771_887">
                  <rect width="30" height="30" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
