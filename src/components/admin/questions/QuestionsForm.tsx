import { useTranslation } from "react-i18next";
import { Fragment, useContext } from "react";
import { QuestionsContext } from "./questionsReducer.tsx";
import AdminContainer from "../AdminContainer.tsx";
import handleSubmission from "../../../lib/formSubmission.ts";
import FormContainer from "../FormContainer.tsx";
import LanguageDropDown from "./LanguageDropDown.tsx";
import QuestionField from "./QuestionField.tsx";
import ImageSvgDialogue from "../dialogue/ImageSvgDialogue.tsx";
import SuggestionButtons from "./SuggestionButtons.tsx";
import QuestionSuggestions from "./QuestionSuggestions.tsx";
import useQuestionsForm from "../../../hooks/admin/useQuestionsForm.tsx";

const QUESTION_MIN_LENGTH = 4;
const QUESTION_MAX_LENGTH = 1024;

export default function QuestionsForm() {
  const [t] = useTranslation();
  const { state } = useContext(QuestionsContext);
  const { addQuestion, onSubmit } = useQuestionsForm();

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
        onSubmit={handleSubmission(onSubmit, true)}
        disabled={isDisabled()}
        hasReset={false}
      >
        <LanguageDropDown />
        <div className="flex justify-end mt-8">
          <button className="btn" onClick={addQuestion}>
            {t("Add question")}
          </button>
        </div>
        {state.questionSuggestions.map((questionSuggestion, i) => {
          const questionLabel = "Question";
          return (
            <Fragment key={`question_${i}`}>
              <h3 className="pt-4 ml-3">
                {t(questionLabel)} {i + 1}
              </h3>
              <QuestionField i={i} questionSuggestion={questionSuggestion} />
              <QuestionSuggestions
                questionSuggestion={questionSuggestion}
                i={i}
              />
              {/* Buttons */}
              <SuggestionButtons questionId={questionSuggestion.id} />
            </Fragment>
          );
        })}
      </FormContainer>
    </AdminContainer>
  );
}
