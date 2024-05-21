import { Message, Suggestion } from "../model/message.ts";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { IoMdAddCircleOutline } from "react-icons/io";

function adaptSuggestion(suggestion: Suggestion) {
  return `${suggestion.title} - ${suggestion.main_text}`;
}

/**
 * Displays the suggestions available on a specific message.
 * @param message
 * @constructor
 */
export default function Suggestions({ message }: { message: Message }) {
  const { setSelectedSuggestion, currentMessage, chatText, isLast } =
    useContext(AppContext);
  const [clicked, setClicked] = React.useState<number>(-1);

  useEffect(() => {
    setClicked(-1);
  }, [currentMessage]);

  function handleSelectedSuggestion(
    e: React.MouseEvent,
    newSuggestion: string,
    clickedIndex: number,
    append: boolean = false
  ) {
    e.preventDefault();
    e.stopPropagation();
    if (append && chatText) {
      const concatenated = `${chatText}\n${newSuggestion}`;
      setSelectedSuggestion(concatenated);
    } else {
      setSelectedSuggestion(newSuggestion);
    }
    if (clickedIndex === clicked) {
      setClicked(-1);
    } else {
      setClicked(clickedIndex);
    }
  }

  if (!message.suggestions || message.suggestions.length === 0) return null;

  return (
    <div className="container suggestions">
      {message.suggestions.map((suggestion, i) => {
        return (
          <div
            key={`suggestion_${i}`}
            className={`suggestion flex !flex-col lg:!flex-row group items-center ${i === clicked ? "active" : ""}`}
            onClick={(e) => {
              return handleSelectedSuggestion(
                e,
                adaptSuggestion(suggestion),
                i
              );
            }}
          >
            {suggestion.img_src && (
              <div className="hidden suggestion-img lg:block">
                <a
                  href={suggestion.title}
                  onClick={(e) =>
                    handleSelectedSuggestion(e, suggestion.title, i)
                  }
                >
                  <img
                    className="rounded-[8px]"
                    src={suggestion.img_src}
                    alt={suggestion.img_alt}
                  />
                </a>
              </div>
            )}
            <div className="flex items-center gap-3 duration-200 suggestion-text group-hover:text-gray-200">
              <div>
                {suggestion.title && (
                  <>
                    <b>{suggestion.title}</b> -{" "}
                  </>
                )}
                {suggestion.main_text}
              </div>
              {isLast && currentMessage > 0 && (
                <div className="mt-[3px]">
                  <IoMdAddCircleOutline
                    onClick={(e) =>
                      handleSelectedSuggestion(
                        e,
                        adaptSuggestion(suggestion),
                        i,
                        true
                      )
                    }
                    title="Append to message"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
