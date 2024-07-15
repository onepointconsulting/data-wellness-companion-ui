import { Message, Suggestion } from "../model/message.ts";
import React, { useContext, useState } from "react";
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
      className="w-14 h-14 rounded-[8px]"
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
  const { chatText } = useContext(AppContext);
  const [menuOpen, __setMenuOpen] = useState(true);

  return (
    <div
      className={`select-suggestion my-2 mx-1 duration-300 border-l-2 p-[7px] border-r-2 rounded-l-sm rounded-r-sm cursor-pointer dark:bg-slate-900 hover:border-l-lime-500 hover:border-r-amber-500 border-r-lime-500 border-amber-500 hover:bg-blue-400/50 ${menuOpen ? "animate-flip-down animate-once" : "animate-flip-up animate-ease-in-out"}
      ${chatText.includes(suggestion.main_text) || message.answer.includes(suggestion.main_text) ? "active" : ""}
      `}
      onClick={handleSuggestion}
    >
      <ul className="flex flex-col gap-2">
        <li className="flex items-center">
          {/* Image */}
          {suggestion.img_src && (
            <a
              href={suggestion.title}
              onClick={handleSuggestion}
              className="w-32"
            >
              <SuggestionImage suggestion={suggestion} />
            </a>
          )}

          {/* Title */}
          <div className="p-1">
            {suggestion.title && (
              <h6 className="mx-2 break-all">{suggestion.title}</h6>
            )}

            {/* Main text */}
            {suggestion.main_text.length > 0 && <p>{suggestion.main_text}</p>}
          </div>
        </li>
      </ul>
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
  const [menuOpen, setMenuOpen] = useState(true);

  function handleSelectedSuggestion(
    e: React.MouseEvent,
    newSuggestion: string
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

  console.log("currentMessage", currentMessage);

  return (
    <div className="container">
      <div className="w-full">
        {/* Open menu */}
        <div
          className="cursor-pointer w-fit dark:bg-slate-700 bg-slate-200"
          onClickCapture={() => setMenuOpen(!menuOpen)}
        >
          <img
            className={`w-16 h-16 ${menuOpen ? "animate-rotate-x animate-ease-linear" : "animate-rotate-x animate-ease-in"}`}
            src={`/public/svg/${menuOpen ? "menu-dropdown-close.svg" : "menu-dropdown-open.svg"}`}
            alt=""
            style={{ filter: "invert(1)" }}
          />
        </div>

        {/* Logo */}
        {!menuOpen && (
          <div className="flex flex-col items-center animate-fade animate-ease-in">
            <img
              className="mx-auto my-5 w-72"
              src="logo.png"
              alt="HopeLink logo"
            />
            <h6 className="px-8 text-xl text-center">
              Welcome to HopeLink, your AI chat companion for refugees. Answer a
              few questions, and based on your responses, receive personalized
              suggestions and a detailed report to help you navigate your new
              journey.
            </h6>
          </div>
        )}

        <div
          className={`grid w-full ${currentMessage === 0 ? "grid-cols-2" : "grid-cols-3"}`}
        >
          {/* Menu item */}
          {menuOpen && (
            <>
              {" "}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
