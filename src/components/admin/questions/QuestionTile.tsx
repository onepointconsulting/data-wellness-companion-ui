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

  return (
    <div className="suggestion group items-center">
      <div className="flex">
        {suggestion.svg_image && (
          <div
            dangerouslySetInnerHTML={{
              __html: suggestion.svg_image,
            }}
          />
        )}
        <button
          className={`final-report-email ${!suggestion.svg_image ? "!-ml-0" : ""}`}
          onClick={onEditSvg}
        >
          {t("Edit image")}
        </button>
      </div>
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
        className="admin-input h-32"
        onChange={(e) =>
          onSuggestionsMainTextChange(e, suggestion, questionSuggestion.id)
        }
        value={suggestion.main_text}
      />
    </div>
  );
}
