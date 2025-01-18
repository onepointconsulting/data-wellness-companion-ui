import { useTranslation } from "react-i18next";
import {Fragment, useContext, useEffect} from "react";
import { ChatContext } from "../../../context/ChatContext.tsx";
import { QuestionsContext, QuestionSuggestion } from "./questionsReducer.tsx";
import AdminContainer from "../AdminContainer.tsx";
import handleSubmission from "../../../lib/formSubmission.ts";
import FormContainer from "../FormContainer.tsx";
import Field from "../token/Field.tsx";
import {
  getQuestions,
  handleError,
  handleJson,
  updateQuestion,
} from "../../../lib/admin/apiClient.ts";
import { MessageType } from "../model.ts";
import LanguageDropDown from "./LanguageDropDown.tsx";
import { Suggestion } from "../../../model/message.ts";

const QUESTION_MIN_LENGTH = 4;
const QUESTION_MAX_LENGTH = 1024;

export default function QuestionsForm() {
  const [t] = useTranslation();
  const { reportUrl } = useContext(ChatContext);
  const { state, dispatch } = useContext(QuestionsContext);

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
        suggestions: qs.suggestions
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
        <LanguageDropDown />
        {state.questionSuggestions.map((questionSuggestion, i) => {
          const questionLabel = "Question";
          return (
            <Fragment key={`question_${i}`}>
              <h3 className="ml-3 pt-4">{t(questionLabel)} {i + 1}</h3>
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
              <div className="container suggestions animate-fade-down">
                {questionSuggestion.suggestions.map((suggestion, j) => {
                  const suggestionLabel = t("Suggestion") + ` ${j + 1}`;
                  return (
                    <div className="suggestion group items-center" key={`question_${i}_suggestion_${j}`}>
                      <input
                        type="text"
                        className="admin-input"
                        placeholder={suggestionLabel}
                        value={suggestion.title}
                        onChange={(e) =>
                          onSuggestionsTitleChange(
                            e,
                            suggestion,
                            questionSuggestion.id,
                          )
                        }
                      />
                      <textarea
                        className="admin-input h-32"
                        onChange={(e) =>
                          onSuggestionsMainTextChange(
                            e,
                            suggestion,
                            questionSuggestion.id,
                          )
                        }
                        value={suggestion.main_text}
                      />
                    </div>
                  );
                })}
              </div>
            </Fragment>
          );
        })}
      </FormContainer>
    </AdminContainer>
  );
}
