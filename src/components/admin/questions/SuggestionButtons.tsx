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

  function addSuggestion (e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log("addSuggestion", questionId);
    dispatch({
      type: "addSuggestion",
      questionId,
    });
  }

  function removeSuggestion(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
  }

  return (
    <div className="flex gap-2">
      <button className="btn" onClick={addSuggestion}>
        {t("Add suggestion")}
      </button>
      <button className="btn" onClick={removeSuggestion}>{t("Remove suggestion")}</button>
    </div>
  );
}
