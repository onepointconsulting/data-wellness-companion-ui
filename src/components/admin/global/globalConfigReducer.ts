import FormProperties from "../model/formProperties.ts";
import { MessageType } from "../model.ts";

export interface GlobalConfigState extends FormProperties {
  messageLowerLimit: number;
  messageLowerLimitValid: boolean;
  messageUpperLimit: number;
  messageUpperLimitValid: boolean;
  processing: boolean;
}

export const initialGlobalConfigState: GlobalConfigState = {
  messageLowerLimit: 8,
  messageLowerLimitValid: true,
  messageUpperLimit: 14,
  messageUpperLimitValid: true,
  processing: false,
  message: "",
  messageType: undefined,
};

function isNumber(value: string) {
  return !isNaN(Number(value));
}

export type GlobalConfigAction =
  | { type: "processing" }
  | { type: "setMessageLowerLimit"; messageLowerLimit: string }
  | { type: "setMessageUpperLimit"; messageUpperLimit: string }
  | { type: "setMessage"; message: string; messageType: MessageType };

const MINIMUM_STEPS = 4;

export function globalConfigurationReducer(
  state: GlobalConfigState,
  action: GlobalConfigAction,
) {
  const { type } = action;
  switch (type) {
    case "processing":
      return { ...state, processing: true };
    case "setMessageLowerLimit": {
      const lowerLimit = action.messageLowerLimit;
      const lowerLimitNumber = parseInt(lowerLimit);
      return {
        ...state,
        messageLowerLimit: lowerLimitNumber,
        messageLowerLimitValid:
          isNumber(action.messageLowerLimit) &&
          lowerLimitNumber > MINIMUM_STEPS &&
          lowerLimitNumber < state.messageUpperLimit,
      };
    }
    case "setMessageUpperLimit": {
      const upperLimit = action.messageUpperLimit;
      return {
        ...state,
        messageUpperLimit: parseInt(upperLimit),
        messageUpperLimitValid:
          isNumber(action.messageUpperLimit) &&
          parseInt(upperLimit) > state.messageLowerLimit,
      };
    }
    case "setMessage":
      return {
        ...state,
        message: action.message,
        messageType: action.messageType,
        processing: false,
      };
  }
}
