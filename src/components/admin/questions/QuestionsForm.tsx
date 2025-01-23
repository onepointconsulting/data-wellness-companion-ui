import {useTranslation} from "react-i18next";
import {Fragment, useContext, useEffect} from "react";
import {ChatContext} from "../../../context/ChatContext.tsx";
import {QuestionsContext, QuestionSuggestion} from "./questionsReducer.tsx";
import AdminContainer from "../AdminContainer.tsx";
import handleSubmission from "../../../lib/formSubmission.ts";
import FormContainer from "../FormContainer.tsx";
import {getQuestions, handleError, handleJson, updateQuestion,} from "../../../lib/admin/apiClient.ts";
import {MessageType} from "../model.ts";
import LanguageDropDown from "./LanguageDropDown.tsx";
import QuestionField from "./QuestionField.tsx";
import QuestionTile from "./QuestionTile.tsx";
import ImageSvgDialogue from "../dialogue/ImageSvgDialogue.tsx";

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
      suggestions: qs.suggestions,
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
      <ImageSvgDialogue />
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
              <h3 className="ml-3 pt-4">
                {t(questionLabel)} {i + 1}
              </h3>
              <QuestionField i={i} questionSuggestion={questionSuggestion} />
              <div className="container suggestions animate-fade-down">
                {questionSuggestion.suggestions.map((suggestion, j) => {
                  return <QuestionTile questionSuggestion={questionSuggestion} suggestion={suggestion} j={j} key={`question_${i}_suggestion_${j}`} />
                })}
              </div>
            </Fragment>
          );
        })}
      </FormContainer>
    </AdminContainer>
  );
}
