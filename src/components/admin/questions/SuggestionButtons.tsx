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

  const addSuggestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("addSuggestion", questionId);
    dispatch({
      type: "addSuggestion",
      questionId,
    });
  };

  return (
    <>
      <button className="btn" onClick={addSuggestion}>
        {t("Add suggestion")}
      </button>
      <button className="btn">{t("Remove suggestion")}</button>
    </>
  );
}
