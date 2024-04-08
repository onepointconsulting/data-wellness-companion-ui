import {Message} from "../model/message.ts";
import React, {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.tsx";

/**
 * Displays the suggestions available on a specific message.
 * @param message
 * @constructor
 */
export default function Suggestions({message}: { message: Message }) {
  const {setSelectedSuggestion, currentMessage} = useContext(AppContext);
  const [clicked, setClicked] = React.useState<number>(-1);

  useEffect(() => {
    setClicked(-1);
  }, [currentMessage])

  function handleSelectedSuggestion(e: React.MouseEvent, suggestion: string, clicked: number) {
    e.preventDefault();
    setSelectedSuggestion(suggestion);
    setClicked(clicked);
  }

  if (!message.suggestions || message.suggestions.length === 0) return null;

  return (
    <div className="suggestions container">
      {message.suggestions.map((suggestion, i) => {
        return (
          <div key={`suggestion_${i}`} className={`suggestion ${i === clicked ? 'active' : ''}`}
               onClick={(e) => {
                 return handleSelectedSuggestion(
                   e,
                   `${suggestion.title} - ${suggestion.main_text}`,
                   i
                 )
               }
               }>
            {suggestion.img_src && <div className="suggestion-img">
              <a
                href={suggestion.title}
                onClick={(e) => handleSelectedSuggestion(e, suggestion.title, i)}
              >
                <img src={suggestion.img_src} alt={suggestion.img_alt}/>
              </a>
            </div>}
            <div className="suggestion-text">
              <div>
                {suggestion.title && <><b>{suggestion.title}</b> - </>}{suggestion.main_text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
