import { Message, Suggestion } from "../model/message.ts";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";

function adaptSuggestion(suggestion: Suggestion) {
  if(!suggestion.title) {
    return suggestion.main_text;
  }
  return `${suggestion.title} - ${suggestion.main_text}`;
}

function SuggestionImage({ suggestion }: { suggestion: Suggestion }) {
  if (!!suggestion.svg_image) {
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
  const { chatText, currentMessage, messages } = useContext(AppContext);
  return (
    <div
      key={`suggestion_${i}`}
      className={`suggestion group items-center ${chatText.includes(suggestion.main_text) || (messages.length - 1 !== currentMessage && message.answer.includes(suggestion.main_text)) ? "active" : ""}`}
      onClick={handleSuggestion}
    >
      {(suggestion.img_src || suggestion.svg_image) && (
        <div className="suggestion-img">
          <a href={suggestion.title} onClick={handleSuggestion}>
            <SuggestionImage suggestion={suggestion} />
          </a>
          <div className="suggestion-title">
            {suggestion.title && (
              <>
                <b>{suggestion.title}</b>{" "}
              </>
            )}
          </div>
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
  const { setSelectedSuggestion, chatText, currentMessage } =
    useContext(AppContext);

  function handleSelectedSuggestion(
    e: React.MouseEvent,
    newSuggestion: string,
  ) {
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

  if (!message.suggestions || message.suggestions.length === 0) return null;

  return (
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
  );
}
