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
    updatingConfidence,
    currentMessage,
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
    <>
      <div className="chat-container">
        {currentMessage === 0 && !sending && (
          <div className="flex flex-row flex-wrap my-4 border border-solid border-[#dbdbdb] text-[#4d4d4d] gap-4 p-3 dark:text-gray-200">
            {Array.from({ length: 3 }, (_, i) => i).map((i) => {
              return (
                <div
                  key={`placeholder-start-${i}`}
                  className="w-full"
                  dangerouslySetInnerHTML={{
                    __html: t("placeholder-start-" + (i + 1)),
                  }}
                />
              );
            })}
          </div>
        )}
        {currentMessage > 0 && !sending && (
          <div
            className="w-full my-4 border border-solid border-[#dbdbdb] text-[#4d4d4d] gap-4 p-3 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: t("placeholder-normal") }}
          />
        )}
        <div className="chat-input">
          <textarea
            className="chat-textarea"
            aria-invalid="false"
            autoComplete="false"
            id="chat-input"
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
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
              id="send-button"
            >
              {!updatingConfidence && (
                <SendImage enoughText={enoughText(chatText)} />
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
