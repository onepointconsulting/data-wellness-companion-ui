import FormProperties from "../model/formProperties.ts";
import { MessageType } from "../model.ts";
import { createContext, Dispatch, ReactNode, useReducer } from "react";
import { Suggestion } from "../../../model/message.ts";

export interface QuestionsConfigState extends FormProperties {
  questionSuggestions: QuestionSuggestion[];
  editSuggestion: Suggestion | null;
  editQuestion: QuestionSuggestion | null;
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
  editQuestion: null,
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
  | {
      type: "editSuggestionSvg";
      editSuggestion: Suggestion;
      editQuestion: QuestionSuggestion;
    }
  | {
      type: "saveSuggestionSvg";
      editSuggestion: Suggestion;
      editQuestion: QuestionSuggestion;
    }
  | {
      type: "addSuggestion";
      questionId: number;
    };

function findQuestionIndex(
  questionSuggestions: QuestionSuggestion[],
  id: number
) {
  return questionSuggestions.findIndex((q) => q.id === id);
}

function findSuggestionIndex(
  foundQuestion: QuestionSuggestion,
  suggestion: Suggestion
): number {
  return foundQuestion.suggestions.findIndex((s) => s.id === suggestion.id);
}

function rebuildQuestions(
  foundQuestion: QuestionSuggestion,
  updatedSuggestions: Suggestion[],
  state: QuestionsConfigState,
  foundQuestionIndex: number
) {
  const updatedQuestion: QuestionSuggestion = {
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

function rebuildQuestion(
  state: QuestionsConfigState,
  questionId: number,
  suggestion: Suggestion
) {
  const foundQuestionIndex = findQuestionIndex(
    state.questionSuggestions,
    questionId
  );
  if (foundQuestionIndex === -1) {
    return state; // No changes made
  }
  const foundQuestion = state.questionSuggestions[foundQuestionIndex];
  const foundSuggestionIndex = findSuggestionIndex(foundQuestion, suggestion);
  if (foundSuggestionIndex === -1) {
    return state; // No changes made
  }
  const updatedSuggestions = [
    ...foundQuestion.suggestions.slice(0, foundSuggestionIndex),
    { ...suggestion },
    ...foundQuestion.suggestions.slice(foundSuggestionIndex + 1),
  ];

  return rebuildQuestions(
    foundQuestion,
    updatedSuggestions,
    state,
    foundQuestionIndex
  );
}

function addSuggestion(state: QuestionsConfigState, questionId: number) {
  const foundQuestionIndex = findQuestionIndex(
    state.questionSuggestions,
    questionId
  );
  if (foundQuestionIndex === -1) {
    return state; // No changes made
  }
  const foundQuestion = state.questionSuggestions[foundQuestionIndex];
  const newSuggestion = {
    id: 0,
    img_alt: "",
    img_src: "",
    title: "",
    main_text: "",
    svg_image: "",
  };
  const updatedSuggestions = [...foundQuestion.suggestions, newSuggestion];

  return rebuildQuestions(
    foundQuestion,
    updatedSuggestions,
    state,
    foundQuestionIndex
  );
}

export function questionsReducer(
  state: QuestionsConfigState,
  action: QuestionsAction
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
    case "setSuggestion":
      return rebuildQuestion(state, action.questionId, action.suggestion);
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
        editQuestion: action.editQuestion,
      };
    case "saveSuggestionSvg": {
      return rebuildQuestion(
        state,
        action.editQuestion.id,
        action.editSuggestion
      );
    }

    case "addSuggestion": {
      const questionId = action.questionId;
      return addSuggestion(state, questionId);
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
    initialQuestionsConfigState
  );
  return (
    <QuestionsContext.Provider value={{ state, dispatch }}>
      {children}
    </QuestionsContext.Provider>
  );
};
