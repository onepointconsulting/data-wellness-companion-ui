export interface GlobalConfigState {
  messageLowerLimit: number;
  messageLowerLimitValid: boolean;
  messageUpperLimit: number;
  messageUpperLimitValid: boolean;
  sending: boolean;
}

export const initialGlobalConfigState: GlobalConfigState = {
  messageLowerLimit: 8,
  messageLowerLimitValid: true,
  messageUpperLimit: 14,
  messageUpperLimitValid: true,
  sending: false,
};

export type GlobalConfigAction =
  | { type: "sending" }
  | { type: "setMessageLowerLimit"; messageLowerLimit: number }
  | { type: "setMessageUpperLimit"; messageUpperLimit: number };

export function globalConfigurationReducer(
  state: GlobalConfigState,
  action: GlobalConfigAction,
) {
  const { type } = action;
  switch (type) {
    case "sending":
      return { ...state, processing: true };
    case "setMessageLowerLimit":
      return { ...state, messageLowerLimit: action.messageLowerLimit };
    case "setMessageUpperLimit":
      return { ...state, messageUpperLimit: action.messageUpperLimit };
  }
}
