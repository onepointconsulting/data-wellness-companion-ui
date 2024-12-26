import { Message } from "./message.ts";

export interface Property {
  config_key: string;
  config_value: string;
}

interface GlobalConfiguration {
  properties: Property[];
}

export interface ServerMessage {
  session_id: string;
  server_messages: Message[];
  global_configuration: GlobalConfiguration;
}

export interface SingleMessage {
  session_id: string;
  question: string;
}

export enum GlobalProperties {
  MESSAGE_LOWER_LIMIT = "MESSAGE_LOWER_LIMIT",
  MESSAGE_UPPER_LIMIT = "MESSAGE_UPPER_LIMIT",
}
