import { Message, Suggestion } from "../model/message.ts";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { useTranslation } from "react-i18next";
import { addMoreSuggestions } from "../lib/websocketFunctions.ts";
import { ChatContext } from "../context/ChatContext.tsx";

function adaptSuggestion(suggestion: Suggestion) {
  if (!suggestion.title) {
    return suggestion.main_text;
  }
  return `${suggestion.title} - ${suggestion.main_text}`;
}

function SuggestionImage({ suggestion }: { suggestion: Suggestion }) {
  if (suggestion.svg_image) {
    return <span dangerouslySetInnerHTML={{ __html: suggestion.svg_image }} />;
  }
  return (
    <img
      className="rounded-[8px]"
      src={suggestion.img_src}
      alt={suggestion.img_alt}
    />
  );
}

function removeEmptyLines(text: string) {
  return text.replace(/^\s*[\r\n]/gm, "");
}

function isActive(
  chatText: string,
  suggestion: Suggestion,
  messages: Message[],
  currentMessage: number,
  message: Message,
) {
  return (
    chatText.includes(suggestion.main_text) ||
    (messages.length - 1 !== currentMessage &&
      message.answer.includes(suggestion.main_text))
  );
}

export function SuggestionTemplate({
  suggestion,
  message,
  i,
  handleSuggestion,
}: {
  suggestion: Suggestion;
  message: Message;
  i: number;
  handleSuggestion: (e: React.MouseEvent<HTMLElement>) => void;
}) {
  const { chatText, currentMessage, messages, isSuggestionDeactivated } =
    useContext(AppContext);
  const hasImage = suggestion.img_src || suggestion.svg_image;
  const hasTitle = suggestion.title;
  return (
    <div
      key={`suggestion_${i}`}
      className={`suggestion group 
        ${isActive(chatText, suggestion, messages, currentMessage, message) ? "active" : ""} ${isSuggestionDeactivated ? "has-report" : ""}`}
      onClick={handleSuggestion}
    >
      {(hasImage || hasTitle) && (
        <div className="suggestion-img">
          {hasImage && (
            <a href={suggestion.title} onClick={handleSuggestion}>
              <SuggestionImage suggestion={suggestion} />
            </a>
          )}
          {hasTitle && (
            <div className="suggestion-title">
              <p>{suggestion.title}</p>
            </div>
          )}
        </div>
      )}
      <div className="duration-200 suggestion-text">
        <div>{suggestion.main_text}</div>
      </div>
    </div>
  );
}

/**
 * Displays the suggestions available on a specific message.
 * @param message
 * @constructor
 */
export default function Suggestions({ message }: { message: Message }) {
  const { t } = useTranslation();
  const {
    setSelectedSuggestion,
    chatText,
    currentMessage,
    sending,
    setSending,
    isSuggestionDeactivated,
    isLast,
    setRegenerating,
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);

  useEffect(() => {
    setSelectedSuggestion("");
  }, [currentMessage]);

  function handleSelectedSuggestion(
    e: React.MouseEvent,
    newSuggestion: string,
  ) {
    if (!sending) {
      e.preventDefault();
      e.stopPropagation();
      if (currentMessage === 0) {
        setSelectedSuggestion(
          chatText.includes(newSuggestion) ? "" : newSuggestion,
        );
      } else {
        if (!chatText.includes(newSuggestion)) {
          const concatenated = `${chatText}\n${newSuggestion}`;
          setSelectedSuggestion(removeEmptyLines(concatenated));
        } else {
          const newText = removeEmptyLines(chatText.replace(newSuggestion, ""));
          setSelectedSuggestion(newText);
        }
      }
    }
  }

  function handleGenerateMoreAnswers() {
    const question = message.question;
    if (question) {
      setSending((_) => {
        setRegenerating(true);
        setSelectedSuggestion("");
        return true;
      });
      addMoreSuggestions(socket.current, question);
    }
  }

  if (!message.suggestions || message.suggestions.length === 0) return null;

  return (
    <>
      {isSuggestionDeactivated && !sending && (
        <div className="not-editable-warning">
          {t("previous-question-note")}
        </div>
      )}
      <div className="container suggestions animate-fade-down">
        {message.suggestions.map((suggestion, i) => {
          return (
            <SuggestionTemplate
              suggestion={suggestion}
              message={message}
              i={i}
              handleSuggestion={(e) =>
                handleSelectedSuggestion(e, adaptSuggestion(suggestion))
              }
              key={`suggestion_${i}`}
            />
          );
        })}
      </div>
      {currentMessage > 0 && isLast && !sending && (
        <div className="pb-8">
          <button
            onClick={handleGenerateMoreAnswers}
            title={t("Regenerate Response")}
            className="text-left cursor-pointer rounded-md hover:scale-101 text-[#07000d] dark:text-[#fafffe] transition duration-300 hover:underline ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex flex-row items-center gap-2"
          >
            <svg
              version="1.1"
              id="fi_512142"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 426.667 426.667"
              xmlSpace="preserve"
              className="!fill-[#07000d] dark:!fill-[#fafffe] h-6 w-6 transition-colors duration-300"
            >
              <g>
                <g>
                  <circle cx="42.667" cy="213.333" r="42.667"></circle>
                </g>
              </g>
              <g>
                <g>
                  <circle cx="213.333" cy="213.333" r="42.667"></circle>
                </g>
              </g>
              <g>
                <g>
                  <circle cx="384" cy="213.333" r="42.667"></circle>
                </g>
              </g>
            </svg>
            {t("Regenerate Response")}
          </button>
        </div>
      )}
    </>
  );
}
