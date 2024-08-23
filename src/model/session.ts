import { Message } from "./message.ts";

export type Session = {
  id: string;
  timestamp: Date;
  finished?: boolean;
  language: string;
  messages: Message[];
};
