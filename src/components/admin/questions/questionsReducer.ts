import FormProperties from "../model/formProperties.ts";
import {MessageType} from "../model.ts";

export interface QuestionsConfigState extends FormProperties {
    questionSuggestions: QuestionSuggestion[];
    language: string
}

export interface QuestionSuggestion {
    id: number;
    question: string;
    suggestions: Suggestion[];
}

interface Suggestion {
    id: number;
    img_src: string;
    img_alt: string;
    title: string;
    main_text: string;
    svg_image: string;
}

export const initialQuestionsConfigState: QuestionsConfigState = {
    message: "", processing: false, questionSuggestions: [], language: "en"
}

export type QuestionsAction =
    | { type: "processing" }
    | { type: "setLanguage", language: string }
    | { type: "setQuestionSuggestions", questionSuggestions: QuestionSuggestion[], language: string }
    | { type: "setQuestion", questionSuggestion: QuestionSuggestion, index: number }
    | { type: "setSuggestion", suggestion: Suggestion, questionId: number, suggestionId: number }
    | { type: "setMessage"; message: string; messageType: MessageType }

function findQuestionIndex(questionSuggestions: QuestionSuggestion[], id: number) {
    return questionSuggestions.findIndex((q) => q.id === id)
}

export function questionsReducer(
    state: QuestionsConfigState,
    action: QuestionsAction,
) {
    const { type } = action;
    switch (type) {
        case "setQuestion": {
            const foundQuestionIndex = action.index;
            const updatedQuestions = [
                ...state.questionSuggestions.slice(0, foundQuestionIndex),
                action.questionSuggestion,
                ...state.questionSuggestions.slice(foundQuestionIndex + 1),
            ];
            return { ...state, questionSuggestions: updatedQuestions, processing: false };
        }
        case "setSuggestion": {
            const foundQuestionIndex = findQuestionIndex(state.questionSuggestions, action.questionId);
            if (foundQuestionIndex === -1) {
                return state; // No changes made
            }
            const foundQuestion = state.questionSuggestions[foundQuestionIndex];
            const foundSuggestionIndex = foundQuestion.suggestions.findIndex(
                (s) => s.id === action.suggestionId
            );
            if (foundSuggestionIndex === -1) {
                return state; // No changes made
            }
            const updatedSuggestions = [
                ...foundQuestion.suggestions.slice(0, foundSuggestionIndex),
                { ...action.suggestion },
                ...foundQuestion.suggestions.slice(foundSuggestionIndex + 1),
            ];
            const updatedQuestion = {
                ...foundQuestion,
                suggestions: updatedSuggestions,
            };
            const updatedQuestions = [
                ...state.questionSuggestions.slice(0, foundQuestionIndex),
                updatedQuestion,
                ...state.questionSuggestions.slice(foundQuestionIndex + 1),
            ];
            return { ...state, questionSuggestions: updatedQuestions };
        }
        case "setQuestionSuggestions":
            return {...state, questionSuggestions: action.questionSuggestions, language: action.language}
        case "setLanguage":
            return {...state, language: action.language}
        case "processing":
            return {...state, processing: true, message: ""}
        case "setMessage":
            return {...state, message: action.message,
                messageType: action.messageType,
                processing: false}

    }
}