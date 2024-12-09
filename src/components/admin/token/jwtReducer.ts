import { MessageType } from "../model.ts";

export enum GenerationMode {
  SINGLE = "single",
  BULK = "bulk",
}

export interface State {
  name: string;
  email: string;
  generatedToken?: string;
  message?: string;
  messageType?: MessageType;
  processing: boolean;
  copied: boolean;
  generationAmount: number;
  generationMode: GenerationMode;
}

export type Action =
  | { type: "generating" }
  | { type: "generated"; generatedToken: string }
  | { type: "setName"; name: string }
  | { type: "setEmail"; email: string }
  | { type: "setMessage"; message: string; messageType: MessageType }
  | { type: "setGenerationAmount"; generationAmount: number }
  | { type: "setGenerationMode"; generationMode: GenerationMode }
  | { type: "setCopied" }
  | { type: "reset" };

export const initialState: State = {
  name: "",
  email: "",
  processing: false,
  copied: false,
  generationAmount: 1,
  generationMode: GenerationMode.SINGLE,
};

export function tokenReducer(state: State, action: Action): State {
  const type = action.type;
  switch (type) {
    case "setName":
      return { ...state, name: action.name };
    case "setEmail":
      return { ...state, email: action.email };
    case "setMessage":
      return {
        ...state,
        message: action.message,
        messageType: action.messageType,
        processing: false,
      };
    case "generating":
      return { ...state, processing: true, generatedToken: "", copied: false };
    case "setGenerationAmount":
      return {
        ...state,
        generationAmount:
          action.generationAmount < 1 ? 1 : action.generationAmount,
      };
    case "setGenerationMode":
      return { ...state, generationMode: action.generationMode };
    case "generated":
      return {
        ...state,
        generatedToken: action.generatedToken,
        processing: false,
        copied: false,
        message: "",
      };
    case "setCopied":
      return { ...state, copied: true };
    case "reset":
      return {
        name: "",
        email: "",
        generatedToken: "",
        message: "",
        processing: false,
        copied: false,
        generationAmount: 1,
        generationMode: GenerationMode.SINGLE,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
}
