import {useContext, useEffect, useState} from "react";
import {
    QuestionsConfigState,
    QuestionsContext,
    QuestionSuggestion
} from "../../components/admin/questions/questionsReducer.tsx";
import {getQuestions, handleError, handleJson, updateQuestion} from "../../lib/admin/apiClient.ts";
import {MessageType} from "../../components/admin/model.ts";
import {ChatContext} from "../../context/ChatContext.tsx";
import {useTranslation} from "react-i18next";
import {scrollBottom} from "../../lib/scrollFunctions.ts";


function convertToUpdate(state: QuestionsConfigState) {
    return state.questionSuggestions.map((qs) => ({
        id: qs.id,
        question: qs.question,
        suggestions: qs.suggestions,
        language: state.language
    }));
}

export default function useQuestionsForm() {
    const [t] = useTranslation();
    const { state, dispatch } = useContext(QuestionsContext);
    const { reportUrl } = useContext(ChatContext);
    const [updateCounter, setUpdateCounter] = useState<number>(0);

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
    }, [state.language, updateCounter]);

    function addQuestion(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        const questionSuggestion: QuestionSuggestion = {
            id: 0,
            question: "Dummy question",
            suggestions: []
        }
        dispatch({type: "addQuestion", questionSuggestion})
        scrollBottom()
    }

    function onSubmit() {
        const questionUpdate = convertToUpdate(state);
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
                    setUpdateCounter(updateCounter + 1);
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

    return { addQuestion, onSubmit }
}