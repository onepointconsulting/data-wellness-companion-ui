import Field from "../token/Field.tsx";
import { useTranslation } from "react-i18next";
import { QuestionsContext, QuestionSuggestion } from "./questionsReducer.tsx";
import { useContext } from "react";

const questionLabel = "Question";

export default function QuestionField({
  i,
  questionSuggestion,
}: {
  i: number;
  questionSuggestion: QuestionSuggestion;
}) {
  const [t] = useTranslation();
  const { dispatch } = useContext(QuestionsContext);
  return (
    <Field label={questionLabel}>
      <input
        type="text"
        className="admin-input"
        placeholder={t(questionLabel)}
        value={questionSuggestion.question}
        onChange={(e) => {
          dispatch({
            type: "setQuestion",
            questionSuggestion: {
              question: e.target.value,
              id: questionSuggestion.id,
              suggestions: [...questionSuggestion.suggestions],
            },
            index: i,
          });
        }}
      />
    </Field>
  );
}
