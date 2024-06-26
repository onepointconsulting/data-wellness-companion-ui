import { Message, Suggestion } from "../model/message.ts";
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";

function adaptSuggestion(suggestion: Suggestion) {
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
      setSelectedSuggestion(newSuggestion);
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
    <div className="container suggestions">
      {message.suggestions.map((suggestion, i) => {
        console.log("chatText", chatText);
        console.log("suggestion.main_text", suggestion.main_text);

        return (
          <div
            key={`suggestion_${i}`}
            className={`suggestion group items-center ${chatText.includes(suggestion.main_text) || message.answer.includes(suggestion.main_text) ? "active" : ""}`}
            onClick={(e) => {
              return handleSelectedSuggestion(e, adaptSuggestion(suggestion));
            }}
          >
            {suggestion.img_src && (
              <div className="suggestion-img">
                <a
                  href={suggestion.title}
                  onClick={(e) => handleSelectedSuggestion(e, suggestion.title)}
                >
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
      })}
    </div>
  );
}
