import { useTranslation } from "react-i18next";
import { useContext, useEffect, useReducer } from "react";
import { ChatContext } from "../../../context/ChatContext.tsx";
import {
  initialQuestionsConfigState,
  questionsReducer,
  QuestionSuggestion,
} from "./questionsReducer.ts";
import AdminContainer from "../AdminContainer.tsx";
import handleSubmission from "../../../lib/formSubmission.ts";
import FormContainer from "../FormContainer.tsx";
import Field from "../token/Field.tsx";
import {
  handleError,
  handleJson,
  getQuestions,
  updateQuestion,
} from "../../../lib/admin/apiClient.ts";
import {
  supportedLanguages,
  supportedLanguagesLabels,
} from "../model/languages.ts";
import { MessageType } from "../model.ts";

const QUESTION_MIN_LENGTH = 4;
const QUESTION_MAX_LENGTH = 1024;

export default function QuestionsForm() {
  const [t] = useTranslation();
  const { reportUrl } = useContext(ChatContext);
  const [state, dispatch] = useReducer(
    questionsReducer,
    initialQuestionsConfigState,
  );

  useEffect(() => {
    getQuestions(reportUrl, state.language)
      .then((response: Response) => handleJson(response))
      .then((data) => {
        const question_and_suggestions = data["question_and_suggestions"];
        const questionSuggestions: QuestionSuggestion[] = [];
        for (const qs of question_and_suggestions) {
          const id = qs["id"] as number;
          const question = qs["question"] as string;
          const suggestions = qs["suggestions"] as any[];
          questionSuggestions.push({ id, question, suggestions });
        }
        dispatch({
          type: "setQuestionSuggestions",
          questionSuggestions,
          language: state.language,
        });
      })
      .catch((error) => handleError(error, dispatch));
  }, [state.language]);

  function onSubmit() {
    const questionUpdate = state.questionSuggestions.map((qs) => ({
      id: qs.id,
      question: qs.question,
    }));
    dispatch({ type: "processing" });
    updateQuestion(reportUrl, questionUpdate)
      .then((response: Response) => handleJson(response))
      .then((data) => {
        const updated = data["updated"] as number;
        if (updated === state.questionSuggestions.length) {
          dispatch({
            type: "setMessage",
            message: t("Updated {{updated}} question(s) successfully", {
              updated,
            }),
            messageType: MessageType.SUCCESS,
          });
        } else {
          dispatch({
            type: "setMessage",
            message: t("Some questions could not be updated. Please try again"),
            messageType: MessageType.FAILURE,
          });
        }
      })
      .catch((error) => handleError(error, dispatch));
  }

  function isDisabled() {
    return !state.questionSuggestions.every(
      (qs) =>
        qs.question.length > QUESTION_MIN_LENGTH &&
        qs.question.length < QUESTION_MAX_LENGTH,
    );
  }

  return (
    <AdminContainer
      title="Questions"
      processing={state.processing}
      message={state.message}
      messageType={state.messageType}
    >
      <FormContainer
        onReset={() => {}}
        onSubmit={handleSubmission(onSubmit)}
        disabled={isDisabled()}
        hasReset={false}
      >
        <Field label={t("Select language")}>
          <select
            className="admin-input"
            onChange={(e) =>
              dispatch({ type: "setLanguage", language: e.target.value })
            }
          >
            {supportedLanguages.map((language, i) => (
              <option key={`lang_${i}`} value={language}>
                {t(supportedLanguagesLabels[language] ?? language)}
              </option>
            ))}
          </select>
        </Field>
        {state.questionSuggestions.map((questionSuggestion, i) => {
          return (
            <Field label={t("Question") + ` ${i + 1}`} key={`question_${i}`}>
              <input
                type="text"
                autoFocus={true}
                className="admin-input"
                placeholder={t("Messages lower limit")}
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
        })}
      </FormContainer>
    </AdminContainer>
  );
}
