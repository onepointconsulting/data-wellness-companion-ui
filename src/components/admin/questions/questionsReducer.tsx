import FormProperties from "../model/formProperties.ts";
import { MessageType } from "../model.ts";
import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { Suggestion } from "../../../model/message.ts";

export interface QuestionsConfigState extends FormProperties {
  questionSuggestions: QuestionSuggestion[];
  editSuggestion: Suggestion | null;
  language: string;
}

export interface QuestionSuggestion {
  id: number;
  question: string;
  suggestions: Suggestion[];
}

export const initialQuestionsConfigState: QuestionsConfigState = {
  message: "",
  processing: false,
  questionSuggestions: [],
  editSuggestion: null,
  language: "en",
};

export type QuestionsAction =
  | { type: "processing" }
  | { type: "setLanguage"; language: string }
  | {
      type: "setQuestionSuggestions";
      questionSuggestions: QuestionSuggestion[];
      language: string;
    }
  | {
      type: "setQuestion";
      questionSuggestion: QuestionSuggestion;
      index: number;
    }
  | {
      type: "setSuggestion";
      suggestion: Suggestion;
      questionId: number;
    }
  | { type: "setMessage"; message: string; messageType: MessageType }
    | { type: "editSuggestionSvg"; editSuggestion: Suggestion, editQuestion: QuestionSuggestion };

function findQuestionIndex(
  questionSuggestions: QuestionSuggestion[],
  id: number,
) {
  return questionSuggestions.findIndex((q) => q.id === id);
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
      return {
        ...state,
        questionSuggestions: updatedQuestions,
        processing: false,
      };
    }
    case "setSuggestion": {
      const foundQuestionIndex = findQuestionIndex(
        state.questionSuggestions,
        action.questionId,
      );
      if (foundQuestionIndex === -1) {
        return state; // No changes made
      }
      const foundQuestion = state.questionSuggestions[foundQuestionIndex];
      const foundSuggestionIndex = foundQuestion.suggestions.findIndex(
        (s) => s.id === action.suggestion.id,
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
      return {
        ...state,
        questionSuggestions: action.questionSuggestions,
        language: action.language,
      };
    case "setLanguage":
      return { ...state, language: action.language, message: "" };
    case "processing":
      return { ...state, processing: true, message: "" };
    case "setMessage":
      return {
        ...state,
        message: action.message,
        messageType: action.messageType,
        processing: false,
      };
    case "editSuggestionSvg":
      return {
        ...state,
        editSuggestion: action.editSuggestion,
        editQuestion: action.editQuestion
      }
  }
}

export interface QuestionsState {
  state: QuestionsConfigState;
  dispatch: Dispatch<QuestionsAction>;
}

export const QuestionsContext = createContext<QuestionsState>({
  state: initialQuestionsConfigState,
  dispatch: () => null,
});

export const QuestionsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    questionsReducer,
    initialQuestionsConfigState,
  );
  return (
    <QuestionsContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestionsContext.Provider>
  );
};
