import FormProperties from "../model/formProperties.ts";
import { MessageType } from "../model.ts";


export interface GlobalConfigurationProperty {
  config_key: string;
  config_value: string;
}

export interface GlobalConfigState extends FormProperties {
  properties: GlobalConfigurationProperty[];
}

export const initialGlobalConfigState: GlobalConfigState = {
  properties: [],
  processing: false,
  message: "",
  messageType: undefined,
};

export type GlobalConfigAction =
  | { type: "processing" }
  | { type: "setProperty"; config_key: string; config_value: string }
  | { type: "setProperties"; properties: GlobalConfigurationProperty[] }
  | { type: "setMessage"; message: string; messageType: MessageType };

export function globalConfigurationReducer(
  state: GlobalConfigState,
  action: GlobalConfigAction,
): GlobalConfigState {
  switch (action.type) {
    case "processing":
      return { ...state, processing: true };
    case "setProperties": {
      const { properties } = action;
      return { ...state, properties };
    }
    case "setProperty": {
      const { config_key, config_value } = action;
      // update the property in the state
      const newProperties = state.properties.map((property) => {
        if (property.config_key === config_key) {
          return { ...property, config_value };
        }
        return property;
      });
      return {
        ...state,
        properties: newProperties,
      };
    }
    case "setMessage": {
      const { message, messageType } = action;
      return {
        ...state,
        processing: false,
        message,
        messageType,
      };
    }
    default:
      return state;
  }
}
