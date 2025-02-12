import { Suggestion } from "../../../model/message.ts";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { QuestionsContext, QuestionSuggestion } from "./questionsReducer.tsx";
import { showDialogue } from "../../../lib/dialogFunctions.ts";
import { IMAGE_SVG_DIALOGUE_ID } from "../dialogue/ImageSvgDialogue.tsx";

export default function QuestionTile({
  questionSuggestion,
  suggestion,
  j,
}: {
  questionSuggestion: QuestionSuggestion;
  suggestion: Suggestion;
  j: number;
}) {
  const [t] = useTranslation();
  const suggestionLabel = t("Suggestion") + ` ${j + 1}`;
  const { dispatch } = useContext(QuestionsContext);
  function onSuggestionsTitleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    suggestion: Suggestion,
    questionId: number,
  ) {
    dispatch({
      type: "setSuggestion",
      questionId,
      suggestion: { ...suggestion, title: e.target.value },
    });
  }
  function onSuggestionsMainTextChange(
    e: React.ChangeEvent<HTMLTextAreaElement>,
    suggestion: Suggestion,
    questionId: number,
  ) {
    dispatch({
      type: "setSuggestion",
      questionId,
      suggestion: { ...suggestion, main_text: e.target.value },
    });
  }

  function onEditSvg(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    dispatch({
      type: "editSuggestionSvg",
      editSuggestion: suggestion,
      editQuestion: questionSuggestion,
    });
    showDialogue(IMAGE_SVG_DIALOGUE_ID);
  }

  function removeSuggestion(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    dispatch({
      type: "removeSuggestion",
      questionId: questionSuggestion.id,
      suggestionId: suggestion.id,
    });
  }

  return (
    <div className="items-center suggestion group !p-2">
      <div className="flex items-center justify-between w-full gap-2 px-1 my-1">
        {suggestion.svg_image && (
          <div
            className="svg-admin"
            dangerouslySetInnerHTML={{
              __html: suggestion.svg_image,
            }}
          />
        )}
        <button
          className={`btn ${!suggestion.svg_image ? "!-ml-0" : ""}`}
          onClick={onEditSvg}
        >
          {t("Edit image")}
        </button>
        <button
          onClick={removeSuggestion}
          className="!cursor-pointer btn"
          title={t("Remove suggestion")}
        >
          X
        </button>
      </div>
      <div className="flex flex-col w-full gap-2">
        <input
          type="text"
          className="admin-input"
          placeholder={suggestionLabel}
          value={suggestion.title}
          onChange={(e) =>
            onSuggestionsTitleChange(e, suggestion, questionSuggestion.id)
          }
        />
        <textarea
          className="h-32 admin-input"
          onChange={(e) =>
            onSuggestionsMainTextChange(e, suggestion, questionSuggestion.id)
          }
          value={suggestion.main_text}
        />
      </div>
    </div>
  );
}
