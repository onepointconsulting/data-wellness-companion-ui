import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { QuestionsContext } from "./questionsReducer";

export default function SuggestionButtons({
  questionId,
}: {
  questionId: number;
}) {
  const { t } = useTranslation();
  const { dispatch } = useContext(QuestionsContext);

  function addSuggestion(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log("addSuggestion", questionId);
    dispatch({
      type: "addSuggestion",
      questionId,
    });
  }

  return (
    <div className="flex gap-2">
      <button className="btn" onClick={addSuggestion}>
        {t("Add suggestion")}
      </button>
    </div>
  );
}
